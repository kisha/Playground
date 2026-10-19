"""Tests run against their own database, migrated to head, so development data is never touched."""

import asyncio
import os

TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5433/playground_test"
)
# Must be set before app settings are imported; real env vars override the .env files.
os.environ["DATABASE_URL"] = TEST_DATABASE_URL

import asyncpg  # noqa: E402
import pytest  # noqa: E402
from alembic.config import Config  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from alembic import command  # noqa: E402
from app.core.config import SERVER_ROOT  # noqa: E402
from app.main import app  # noqa: E402

# asyncpg itself takes a plain postgresql:// URL, without SQLAlchemy's driver suffix.
_ASYNCPG_URL = TEST_DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")


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
    asyncio.run(_create_test_database_if_missing())
    command.upgrade(Config(toml_file=str(SERVER_ROOT / "pyproject.toml")), "head")


@pytest.fixture(autouse=True)
def clean_tables() -> None:
    asyncio.run(_empty_tables())


@pytest.fixture
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client
