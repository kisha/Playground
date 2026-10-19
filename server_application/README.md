# server_application

FastAPI backend for Playground: Python 3.14, SQLAlchemy 2.x (async), Alembic, PostgreSQL 18 + pgvector.
Deployable on its own: it needs only this folder and a `DATABASE_URL`.

## Layout

```
app/
├── main.py            # create_app(): middleware, routers, lifespan
├── core/config.py     # Settings, resolved from APP_ENV
├── core/errors.py     # One JSON shape for every error
├── db/base.py         # Base (naming convention), UUIDv7 + timestamp mixins
├── db/session.py      # Async engine, get_session dependency
├── models/            # SQLAlchemy models (import each in models/__init__.py)
├── schemas/           # Pydantic request/response models
├── services/          # Business logic; routes stay thin
├── api/dependencies.py  # SessionDep, EmbedderDep: shared by every route module
└── api/v1/routes/     # HTTP endpoints
alembic/               # Migrations (config in pyproject.toml [tool.alembic])
tests/
```

## Environments

`APP_ENV` selects `development` (default), `staging` or `production`, then settings load from:

1. `.env.<APP_ENV>`: committed, non-secret defaults
2. `.env.<APP_ENV>.local`: git-ignored secrets and personal overrides
3. Real environment variables, which always win (this is how hosts inject secrets)

Staging and production refuse to start without `DATABASE_URL`. `postgres://` URLs from hosting
providers are converted to the asyncpg driver automatically.

## Run locally

Start the database first from the repo root (`mise run db`), then:

```bash
mise run api:install   # first time only: install dependencies
mise run api:dev       # apply any pending migrations, then start on http://localhost:8000
```

Or with uv directly, from this folder (no automatic migrations):

```bash
uv sync                          # install dependencies into .venv
uv run alembic upgrade head      # apply migrations
uv run fastapi dev app/main.py   # start with auto-reload on http://localhost:8000
```

### Database migrations

`mise run api:dev` applies pending migrations before starting, so a fresh checkout just works. It's
controlled by `AUTO_MIGRATE` (default `true`), which is local development only: staging and production run
migrations as a deliberate deploy step.

```bash
AUTO_MIGRATE=false mise run api:dev   # skip for one run
```

To skip it permanently on your machine, add this to `Playground/mise.local.toml` (git-ignored):

```toml
[env]
AUTO_MIGRATE = "false"
```

The behaviour itself lives in the `api:dev` task in `Playground/mise.toml`.

### Check it works

Open http://localhost:8000/api/v1/health to confirm the API and database are connected. You should see
something like this (your `latency_ms` will differ):

![Health check response showing status ok, environment development and database connected](docs/health-response.png)

Open http://localhost:8000/docs to see and try every endpoint:

![Swagger UI showing the health, documents and sandbox endpoints](docs/swagger-endpoints.png)

## Commands (from the repo root)

| Command | What it does |
|---|---|
| `mise run api:install` | Install dependencies (`uv sync`) |
| `mise run api:dev` | Apply pending migrations, then run with reload on http://localhost:8000 (docs at `/docs`) |
| `mise run api:migrate` | Apply migrations |
| `mise run api:migration "..."` | Autogenerate a migration from model changes |
| `mise run api:migrate-down` | Roll back one migration |
| `mise run api:test` | Run tests |
| `mise run api:lint` / `mise run api:format` | Ruff lint / auto-fix + format |

## Endpoints

All under `/api/v1`. Try them at http://localhost:8000/docs.

| Method | Path | What it does |
|---|---|---|
| `GET` | `/health` | Environment, version, database status (`503` if the database is down) |
| `POST` | `/documents` | Store text and its vector embedding |
| `GET` | `/documents` | List documents, newest first (`limit`, `offset`) |
| `GET` | `/documents/{id}` | Fetch one document |
| `DELETE` | `/documents/{id}` | Delete a document |
| `POST` | `/documents/search` | Most similar documents to a query, via pgvector cosine distance |
| `GET` | `/sandbox/kpis` | Headline measures, including splits like Female / Male 64 / 36 |
| `GET` | `/sandbox/gateway-completion` | Gateway English vs math, last six terms |
| `GET` | `/sandbox/term-enrollment` | Term-to-term enrollment, last six terms |
| `GET` | `/sandbox/credit-completion` | First-year credit completion, new vs transfer, fall cohorts 2020 to 2025 |
| `GET` | `/sandbox/persistence-retention` | Persistence vs retention, fall cohorts, with definitions |
| `GET` | `/sandbox/completion-by-group` | First-year credit completion per student group |
| `GET` | `/sandbox/persistence-by-age` | Persistence and gateway completion per age group |
| `GET` | `/sandbox/time-to-complete` | Average terms to completion per entry term |

