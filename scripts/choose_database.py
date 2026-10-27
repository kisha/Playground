"""Choose this Playground's database: PostgreSQL (the default) or SQLite.

Run once, early, when setting up an organization's Playground:  mise run db:choose sqlite
It rewrites DATABASE_URL in server_application/.env.development. That file is committed, so everyone
working on that organization's Playground uses the same database. Contributors to Playground keep PostgreSQL.
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SERVER_ENV = REPO_ROOT / "server_application" / ".env.development"
CHOICES = ("postgresql", "sqlite")


def compose_settings() -> dict[str, str]:
    """The POSTGRES_* values from .env, falling back to .env.example."""
    values: dict[str, str] = {}
    for name in (".env.example", ".env"):
        path = REPO_ROOT / name
        if not path.exists():
            continue
        for line in path.read_text().splitlines():
            key, separator, value = line.partition("=")
            if separator and not key.lstrip().startswith("#"):
                values[key.strip()] = value.strip()
    return values


def database_url(choice: str) -> str:
    """The DATABASE_URL for a choice, named after POSTGRES_DB so both databases share one name."""
    settings = compose_settings()
    name = settings["POSTGRES_DB"]
    if choice == "sqlite":
        return f"sqlite:///./{name}.db"
    user, password, port = (
        settings["POSTGRES_USER"],
        settings["POSTGRES_PASSWORD"],
        settings["POSTGRES_PORT"],
    )
    return f"postgresql+asyncpg://{user}:{password}@localhost:{port}/{name}"


def main(arguments: list[str]) -> None:
    if len(arguments) != 1 or arguments[0] not in CHOICES:
        sys.exit("Usage: mise run db:choose postgresql|sqlite  (PostgreSQL is the default)")
    choice = arguments[0]
    url = database_url(choice)

    text = SERVER_ENV.read_text()
    updated, replaced = re.subn(
        r"^DATABASE_URL=.*$", f"DATABASE_URL={url}", text, count=1, flags=re.MULTILINE
    )
    if not replaced:
        sys.exit(f"No DATABASE_URL line found in {SERVER_ENV.relative_to(REPO_ROOT)}")
    SERVER_ENV.write_text(updated)

    if choice == "sqlite":
        print(f"Database: SQLite, in server_application/{url.removeprefix('sqlite:///./')}")
        print("No Docker needed: `mise run db` has nothing to start.")
    else:
        print("Database: PostgreSQL (the default), started in Docker by `mise run db`.")
    print("Commit server_application/.env.development so everyone on this organization's Playground uses it.")
    print("Switching later starts an empty database; data does not move across.")


if __name__ == "__main__":
    main(sys.argv[1:])
