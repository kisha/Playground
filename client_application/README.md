# client_application

Next.js front end for Playground: TypeScript, Tailwind CSS, shadcn/ui Charts, Inter, light and dark
modes. It gets all of its data from `server_application` over HTTP.
Deployable on its own: it needs only this folder and the API's URL.

## Layout

```
src/
├── app/            # Pages: layout.tsx, page.tsx, sandbox/, not-found.tsx, error.tsx, globals.css
├── components/     # Render only. Shared: site header/footer, external link, section heading, load error
│   ├── landing/    # Live status, system diagram, tracker, sparkline, stack cards
│   ├── sandbox/    # API explorer, chart card, trend / bar / grouped-bar charts, KPI grid
│   └── ui/         # shadcn/ui components (button, card, chart, skeleton)
├── content/        # Words and settings shown on pages
│   ├── brand.ts            # Name, tagline, logo, footer credit
│   ├── stack.ts            # "What's inside" cards
│   ├── sandbox-charts.ts   # Which fields each example chart draws, and their labels
│   └── sandbox-requests.ts # The API explorer's preset requests
├── hooks/          # Browser state: use-health-monitor, use-api-resource, use-api-explorer
├── lib/            # Logic, with no markup
│   ├── env.ts                # Which environment we're in + its settings
│   ├── api-client.ts         # The single place that calls the API
│   ├── system-status.ts      # Turns health checks into states, diagram boxes, sparkline points
│   ├── connection-styles.ts  # Classes for each state (solid, striped, outlined)
│   ├── charts.ts             # Chart config, formatting (percent, KPI), bar widths
│   ├── api-explorer.ts       # Sends a preset request and describes the result
│   ├── routes.ts, links.ts   # Page addresses and repository links
│   └── errors.ts, timing.ts, theme.ts, utils.ts
└── services/       # One file per API resource: health.ts, sandbox.ts
public/brand/       # Logo files (swap the logo in src/content/brand.ts, or set it to null)
docs/               # Screenshots used in the READMEs
```

**Rule of thumb:** `.tsx` files render. Calling the API, reading the environment, formatting, mapping
data and every other decision lives in `.ts` files in `lib/`, `services/`, `hooks/` and `content/`, so
it can be reused and tested without a page.

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

And here the Server Application is stopped. The page keeps checking every 5 seconds: each failed
check adds an outlined block, the latency line breaks off, and everything returns to solid once
the API answers again:

![Landing page with the Server Application stopped](docs/landing-offline.png)

| Status | Meaning | Looks like |
|---|---|---|
| All systems connected | API and database answering | Solid, pulsing dots and blocks |
| Server application up, database unreachable | Start the database: `mise run db` | Striped blocks, dashed Data box |
| Server application unreachable | Start the API: `mise run api:dev` | Outlined blocks, dashed server box |

### Sandbox: http://localhost:3000/sandbox

The **See example charts** button on the landing page (or **Sandbox** in the header) opens a page that
shows the client and server working together:

- **Try the API:** pick a preset request (health, KPIs, a chart's data, vector search, an unknown
  endpoint, an invalid request) and see the exact request, status, timing and JSON response.
- **Example charts:** eight KPI cards and seven charts modeled on the PDP AR dashboards in the project
  briefs. Each chart loads its own `/api/v1/sandbox/...` endpoint from the browser and shows the
  **Answer** (one-sentence takeaway) and the **Fields used**. All data is mock data.

![Sandbox page with the API explorer and example charts](docs/sandbox.png)

On a phone, everything stacks into one column:

<img src="docs/sandbox-phone.png" alt="Sandbox page on a phone in dark mode" width="300">

| Chart | Type | Endpoint |
|---|---|---|
| Student progress | KPI cards (percent, split, terms) | `/sandbox/kpis` |
| Gateway course completion | Two lines, six terms | `/sandbox/gateway-completion` |
| Students who stayed enrolled | One line, fall terms filled | `/sandbox/term-enrollment` |
| First-year credit completion | Two lines, fall cohorts | `/sandbox/credit-completion` |
| Persistence and retention | Two lines + definitions | `/sandbox/persistence-retention` |
| Completion by student group | Horizontal bars | `/sandbox/completion-by-group` |
| Persistence by age group | Grouped bars, solid vs striped | `/sandbox/persistence-by-age` |
| Time to complete | Horizontal bars | `/sandbox/time-to-complete` |

The sandbox is on in development and staging and hidden in production (the API turns its endpoints
off there too). Override with `NEXT_PUBLIC_SANDBOX_ENABLED=true|false`. To remove it entirely, delete
`src/app/sandbox/`, `src/components/sandbox/`, `src/services/sandbox.ts` and
`src/content/sandbox-requests.ts`.

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
