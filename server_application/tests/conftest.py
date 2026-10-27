"""Tests run against their own database, migrated to head, so development data is never touched.

They use the same kind of database the app is set up for (`mise run db:choose`): PostgreSQL by
default, SQLite if chosen. `mise run api:test-sqlite` runs them on SQLite either way.
"""

import asyncio
import os
import sqlite3
from pathlib import Path

from dotenv import dotenv_values
from sqlalchemy.engine import make_url

_CONFIGURED_URL = os.getenv("DATABASE_URL") or dotenv_values(
    Path(__file__).resolve().parents[1] / ".env.development"
).get("DATABASE_URL", "")


def _default_test_database_url() -> str:
    """The configured database, but a separate test copy: playground_dev becomes playground_test."""
    if not _CONFIGURED_URL:
        return "postgresql+asyncpg://postgres:postgres@localhost:5433/playground_test"
    url = make_url(_CONFIGURED_URL)
    database = Path(url.database or "playground_dev")
    test_name = database.stem.removesuffix("_dev") + "_test"
    # SQLite: a file next to the development one. PostgreSQL: a database on the same server.
    is_sqlite = url.drivername.startswith("sqlite")
    test_database = database.with_stem(test_name) if is_sqlite else test_name
    return url.set(database=str(test_database)).render_as_string(hide_password=False)


TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", _default_test_database_url())
# Must be set before app settings are imported; real env vars override the .env files.
os.environ["DATABASE_URL"] = TEST_DATABASE_URL

import asyncpg  # noqa: E402
import pytest  # noqa: E402
from alembic.config import Config  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from alembic import command  # noqa: E402
from app.core.config import SERVER_ROOT, settings  # noqa: E402
from app.main import app  # noqa: E402

# asyncpg itself takes a plain postgresql:// URL, without SQLAlchemy's driver suffix.
_ASYNCPG_URL = TEST_DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")


# SQLite keeps the whole database in one file.
_SQLITE_PATH = (
    Path(make_url(settings.async_database_url).database or "")
    if settings.database_engine == "sqlite"
    else None
)


async def _create_test_database_if_missing() -> None:
    server_url, database_name = _ASYNCPG_URL.rsplit("/", 1)
    connection = await asyncpg.connect(f"{server_url}/postgres")
    try:
        exists = await connection.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1", database_name
        )
        if not exists:
            await connection.execute(f'CREATE DATABASE "{database_name}"')
    finally:
        await connection.close()


async def _empty_tables() -> None:
    connection = await asyncpg.connect(_ASYNCPG_URL)
    try:
        await connection.execute("TRUNCATE documents")
    finally:
        await connection.close()


@pytest.fixture(scope="session", autouse=True)
def migrated_database() -> None:
    if _SQLITE_PATH:
        _SQLITE_PATH.unlink(missing_ok=True)  # start from an empty file every run
    else:
        asyncio.run(_create_test_database_if_missing())
    command.upgrade(Config(toml_file=str(SERVER_ROOT / "pyproject.toml")), "head")


@pytest.fixture(autouse=True)
def clean_tables() -> None:
    if _SQLITE_PATH:
        with sqlite3.connect(_SQLITE_PATH) as connection:
            connection.execute("DELETE FROM documents")
    else:
        asyncio.run(_empty_tables())


@pytest.fixture
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client
