# Playground

A reusable monorepo starter: a Next.js frontend talking to a FastAPI backend backed by PostgreSQL 18 + pgvector.

```
Playground/
├── client_playground/   # Next.js + Tailwind + shadcn/ui + jose        (coming in Step 3)
├── server_playground/   # FastAPI + SQLAlchemy 2.0 + Alembic + pgvector (coming in Step 2)
├── docker-compose.yml   # Local Postgres 18 + pgvector
└── Makefile             # Every day-to-day command
```

## Prerequisites

- Docker (or OrbStack)
- [uv](https://github.com/astral-sh/uv) for Python
- [bun](https://bun.sh) for JavaScript

## Getting started

```bash
make help   # list commands
make db     # start Postgres on localhost:5433
```

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