### Errors

Every error uses the same JSON shape, so clients can always show a readable message:

```json
{"error": {"status": 404, "code": "not_found", "message": "No endpoint matches GET /api/v1/nope.",
           "path": "/api/v1/nope", "docs": "/docs"}}
```

| Situation | Status | `code` |
|---|---|---|
| Unknown endpoint (points to `/docs` outside production) | 404 | `not_found` |
| Missing resource, e.g. a deleted document | 404 | `not_found` |
| Wrong HTTP method | 405 | `method_not_allowed` |
| Invalid request body or query (lists each field in `details`) | 422 | `validation_error` |
| Unexpected server error (details stay in the server log) | 500 | `internal_error` |

The handlers live in `app/core/errors.py`.

### Sandbox

The `/sandbox` endpoints return **mock** data shaped like PDP Analysis-Ready (AR) file outputs: the same
measures, labels, cohort filters ("Fall entry", "New + Transfer") and definitions (persistence =
continuing anywhere, retention = staying at the institution) as the project briefs. Every response has
`meta` (title, takeaway, fields used, `"source": "mock"`) and `rows` or `items`. They power the client's
example charts. They live in `routes/sandbox.py`, `schemas/sandbox.py` and
`services/sandbox.py`; replace the service functions with real queries, or delete the three files.

They are controlled by `SANDBOX_ENABLED` (default `true`). `.env.production` sets it to `false`, so a
deployed API never serves mock data.

Embeddings come from `HashingEmbedder` in `app/services/embeddings.py`: it needs no model or API
key, and matches shared words rather than meaning. For semantic search, implement the `Embedder`
protocol with a real model and return it from `get_embedder()`.

Tests use a separate `playground_test` database (created and migrated automatically), so they
never touch development data.

## Libraries Included

Items marked *available* are installed and ready to import but not yet wired into a feature. Items marked *needs setup* (jose, PyJWT, bcrypt) also need configuration first: authentication (signing keys, a users table, login) is intentionally not built yet.

### Back End: Python

- [FastAPI](https://fastapi.tiangolo.com/): A high-performance Python web framework used for API routing, background PDP file upload processing, and query translation.
- [uv](https://github.com/astral-sh/uv): An extremely fast Python package installer and dependency resolver written in Rust that speeds up project setup and builds.
- [SQLAlchemy 2.x](https://www.sqlalchemy.org/): Typed, async ORM used to define database models and run queries from FastAPI.
- [Alembic](https://alembic.sqlalchemy.org/): Database migration tool for SQLAlchemy that records every schema change as a versioned script, so every environment's database can be upgraded or rolled back the same way.
- [Pydantic](https://docs.pydantic.dev/): Validates incoming request data and serializes responses to JSON; FastAPI is built on it.
- [PyJWT](https://pyjwt.readthedocs.io/): *Available, needs setup:* issuing tokens needs a signing key in settings and login endpoints. Issues and verifies signed JWT tokens containing user roles (`import jwt`).
- [bcrypt](https://github.com/pyca/bcrypt): *Available, needs setup:* needs a users table and sign-up/login endpoints to hash and check passwords. Hashes passwords with a deliberately slow, salted algorithm so stored passwords can't be reversed or cheaply guessed (`bcrypt.hashpw` / `bcrypt.checkpw`).

### Data Processing

- [Pandas](https://pandas.pydata.org/) / [Polars](https://pola.rs/): *Available.* High-speed Python data processing libraries used to parse, clean, and aggregate multi-column PDP AR files in seconds. Polars does the heavy lifting; Pandas covers libraries that expect it; [pyarrow](https://arrow.apache.org/docs/python/) converts between them (`df.to_pandas()`, `pl.from_pandas(df)`).

### Data Store

- [PostgreSQL 18](https://www.postgresql.org/): An enterprise-grade open-source relational database used for secure storage of student records using standard tables and binary JSONB fields.
- [pgvector](https://github.com/pgvector/pgvector): Postgres extension that stores embeddings as vector columns and finds the most similar rows with fast, indexed similarity search.

## Conventions

- **Alembic owns the schema.** The app never calls `create_all`. Review every autogenerated
  migration, then check it with `mise run api:migrate`, `api:migrate-down` and `api:migrate` again.
- **IDs are UUIDv7:** `uuid.uuid7()` in Python, `uuidv7()` in Postgres. Use `UUIDPrimaryKeyMixin`.
- **Serialization is Pydantic v2:** return schema objects from routes; no custom JSON response class.
