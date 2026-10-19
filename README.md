# Playground

## Intention

Playground is a **reusable starter** for data applications: a web front end and an API back end that
already talk to each other, backed by a database with vector search. Copy it to start a new project
with the foundation done, then spend your time on features instead of setup.

It's a **monorepo, not a monolith**: the Client Application and Server Application live in one repository
but run and deploy independently, and talk to each other only over HTTP.

## Tech Stack at a Glance

| Layer | Built with | What it gives you |
|---|---|---|
| **Front End** | TypeScript · Next.js · Tailwind CSS · shadcn/ui Charts · jose | Fast, server-rendered pages, consistent light and dark styling, ready-made charts, and token checks at the edge |
| **Back End** | Python · FastAPI · SQLAlchemy · Alembic · uv | A typed, documented JSON API with versioned database changes |
| **Data Processing** | Python · Polars · Pandas | Fast reading, cleaning and aggregating of large data files |
| **Data Store** | PostgreSQL 18 · pgvector | Reliable relational storage plus similarity search over embeddings, in one database |
| **Tooling** | mise · bun · Docker | One command installs the exact tool versions; one command runs each piece |

## Repository Layout

```
Playground/
├── client_application/   # Front End: Next.js
├── server_application/   # Back End: FastAPI
├── docker-compose.yml    # Local PostgreSQL 18 + pgvector
└── mise.toml             # Pinned tool versions + every day-to-day command (`mise tasks`)
```

## Getting Started

