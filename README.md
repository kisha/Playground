# dev/color Playground
![Playground landing page in dark mode: live health checks travel from the Client Application to the Server Application and Data](client_application/docs/landing-live.gif)

dev/color Playground is a reusable, lightly pre-configured starter kit for applications.

The architecture consists of a **Client Application** built with Next.js, Tailwind CSS, and
shadcn/charts, paired with a **Server Application** powered by FastAPI and PostgreSQL with native
vector search.

Our foundational monorepo aims to accelerate project kickoff, allowing teams to focus on building core features.

**Contents:** [Why Playground](#why-playground) · [Use this template](#use-this-template) ·
[Run it locally](#run-it-locally) · [Server Application](#server-application-back-end) ·
[Client Application](#client-application-front-end) · [Commands](#commands) ·
[Troubleshooting](#troubleshooting) · [Reference](#reference)

---

## Why Playground

### The Monorepo Advantage

- **Centralized Code, Independent Scaling:** The Client Application and Server Application live in a
  single repository for easy management, but they run, scale, and deploy completely independently.
- **Accelerated Feature Delivery:** Skips infrastructure setup so teams can immediately build platform
  features, learning analytics, or content delivery systems using a modern tech stack.
- **AI-Ready Infrastructure:** The Server Application features native vector search and semantic
  search, with a Python-based FastAPI setup ready to integrate deep learning libraries like PyTorch.
- **Decoupled Performance:** Independent deployment allows the Client Application interface to remain
  highly responsive while the Server Application backend scales separately to process heavy assessment
  data.

### Why Python & FastAPI for AI/ML

- **Native Ecosystem Integration:** The Server Application was built on Python to provide direct,
  seamless access to the vast majority of open-source AI and machine learning libraries.

### Stack at a glance

| Layer | Built with | What it gives you |
|---|---|---|
| **Front End** | TypeScript · Next.js · Tailwind CSS · shadcn/ui Charts | Server-rendered pages, light and dark modes, ready-made charts |
| **Back End** | Python · FastAPI · SQLAlchemy · Alembic · uv | A typed, documented JSON API with versioned database changes |
| **Data Processing** | Polars · Pandas | Fast reading, cleaning and aggregating of large data files |
| **Data Store** | PostgreSQL 18 · pgvector | Relational storage plus similarity search, in one database |
| **Tooling** | mise · bun · Docker | Pinned tool versions and one command for every task |

---

## Use this template

Each institution gets its own copy named **`[YourInstitution]_Playground`** (for example,
`UTTC_Playground`).

### 1. Create a Playground for Your Institution

Create an empty **private** repository on GitHub (no README, .gitignore or license), then clone
Playground into it. Set your two names on the first lines:

```bash
INSTITUTION=YourInstitution     # your institution's short name, e.g. UTTC
GITHUB_ACCOUNT=your-account     # the GitHub user or organization that will own the copy

gh repo create "${GITHUB_ACCOUNT}/${INSTITUTION}_Playground" --private   # or create it on github.com
git clone git@github.com:kisha/Playground.git "${INSTITUTION}_Playground"
cd "${INSTITUTION}_Playground"
git remote rename origin template      # keep a link back to Playground
git remote add origin "git@github.com:${GITHUB_ACCOUNT}/${INSTITUTION}_Playground.git"
git push -u origin main
```

Your repository now has Playground's files. Later, to bring in template updates:

```bash
git pull template main
```

### 2. Make it yours

Change these values (examples use `YourInstitution`):

| What | Where | Example |
|---|---|---|
| Name, logo, footer credit | `client_application/src/content/brand.ts` | `name: "YourInstitution Playground"` |
| Logo image | `client_application/public/brand/` | your logo file |
| Repository link on the landing page | `client_application/.env.local` (copy `.env.example`) | `NEXT_PUBLIC_REPOSITORY_URL=https://github.com/<your-account>/YourInstitution_Playground` |
| API title in the docs | `server_application/.env.development` | `PROJECT_NAME="YourInstitution Playground API"` |
| Docker project name | `docker-compose.yml` (`name:`) | `yourinstitution_playground` |
| Database name and port | `.env` (created by `mise run db`) **and** `DATABASE_URL` in `server_application/.env.development`; for a new port also set `TEST_DATABASE_URL` | `POSTGRES_DB=yourinstitution_dev`, `POSTGRES_PORT=5434` |

---

## Run it locally

**Prerequisites:** Git, [Docker](https://www.docker.com/) or [OrbStack](https://orbstack.dev/) (open and
running), and [mise](https://mise.jdx.dev). mise installs everything else.

```bash
brew install mise
```

**Quick start** (two terminals, from the repository folder):

```bash
# Terminal 1
mise trust && mise install                      # first time only
mise run db                                     # PostgreSQL on localhost:5433
mise run api:install && mise run api:dev        # Server Application on http://localhost:8000

# Terminal 2
mise run web:install && mise run web:dev        # Client Application on http://localhost:3000
```

### Step 1: Install the toolchain

Install the pinned versions of bun, Node, Python and uv.

```bash
mise trust && mise install
```

### Step 2: Start the database

Run PostgreSQL 18 with pgvector in Docker; it ends with `Container playground-db-1 Healthy`.

```bash
mise run db

# Optional
mise run db:shell     # open a SQL prompt (\q to exit)
mise run db:reset     # delete all data and start fresh
```

---

## Server Application (Back End)

A FastAPI API on Python 3.14 that reads and writes PostgreSQL and serves vector search.
📁 [`server_application/`](server_application/) · [README](server_application/README.md)

### Step 3: Install its dependencies

```bash
mise run api:install
```

### Step 4: Start the Server Application (FastAPI)

Applies any pending migrations, then starts with auto-reload.

```bash
mise run api:dev

# Optional: start without applying migrations
AUTO_MIGRATE=false mise run api:dev
```

Check it: http://localhost:8000/api/v1/health

![Health check response: status ok, database connected](server_application/docs/health-response.png)

### Step 5: Explore the endpoints

Every endpoint, ready to try in the browser: http://localhost:8000/docs ·
[code](server_application/app/api/v1/routes/)

![Swagger UI showing the health, documents and sandbox endpoints](server_application/docs/swagger-endpoints.png)

### Step 6: Run the tests

Expect `24 passed`; tests use their own `playground_test` database.

```bash
mise run api:test
```

---

## Client Application (Front End)

A Next.js web interface in TypeScript, black and white with light and dark modes, that gets all of
its data from the Server Application.
📁 [`client_application/`](client_application/) · [README](client_application/README.md)

### Step 7: Install its dependencies

In a second terminal (the Server Application keeps running in the first):

```bash
mise run web:install
```

### Step 8: Start the Client Application (Next.js)

```bash
mise run web:dev
```

Open http://localhost:3000. It should say **All systems connected**:

![Landing page: all systems connected](client_application/docs/landing-light.png)

### Step 9: Try the API from the Client Application

Send real requests to the Server Application and see the responses: http://localhost:3000/sandbox#api

Endpoints: [Swagger](http://localhost:8000/docs) · [code](server_application/app/api/v1/routes/)

![Gateway completion request and its JSON response: meta plus one row per term](client_application/docs/sandbox-gateway-request.png)

### Step 10: Examples from `/sandbox`

Example charts on http://localhost:3000/sandbox. Each chart loads its own `/api/v1/sandbox/...` endpoint.
All data is mock data.

![KPI cards](client_application/docs/sandbox-kpis.png)

![Trend charts: gateway completion, term-to-term enrollment, credit completion, persistence and retention](client_application/docs/sandbox-trend-charts.png)

![Bar charts: completion by student group, persistence by age, time to complete](client_application/docs/sandbox-bar-charts.png)

### Step 11: Check the code

Lint, type-check and build; the build lists `/`, `/sandbox` and `/_not-found`.

```bash
mise run web:lint && mise run web:build
```

### When you're done

Press `Ctrl+C` in each terminal, then stop the database (your data is kept):

```bash
mise run db:down
```

---

## Commands

Run from the repository folder. To print this list:

```bash
mise tasks
```

**Database**

| Command | What it does |
|---|---|
| `mise run setup` | Create the local `.env` from `.env.example` (safe to re-run; `db` runs it for you) |
| `mise run db` | Start PostgreSQL 18 + pgvector and wait until it is healthy |
| `mise run db:down` | Stop PostgreSQL (data is kept) |
| `mise run db:logs` | Follow the PostgreSQL logs |
| `mise run db:shell` | Open a SQL prompt (`\q` to exit) |
| `mise run db:reset` | Delete all data and start a fresh database |

**Server Application**

| Command | What it does |
|---|---|
| `mise run api:install` | Install dependencies with uv |
| `mise run api:dev` | Apply pending migrations, then run on http://localhost:8000 with auto-reload |
| `mise run api:test` | Run the tests |
| `mise run api:lint` | Check linting and formatting |
| `mise run api:format` | Fix lint issues and format the code |
| `mise run api:migrate` | Apply all pending migrations |
| `mise run api:migrate-down` | Roll back the most recent migration |
| `mise run api:migration "message"` | Create a migration from model changes |

**Client Application**

| Command | What it does |
|---|---|
| `mise run web:install` | Install dependencies with bun |
| `mise run web:dev` | Run on http://localhost:3000 with hot reload |
| `mise run web:lint` | Lint and type-check |
| `mise run web:build` | Production build |
| `mise run web:build-staging` | Staging build |
| `mise run web:start` | Serve the last build on http://localhost:3000 |

---

## Troubleshooting

| You see | Cause | Fix |
|---|---|---|
| **Server application unreachable** on the landing page | The API isn't running | `mise run api:dev` |
| **Server application up, database unreachable** | The database is stopped | `mise run db` |
| `port is already allocated` / `address already in use` | Something else uses 5433, 8000 or 3000 | Stop it, or change `POSTGRES_PORT` in `.env` and the port in `DATABASE_URL` |
| `Cannot connect to the Docker daemon` | Docker or OrbStack isn't open | Open it, then `mise run db` |
| `/documents` returns `500` after pulling changes | Migrations not applied | `mise run api:migrate` |
| Styles look stale after pulling changes | The dev server cached old CSS | Restart `mise run web:dev` |
| `mise` asks to trust the config | First run in this folder | `mise trust` |

**Server application unreachable** looks like this; start the API and it recovers within 5 seconds:

![Landing page with the Server Application stopped](client_application/docs/landing-offline.png)

---

## Reference

### Environment Configuration

Both the Client Application and the Server Application dynamically identify their environment
(`development`, `staging` or `production`) via `APP_ENV` (server) and `NEXT_PUBLIC_APP_ENV` (client).

The production environment automatically disables the API documentation and the sandbox.

**Server Application**

- **Defaults:** Public, non-secret defaults are stored in `server_application/.env.<environment>`.
- **Secrets:** Sensitive credentials must reside in git-ignored `.env.<environment>.local` files or host
  environment variables.

**Client Application**

- **Defaults:** Default configurations live in `client_application/src/lib/env.ts`.
- **Overrides:** Local changes go in a git-ignored `.env.local` file.
- **Security:** All client-side values are exposed to the browser and must never contain secrets.

### Repository layout

```
Playground/
├── client_application/   # Front End: Next.js (see its README)
├── server_application/   # Back End: FastAPI (see its README)
├── docker-compose.yml    # Local PostgreSQL 18 + pgvector
└── mise.toml             # Tool versions + every command
```

### Core languages and libraries

Items marked *available* are installed but not yet used by a feature. Items marked *needs setup*
(jose, PyJWT, bcrypt) also need configuration first: authentication (signing keys, a users table,
login) is intentionally not built.

<details>
<summary><strong>Front End: TypeScript</strong></summary>

- [Next.js](https://nextjs.org/): React framework used to build fast, server-rendered web applications, with request-level route protection through its proxy (formerly middleware) and client state management.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework used to build modern, responsive, dark-mode user interfaces with high design consistency.
- [shadcn/ui Charts](https://ui.shadcn.com/charts): Customizable React chart components built on Recharts and styled with Tailwind CSS variables for donut rings, line trends and bar graphs.
- [Recharts](https://recharts.org/): The SVG charting engine driving shadcn/ui Charts.
- [next-themes](https://github.com/pacocoursey/next-themes): Light and dark mode that follows the operating system until the user chooses, with no flash on load.
- [pele](https://pele.run): *Available.* A small, dependency-free renderer that turns Mermaid diagram text into SVG, themed with CSS variables so diagrams follow light and dark mode.
- [jose](https://github.com/panva/jose): *Available, needs setup:* verifies login tokens in the Next.js proxy before protected pages load; needs the API's signing key (or public key) and a `proxy.ts`.

</details>

<details>
<summary><strong>Back End: Python</strong></summary>

- [FastAPI](https://fastapi.tiangolo.com/): High-performance Python web framework used for API routing, background PDP file upload processing and query translation.
- [uv](https://github.com/astral-sh/uv): Extremely fast Python package installer and dependency resolver, written in Rust.
- [SQLAlchemy 2.x](https://www.sqlalchemy.org/): Typed, async ORM used to define database models and run queries.
- [Alembic](https://alembic.sqlalchemy.org/): Records every schema change as a versioned migration, so every environment's database can be upgraded or rolled back the same way.
- [Pydantic](https://docs.pydantic.dev/): Validates incoming request data and serializes responses to JSON; FastAPI is built on it.
- [PyJWT](https://pyjwt.readthedocs.io/): *Available, needs setup:* issues and verifies signed JWT tokens containing user roles; needs a signing key in settings and login endpoints.
- [bcrypt](https://github.com/pyca/bcrypt): *Available, needs setup:* hashes passwords with a deliberately slow, salted algorithm; needs a users table and sign-up/login endpoints.

</details>

<details>
<summary><strong>Data Processing</strong></summary>

- [Pandas](https://pandas.pydata.org/) / [Polars](https://pola.rs/): *Available.* High-speed Python data processing libraries used to parse, clean and aggregate multi-column PDP AR files in seconds. Polars does the heavy lifting; Pandas covers libraries that expect it; [pyarrow](https://arrow.apache.org/docs/python/) converts between them.

</details>

<details>
<summary><strong>Data Store</strong></summary>

- [PostgreSQL 18](https://www.postgresql.org/): Enterprise-grade open-source relational database used for secure storage of student records in standard tables and binary JSONB fields.
- [pgvector](https://github.com/pgvector/pgvector): Postgres extension that stores embeddings as vector columns and finds the most similar rows with fast, indexed similarity search.

</details>

<details>
<summary><strong>Tooling</strong></summary>

- [mise](https://mise.jdx.dev): Pins the exact bun, Node, Python and uv versions and runs every day-to-day command.
- [bun](https://bun.sh): Fast JavaScript runtime and package manager used to install and run the Client Application.
- [Docker](https://www.docker.com/): Runs PostgreSQL locally without installing it.

</details>

---

Made with ♥ by dev/color.
