# client_application

Next.js front end for Playground: TypeScript, Tailwind CSS, shadcn/ui Charts, Inter, light and dark
modes. It gets all of its data from `server_application` over HTTP.
Deployable on its own: it needs only this folder and the API's URL.

## Layout

```
src/
├── app/            # Routes only: layout.tsx, page.tsx, globals.css. Rendering, no logic.
├── components/
│   ├── landing/    # Landing page sections: live status, system diagram, tracker, sparkline, stack cards
│   └── ui/         # shadcn/ui components (button, card, chart)
├── content/        # Text shown on pages: stack.ts (what's inside), brand.ts (header name + logo)
├── hooks/          # React hooks, e.g. use-health-monitor.ts (polls /health every 5s)
├── lib/
│   ├── env.ts            # Which environment we're in + its settings
│   ├── api-client.ts     # The single place that calls the API
│   ├── system-status.ts  # Turns a health check into Website / API / Database states
│   └── utils.ts          # cn() for merging Tailwind classes
└── services/       # One file per API resource, e.g. health.ts
public/brand/       # Logo files (swap the logo in src/content/brand.ts, or set it to null)
docs/               # Screenshots used in the READMEs
```

**Rule of thumb:** files in `app/` decide *what to show*. Fetching data, calling the API, reading the
environment and any other logic lives in `lib/`, `services/` and `hooks/`, so it can be reused and
tested without a page.

## Run locally

Start the database and API first (see the root README), then from the repo root:

```bash
mise run web:install   # first time only: install dependencies
mise run web:dev       # start on http://localhost:3000 with hot reload
```

Or with bun directly, from this folder:

```bash
bun install
bun run dev
```

### What you should see

Open http://localhost:3000. With the API and database running, the landing page shows
**All systems connected**, a live Client Application → Server Application → Data diagram, and a tracker that fills in every
5 seconds:

![Landing page in light mode, all systems connected](docs/landing-light.png)

It follows your system's light or dark setting; the moon/sun button switches it:

![Landing page in dark mode](docs/landing-dark.png)

If something is down, the page says so. Here the database is stopped: its box turns dashed and the
tracker blocks turn striped:

![Landing page with the database stopped](docs/landing-degraded.png)

| Status | Meaning | Looks like |
|---|---|---|
| All systems connected | API and database answering | Solid, pulsing dots and blocks |
| Server application up, database unreachable | Start the database: `mise run db` | Striped blocks, dashed Data box |
| Server application unreachable | Start the API: `mise run api:dev` | Outlined blocks, dashed server box |

### When something goes wrong

Addresses that don't exist get a designed 404 page (`src/app/not-found.tsx`); unexpected errors get a
matching page with **Try again** (`src/app/error.tsx`). API errors arrive as readable messages, because
`lib/api-client.ts` reads the API's `{"error": {"message": ...}}` shape.

![404 page in dark mode](docs/not-found.png)

### Mobile

Every page is responsive down to 375px phones: the connection diagram stacks vertically, cards go
single-column, and the 404 diagram shrinks to fit.

## Environments

Next.js only knows `development` and `production`, so the app reads its own `NEXT_PUBLIC_APP_ENV`
(the same idea as `APP_ENV` on the server). Defaults for each environment live in `src/lib/env.ts`:

| Command | Environment | API base URL |
|---|---|---|
| `bun run dev` | `development` | `http://localhost:8000/api/v1` |
| `bun run build:staging` | `staging` | placeholder: `https://api.staging.example.com/api/v1` |
| `bun run build` | `production` | placeholder: `https://api.example.com/api/v1` |

To override a value on your machine, copy `.env.example` to `.env.local` (git-ignored):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001/api/v1
```

`NEXT_PUBLIC_` values are built into the browser bundle, so restart `bun run dev` or rebuild after
changing them. Anything in them is public: never put secrets there.

## Commands (from the repo root)

| Command | What it does |
|---|---|
| `mise run web:install` | Install dependencies (`bun install`) |
| `mise run web:dev` | Run with hot reload on http://localhost:3000 |
| `mise run web:build` | Production build |
| `mise run web:build-staging` | Staging build |
| `mise run web:start` | Serve the last build |
| `mise run web:lint` | ESLint + TypeScript type check |

Add more shadcn/ui components with `bunx shadcn@latest add <name>`.

## Libraries Included

Items marked *available* are installed and ready to import but not yet wired into a feature. Items marked *needs setup* (jose, PyJWT, bcrypt) also need configuration first: authentication (signing keys, a users table, login) is intentionally not built yet.

### Front End: TypeScript

- [Next.js](https://nextjs.org/): React framework used to build fast, server-rendered web applications, with request-level route protection through its proxy (formerly middleware) and client state management.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework used to build modern, responsive, dark-mode user interfaces with high design consistency.
- [shadcn/ui Charts](https://ui.shadcn.com/charts): A collection of customizable React chart components built on Recharts and styled with Tailwind CSS variables for custom EdTech donut rings, line trends, and bar graphs.
- [Recharts](https://recharts.org/): The SVG charting engine driving shadcn/ui Charts, responsible for smooth in-chart path drawing and slice growth animations.
- [lucide-react](https://lucide.dev/): The icon set used by shadcn/ui (sun, moon, arrows).
- [next-themes](https://github.com/pacocoursey/next-themes): Light and dark mode that follows the operating system until the user chooses, with no flash on load.
- [pele](https://pele.run): *Available.* A small, dependency-free renderer that turns Mermaid diagram text into SVG, themed with CSS variables so diagrams follow light and dark mode without re-rendering.
- [jose](https://github.com/panva/jose): *Available, needs setup:* verifying tokens needs the API's signing key (or public key) and a Next.js `proxy.ts`. A lightweight JavaScript security library for verifying login tokens in the Next.js proxy on the edge before protected pages load.

### Tooling

- [bun](https://bun.sh): Fast JavaScript runtime and package manager used to install and run this app.
- [mise](https://mise.jdx.dev): Pins the bun and Node versions and runs the `web:*` commands from the repo root.