**Prerequisites:** [Docker](https://www.docker.com/) (or [OrbStack](https://orbstack.dev/)) running, and
[mise](https://mise.jdx.dev). mise installs everything else at the pinned versions.

From the `Playground/` folder:

```bash
mise install     # first time only: bun, Node, Python 3.14, uv
mise run db      # start PostgreSQL 18 + pgvector on localhost:5433
```

Then start the Server Application, then the Client Application, as described below.
Stop the database with `mise run db:down`; your data is kept.

---

## Client Application (Front End)

📁 [`client_application/`](client_application/) · [Full README](client_application/README.md)

The web interface people use: a Next.js app written in TypeScript, styled with Tailwind CSS in black and
white with light and dark modes (Inter font), using shadcn/ui Charts for data visualizations. It calls the
Server Application for all of its data.

**Run it** (with the Server Application already running, in a second terminal):

```bash
mise run web:install   # first time only: install dependencies
mise run web:dev       # start on http://localhost:3000 with hot reload
```

Open http://localhost:3000. With the database and API running, you should see **All systems connected**
and a live Client Application → Server Application → Data diagram that checks the API every 5 seconds:

![Landing page showing all systems connected](client_application/docs/landing-light.png)

If the database or API is down, the page shows which one. See the
[client README](client_application/README.md#what-you-should-see) for each state.

---

## Server Application (Back End)

📁 [`server_application/`](server_application/) · [Full README](server_application/README.md)

The API: a FastAPI app on Python 3.14 that validates requests, reads and writes PostgreSQL, and serves
vector similarity search through pgvector.

**Run it** (with the database already started):

```bash
mise run api:install   # first time only: install dependencies
mise run api:dev       # apply any pending migrations, then start on http://localhost:8000
```

Leave this terminal open. The API is ready when it prints `Server started at http://127.0.0.1:8000`.

**Database migrations: automatic locally**

Migrations build and update the database tables. `mise run api:dev` applies any pending ones before
starting, so a fresh checkout (or a `git pull` that brings new migrations) just works. When the database
is already up to date, this step does nothing.

To turn it off for one run:

```bash
AUTO_MIGRATE=false mise run api:dev
```

To turn it off on your machine, create `Playground/mise.local.toml` (git-ignored, so it only affects you):

```toml
[env]
AUTO_MIGRATE = "false"
```

Then run migrations yourself when needed:

```bash
mise run api:migrate        # apply pending migrations
mise run api:migrate-down   # undo the most recent one
```

This is for local development only. Staging and production run migrations as a deliberate deploy step.

**Check it works:**

- http://localhost:8000/api/v1/health should show something like this (your `latency_ms` will differ):

![Health check response showing status ok, environment development and database connected](server_application/docs/health-response.png)

- http://localhost:8000/docs opens the interactive API docs (Swagger UI):

![Swagger UI showing the health, documents and sandbox endpoints](server_application/docs/swagger-endpoints.png)

To try pgvector, open **POST /api/v1/documents**, click **Try it out**, add a few documents, then use
**POST /api/v1/documents/search** to find the most similar ones. Press `Ctrl+C` to stop the API.

---

## Environments

Both applications know which environment they are running in: `APP_ENV` on the server,
`NEXT_PUBLIC_APP_ENV` on the client.

| `APP_ENV`     | Purpose                         |
|---------------|---------------------------------|
| `development` | Local machine (default)         |
| `staging`     | Pre-production (placeholder)    |
| `production`  | Live (placeholder)              |

`NODE_ENV` is not used for this because it only distinguishes development from production.

- **Server:** `server_application/.env.<environment>` holds committed, non-secret defaults; secrets go in
  git-ignored `.env.<environment>.local` files or the host's environment variables.
- **Client:** defaults for each environment live in `client_application/src/lib/env.ts`; override them
  in a git-ignored `.env.local`. Client values ship to the browser, so they are never secret.

## Core Languages and Libraries

Items marked *available* are installed and ready to import but not yet wired into a feature. Items marked *needs setup* (jose, PyJWT, bcrypt) also need configuration first: authentication (signing keys, a users table, login) is intentionally not built yet.

### Front End: TypeScript

- [Next.js](https://nextjs.org/): React framework used to build fast, server-rendered web applications, with request-level route protection through its proxy (formerly middleware) and client state management.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework used to build modern, responsive, dark-mode user interfaces with high design consistency.
- [shadcn/ui Charts](https://ui.shadcn.com/charts): A collection of customizable React chart components built on Recharts and styled with Tailwind CSS variables for custom EdTech donut rings, line trends, and bar graphs.
- [Recharts](https://recharts.org/): The SVG charting engine driving shadcn/ui Charts, responsible for smooth in-chart path drawing and slice growth animations.
- [next-themes](https://github.com/pacocoursey/next-themes): Light and dark mode that follows the operating system until the user chooses, with no flash on load.
- [pele](https://pele.run): *Available.* A small, dependency-free renderer that turns Mermaid diagram text into SVG, themed with CSS variables so diagrams follow light and dark mode without re-rendering.
- [jose](https://github.com/panva/jose): *Available, needs setup:* verifying tokens needs the API's signing key (or public key) and a Next.js `proxy.ts`. A lightweight JavaScript security library for verifying login tokens in the Next.js proxy on the edge before protected pages load.

### Back End: Python

- [FastAPI](https://fastapi.tiangolo.com/): A high-performance Python web framework used for API routing, background PDP file upload processing, and query translation.
- [uv](https://github.com/astral-sh/uv): An extremely fast Python package installer and dependency resolver written in Rust that speeds up project setup and builds.
- [SQLAlchemy 2.x](https://www.sqlalchemy.org/): Typed, async ORM used to define database models and run queries from FastAPI.
- [Alembic](https://alembic.sqlalchemy.org/): Database migration tool for SQLAlchemy that records every schema change as a versioned script, so every environment's database can be upgraded or rolled back the same way.
- [Pydantic](https://docs.pydantic.dev/): Validates incoming request data and serializes responses to JSON; FastAPI is built on it.
- [PyJWT](https://pyjwt.readthedocs.io/): *Available, needs setup:* issuing tokens needs a signing key in settings and login endpoints. Issues and verifies signed JWT tokens containing user roles.
- [bcrypt](https://github.com/pyca/bcrypt): *Available, needs setup:* needs a users table and sign-up/login endpoints to hash and check passwords. Hashes passwords with a deliberately slow, salted algorithm so stored passwords can't be reversed or cheaply guessed.

### Data Processing

- [Pandas](https://pandas.pydata.org/) / [Polars](https://pola.rs/): *Available.* High-speed Python data processing libraries used to parse, clean, and aggregate multi-column PDP AR files in seconds. Polars does the heavy lifting; Pandas covers libraries that expect it; [pyarrow](https://arrow.apache.org/docs/python/) converts between them.

### Data Store

- [PostgreSQL 18](https://www.postgresql.org/): An enterprise-grade open-source relational database used for secure storage of student records using standard tables and binary JSONB fields.
- [pgvector](https://github.com/pgvector/pgvector): Postgres extension that stores embeddings as vector columns and finds the most similar rows with fast, indexed similarity search.

### Tooling

- [mise](https://mise.jdx.dev): Toolchain manager that pins the exact bun, Node, Python and uv versions for the whole repo and runs every day-to-day command (`mise tasks`).
- [bun](https://bun.sh): Fast JavaScript runtime and package manager used to install and run the Client Application.
