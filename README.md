![Playground landing page in dark mode: live health checks travel from the Client Application to the Server Application and Data](client_application/docs/landing-live.gif)

# dev/color Playground

dev/color Playground is a ready-to-use monorepo starter kit: a Next.js **Client Application** and a
FastAPI + PostgreSQL **Server Application**, so teams skip setup and start building features.

**Contents:** [Why Playground](#why-playground) · [Tech Stack](#tech-stack-summary) ·
[How to use this template](#how-to-use-this-template) · [How to run it locally](#how-to-run-it-locally) · [Commands](#commands) ·
[Troubleshooting](#troubleshooting) · [Reference](#reference)

---

## Why Playground

- **One repo, independent apps:** The Client and Server Applications live together but run, scale and
  deploy separately.
- **Features, not setup:** Infrastructure is done, so teams build analytics and content delivery from
  day one.
- **Python for AI/ML:** The Server Application has direct access to open-source AI and machine learning
  libraries.

## Tech Stack Summary

| Layer | Language(s) | Framework | What it gives |
|---|---|---|---|
| **Front End** | TypeScript | Next.js · Tailwind CSS · shadcn/ui Charts | Server-rendered pages, light/dark mode, charts |
| **Back End** | Python | FastAPI · SQLAlchemy 2.1.5 · Alembic · uv | Typed JSON API with versioned migrations |
| **Data Processing** | Python | Polars · Pandas | Fast cleaning and aggregating of large files |
| **Data Store** | SQL | PostgreSQL 18 · pgvector | Relational data plus similarity search |
| **Tooling** | — | mise · bun · Docker | Pinned versions, one command per task |

### Core languages and libraries

Click a layer to see the libraries. *Available* = installed, not yet used.\
*Needs setup* = authentication pieces, intentionally not built.

<details open>
<summary><strong>Front End: TypeScript</strong></summary>

- [Next.js](https://nextjs.org/): Server-rendered React framework with route protection via its proxy.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first styling with dark mode.
- [shadcn/ui Charts](https://ui.shadcn.com/charts): Donut, line and bar chart components.
- [Recharts](https://recharts.org/): SVG engine behind shadcn/ui Charts.
- [next-themes](https://github.com/pacocoursey/next-themes): Light/dark mode that follows the OS, no flash on load.
- [pele](https://pele.run): *Available.* Renders Mermaid diagrams as themed SVG.
- [jose](https://github.com/panva/jose): *Available, needs setup.* Verifies login tokens in the proxy.

</details>

<details>
<summary><strong>Back End: Python</strong></summary>

- [FastAPI](https://fastapi.tiangolo.com/): Fast Python API framework.
- [uv](https://github.com/astral-sh/uv): Fast package installer, written in Rust.
- [SQLAlchemy 2.1.5](https://www.sqlalchemy.org/): Typed, async ORM for models and queries.
- [Alembic](https://alembic.sqlalchemy.org/): Versioned database migrations, upgrade or roll back.
- [Pydantic](https://docs.pydantic.dev/): Validates requests and serializes responses.
- [PyJWT](https://pyjwt.readthedocs.io/): *Available, needs setup.* Issues and verifies JWT tokens.
- [bcrypt](https://github.com/pyca/bcrypt): *Available, needs setup.* Salted password hashing.

</details>

<details>
<summary><strong>Data Processing</strong></summary>

- [Polars](https://pola.rs/) / [Pandas](https://pandas.pydata.org/): *Available.* Parse, clean and aggregate PDP AR files; Polars does the heavy lifting, [pyarrow](https://arrow.apache.org/docs/python/) converts between them.

</details>

<details>
<summary><strong>Data Store</strong></summary>

- [PostgreSQL 18](https://www.postgresql.org/): Relational database with JSONB support.
- [pgvector](https://github.com/pgvector/pgvector): Stores embeddings and finds similar rows fast.

</details>

<details>
<summary><strong>Tooling</strong></summary>

- [mise](https://mise.jdx.dev): Installs and pins versions of almost any language or tool (e.g., Node,
  Python, Rust, Ruby, Go, Java and more). Here it pins bun, Node, Python and uv, and runs every command.
- [bun](https://bun.sh): JavaScript runtime and package manager.
- [Docker](https://www.docker.com/): Runs PostgreSQL locally.

</details>

---

## How to use this template

Each institution gets its own copy named **`[YourInstitution]_Playground`** (for example,
`UTTC_Playground`).

### Setup 1: Create a Playground for your institution

Create an empty **private** repository on GitHub (no README, .gitignore or license), then clone
Playground into it.

**a. Set your two names**

```bash
# Your institution's short name, e.g. UTTC
INSTITUTION=YourInstitution

# The GitHub user or organization that will own the copy
GITHUB_ACCOUNT=your-account
```

**b. Create the repository and clone Playground**

```bash
# Or create it on github.com
gh repo create "${GITHUB_ACCOUNT}/${INSTITUTION}_Playground" --private

git clone git@github.com:kisha/Playground.git "${INSTITUTION}_Playground"
cd "${INSTITUTION}_Playground"
```

**c. Point it at your new repository**

```bash
# Keep a link back to Playground
git remote rename origin template

git remote add origin "git@github.com:${GITHUB_ACCOUNT}/${INSTITUTION}_Playground.git"
git push -u origin main
```

Your repository now has Playground's files. Later, to bring in template updates:

```bash
git pull template main
```

### Setup 2: Make it yours

Swap in your institution's name. Examples use `YourInstitution`.

**a. Brand the Client Application**

Put your logo in `client_application/public/brand/`, then set the name:

```ts
// client_application/src/content/brand.ts  (name, logo, footer credit)
name: "YourInstitution Playground"
```

Link the landing page to your repository (copy `.env.example` to `.env.local` first):

```bash
# client_application/.env.local
NEXT_PUBLIC_REPOSITORY_URL=https://github.com/<your-account>/YourInstitution_Playground
```

**b. Name the Server Application**

```bash
# server_application/.env.development
PROJECT_NAME="YourInstitution Playground API"
```

**c. Name the database and Docker project**

```yaml
# docker-compose.yml
name: yourinstitution_playground
```

```bash
# .env
POSTGRES_DB=yourinstitution_dev
POSTGRES_PORT=5434
```

Then match the database name and port in the Server Application:

```bash
# server_application/.env.development
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5434/yourinstitution_dev
```

If you changed the port, also set `TEST_DATABASE_URL` so the tests can find the database.

---

## How to run it locally

**Prerequisites:** Git, [Docker](https://www.docker.com/) or [OrbStack](https://orbstack.dev/) (open and
running), [mise](https://mise.jdx.dev) and [bun](https://bun.sh). mise installs everything else.

```bash
brew install mise
brew install oven-sh/bun/bun
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
```

---

## Server Application (Back End)

A FastAPI API on Python 3.14 that reads and writes PostgreSQL and serves vector search.
📁 [`server_application/`](server_application/) · [README](server_application/README.md)

### Step 3: Start the Server Application (FastAPI)

Installs dependencies, applies any pending migrations, then starts with auto-reload.

```bash
mise run api:install && mise run api:dev
```

Check it: http://localhost:8000/api/v1/health

![Health check response: status ok, database connected](server_application/docs/health-response.png)

### Step 4: Explore the endpoints

Every endpoint, ready to try in the browser: http://localhost:8000/docs ·
[code](server_application/app/api/v1/routes/)

![Swagger UI showing the health, documents and sandbox endpoints](server_application/docs/swagger-endpoints.png)

### Step 5: Run the tests

All tests should pass. They use their own `playground_test` database.

```bash
mise run api:test
```

---

## Client Application (Front End)

A Next.js web interface in TypeScript, black and white with light and dark modes, that gets all of
its data from the Server Application.
📁 [`client_application/`](client_application/) · [README](client_application/README.md)

### Step 6: Start the Client Application (Next.js)

In a second terminal (the Server Application keeps running in the first):

```bash
mise run web:install && mise run web:dev
```

Open http://localhost:3000. It should say **All systems connected**:

![Landing page: all systems connected](client_application/docs/landing-light.png)

### Step 7: Explore the sandbox

The **sandbox** is where you test new features and preview how charts and graphs will look before
they go into the real app. All data is mock data, and the sandbox is turned off in production.

Open http://localhost:3000/sandbox to:

- **Try the API:** send real requests to the Server Application and see the responses
  ([`/sandbox#api`](http://localhost:3000/sandbox#api)).
- **Preview charts:** each chart loads its own `/api/v1/sandbox/...` endpoint.

![Gateway completion request and its JSON response: meta plus one row per term](client_application/docs/sandbox-gateway-request.png)

<details>
<summary><strong>See the example charts</strong></summary>

![KPI cards](client_application/docs/sandbox-kpis.png)

![Trend charts: gateway completion, term-to-term enrollment, credit completion, persistence and retention](client_application/docs/sandbox-trend-charts.png)

![Bar charts: completion by student group, persistence by age, time to complete](client_application/docs/sandbox-bar-charts.png)

</details>

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

<details>
<summary><strong>Database</strong></summary>

| Command | What it does |
|---|---|
| `mise run setup` | Create the local `.env` from `.env.example` (safe to re-run; `db` runs it for you) |
| `mise run db` | Start PostgreSQL 18 + pgvector and wait until it is healthy |
| `mise run db:down` | Stop PostgreSQL (data is kept) |
| `mise run db:logs` | Follow the PostgreSQL logs |
| `mise run db:shell` | Open a SQL prompt (`\q` to exit) |
| `mise run db:reset` | Delete all data and start a fresh database |

</details>

<details>
<summary><strong>Server Application</strong></summary>

| Command | What it does |
|---|---|
| `mise run api:install` | Install dependencies with uv |
| `mise run api:dev` | Apply pending migrations, then run on http://localhost:8000 with auto-reload |
| `AUTO_MIGRATE=false mise run api:dev` | Same, but skip the migrations |
| `mise run api:test` | Run the tests |
| `mise run api:lint` | Check linting and formatting |
| `mise run api:format` | Fix lint issues and format the code |
| `mise run api:migrate` | Apply all pending migrations |
| `mise run api:migrate-down` | Roll back the most recent migration |
| `mise run api:migration "message"` | Create a migration from model changes |

</details>

<details>
<summary><strong>Client Application</strong></summary>

| Command | What it does |
|---|---|
| `mise run web:install` | Install dependencies with bun |
| `mise run web:dev` | Run on http://localhost:3000 with hot reload |
| `mise run web:lint` | Lint and type-check |
| `mise run web:build` | Production build |
| `mise run web:build-staging` | Staging build |
| `mise run web:start` | Serve the last build on http://localhost:3000 |

</details>

---

## Troubleshooting

| You see | Cause | Fix |
|---|---|---|
| **Server application unreachable** on the landing page | The API isn't running | `mise run api:dev` |
| **Server application up, database unreachable** | The database is stopped | `mise run db` |
| `port is already allocated` / `address already in use` | Something else uses 5433, 8000 or 3000 | Stop it, or change `POSTGRES_PORT` in `.env` and the port in `DATABASE_URL` |
| `Cannot connect to the Docker daemon` | Docker or OrbStack isn't open | Open it, then `mise run db` |
| `500` errors after pulling changes | Migrations not applied | `mise run api:migrate` |

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

---

Made with ♥ by dev/color.
