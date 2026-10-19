# Playground

A reusable monorepo starter: a Next.js frontend talking to a FastAPI backend backed by PostgreSQL 18 + pgvector.
It's a monorepo, not a monolith: `client_application` and `server_application` each deploy on their own.

```
Playground/
├── client_application/   # Next.js + Tailwind + shadcn/ui charts + pele (coming in Step 3)
├── server_application/   # FastAPI + SQLAlchemy 2.x + Alembic + pgvector
├── docker-compose.yml    # Local Postgres 18 + pgvector
└── mise.toml             # Pinned toolchain (bun, node, python, uv) + every day-to-day command
```

## Prerequisites

- [Docker](https://www.docker.com/) (or [OrbStack](https://orbstack.dev/)), running
- [mise](https://mise.jdx.dev), which installs everything else (bun, Node, Python 3.14, uv) at the pinned versions

## Run it locally

All commands run from the `Playground/` folder. `mise tasks` lists every command.

**1. Install the toolchain** (first time only)

```bash
mise install
```

**2. Start the database**: Postgres 18 + pgvector on `localhost:5433`

```bash
mise run db
```

**3. Install backend dependencies and set up the database schema**

```bash
mise run api:install
mise run api:migrate
```

**4. Start the API**

```bash
mise run api:dev
```

Leave this terminal open. The API is ready when it prints `Uvicorn running on http://127.0.0.1:8000`.

**5. Check it works**

- http://localhost:8000/api/v1/health should return `"status": "ok"` and `"database": {"status": "connected"}`.
- http://localhost:8000/docs opens the interactive API docs (Swagger UI), where you should see:

![Swagger UI showing the health and documents endpoints](server_application/docs/swagger-endpoints.png)

To try pgvector, open **POST /api/v1/documents**, click **Try it out**, add a few documents, then use
**POST /api/v1/documents/search** to find the most similar ones.

**6. Stop everything**

Press `Ctrl+C` in the API terminal, then:

```bash
mise run db:down     # stops Postgres; your data is kept
```

See [server_application/README.md](server_application/README.md) for every endpoint and command.

## Environments

Every app knows which environment it is running in through `APP_ENV`:

| `APP_ENV`     | Purpose                         |
|---------------|---------------------------------|
| `development` | Local machine (default)         |
| `staging`     | Pre-production (placeholder)    |
| `production`  | Live (placeholder)              |

`NODE_ENV` is not used for this because it only distinguishes development from production.

Env file conventions:

- `.env.example` / `.env.<environment>`: committed templates and non-secret defaults.
- `.env` / `.env.<environment>.local`: real values and secrets, never committed.

## Libraries Included

Items marked *available* are installed and ready to import but not yet wired into a feature.

### Tooling

- [mise](https://mise.jdx.dev): Toolchain manager that pins the exact bun, Node, Python and uv versions for the whole repo, so every machine runs the same setup.
- [bun](https://bun.sh): Fast JavaScript runtime and package manager used to install and run `client_application`.

### Frontend (User Interface & Visuals)

- [Next.js](https://nextjs.org/): React framework used to build fast, server-rendered web applications, with request-level route protection through its proxy (formerly middleware) and client state management.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework used to build modern, responsive, dark-mode user interfaces with high design consistency.
- [shadcn/ui Charts](https://ui.shadcn.com/charts): A collection of customizable React chart components built on Recharts and styled with Tailwind CSS variables for custom EdTech donut rings, line trends, and bar graphs.
- [Recharts](https://recharts.org/): The SVG charting engine driving shadcn/ui Charts, responsible for smooth in-chart path drawing and slice growth animations.
- [pele](https://pele.run): A small, dependency-free renderer that turns Mermaid diagram text into SVG, themed with CSS variables so diagrams follow light and dark mode without re-rendering.
- [jose](https://github.com/panva/jose): *Available.* A lightweight JavaScript security library for verifying login tokens in the Next.js proxy on the edge before protected pages load.

### Backend & API

- [FastAPI](https://fastapi.tiangolo.com/): A high-performance Python web framework used for API routing, background PDP file upload processing, and query translation.
- [uv](https://github.com/astral-sh/uv): An extremely fast Python package installer and dependency resolver written in Rust that speeds up project setup and builds.
- [SQLAlchemy 2.x](https://www.sqlalchemy.org/): Typed, async ORM used to define database models and run queries from FastAPI.
- [Pydantic](https://docs.pydantic.dev/): Validates incoming request data and serializes responses to JSON; FastAPI is built on it.
- [PyJWT](https://pyjwt.readthedocs.io/): *Available.* Issues and verifies signed JWT tokens containing user roles.
- [bcrypt](https://github.com/pyca/bcrypt): *Available.* Hashes passwords with a deliberately slow, salted algorithm so stored passwords can't be reversed or cheaply guessed.
- [Pandas](https://pandas.pydata.org/) / [Polars](https://pola.rs/): *Available.* High-speed Python data processing libraries used to parse, clean, and aggregate multi-column PDP AR files in seconds. Polars does the heavy lifting; Pandas covers libraries that expect it; [pyarrow](https://arrow.apache.org/docs/python/) converts between them.

### Database & AI Engine

- [PostgreSQL 18](https://www.postgresql.org/): An enterprise-grade open-source relational database used for secure storage of student records using standard tables and binary JSONB fields.
- [pgvector](https://github.com/pgvector/pgvector): Postgres extension that stores embeddings as vector columns and finds the most similar rows with fast, indexed similarity search.
- [Alembic](https://alembic.sqlalchemy.org/): Database migration tool for SQLAlchemy that records every schema change as a versioned script, so every environment's database can be upgraded or rolled back the same way.
