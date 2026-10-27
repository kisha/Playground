"""Choose this Playground's database: PostgreSQL or SQLite. Both work equally well.

Run once, early:  mise run db:choose postgresql  (or sqlite)
- An organization's Playground (it has a `playground` remote, from Setup 1): writes DATABASE_URL to
  server_application/.env.development. Commit it so the whole team uses the same database.
- Contributing to Playground (no `playground` remote): writes DATABASE_URL to the git-ignored
  server_application/.env.development.local, so your choice stays on your machine.
"""

import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SERVER_ENV = REPO_ROOT / "server_application" / ".env.development"
LOCAL_ENV = REPO_ROOT / "server_application" / ".env.development.local"
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
        sys.exit("Usage: mise run db:choose postgresql|sqlite")
    choice = arguments[0]
    url = database_url(choice)

    target = SERVER_ENV if is_organization_playground() else LOCAL_ENV
    text = target.read_text() if target.exists() else ""
    if not re.search(r"^DATABASE_URL=", text, flags=re.MULTILINE):
        if target == SERVER_ENV:
            sys.exit(f"No DATABASE_URL line found in {SERVER_ENV.relative_to(REPO_ROOT)}")
        text += ("" if not text or text.endswith("\n") else "\n") + "DATABASE_URL=\n"
    target.write_text(
        re.sub(r"^DATABASE_URL=.*$", f"DATABASE_URL={url}", text, count=1, flags=re.MULTILINE)
    )

    if choice == "sqlite":
        print(f"Database: SQLite, in server_application/{url.removeprefix('sqlite:///./')}")
        print("No Docker needed: `mise run db` has nothing to start.")
    else:
        print("Database: PostgreSQL, started in Docker by `mise run db`.")
    if target == SERVER_ENV:
        print("Commit server_application/.env.development so your whole team uses the same database.")
    else:
        print("Saved in server_application/.env.development.local (git-ignored), just for you.")
    print("Switching later starts an empty database; data does not move across.")


def is_organization_playground() -> bool:
    """An organization's Playground keeps a `playground` remote back to Playground (Setup 1)."""
    remotes = subprocess.run(
        ["git", "remote"], cwd=REPO_ROOT, capture_output=True, text=True, check=False
    ).stdout.split()
    return "playground" in remotes


if __name__ == "__main__":
    main(sys.argv[1:])
