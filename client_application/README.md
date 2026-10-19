# Client Application

The Next.js front end for Playground; it gets all of its data from the
[Server Application](../server_application/README.md) and deploys on its own.

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

Start the database and Server Application first ([root README](../README.md#run-it-locally)), then:

```bash
mise run web:install && mise run web:dev     # http://localhost:3000
```

### Landing page: http://localhost:3000

A live check of the Server Application and database every 5 seconds, in light or dark mode.

<p>
  <img src="docs/landing-light.png" alt="Landing page in light mode, all systems connected" width="49%">
  <img src="docs/landing-dark.png" alt="Landing page in dark mode" width="49%">
</p>

### When something is down

The page says which part, and recovers on its own once it answers again.

| Database stopped (`mise run db`) | Server Application stopped (`mise run api:dev`) |
|---|---|
| ![Landing page with the database stopped](docs/landing-degraded.png) | ![Landing page with the Server Application stopped](docs/landing-offline.png) |

### Sandbox: http://localhost:3000/sandbox

Live API requests and example charts drawn from mock PDP AR data; hidden in production
(override with `NEXT_PUBLIC_SANDBOX_ENABLED`).

<p>
  <img src="docs/sandbox.png" alt="Sandbox page with the API explorer and example charts" width="72%">
  <img src="docs/sandbox-phone.png" alt="Sandbox page on a phone in dark mode" width="24%">
</p>

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

### 404 and error pages

Unknown addresses and unexpected errors get designed pages ([`not-found.tsx`](src/app/not-found.tsx),
[`error.tsx`](src/app/error.tsx)).

<img src="docs/not-found.png" alt="404 page in dark mode" width="60%">

## Environments

Next.js only knows development and production, so the app reads its own `NEXT_PUBLIC_APP_ENV`; defaults
live in [`src/lib/env.ts`](src/lib/env.ts) and overrides in a git-ignored `.env.local`
(copy [`.env.example`](.env.example)).

| Command | Environment | API base URL |
|---|---|---|
| `bun run dev` | `development` | `http://localhost:8000/api/v1` |
| `bun run build:staging` | `staging` | placeholder: `https://api.staging.example.com/api/v1` |
| `bun run build` | `production` | placeholder: `https://api.example.com/api/v1` |

## Commands (from the repo root)

| Command | What it does |
|---|---|
| `mise run web:install` | Install dependencies (`bun install`) |
| `mise run web:dev` | Run with hot reload on http://localhost:3000 |
| `mise run web:build` | Production build |
| `mise run web:build-staging` | Staging build |
| `mise run web:start` | Serve the last build |
| `mise run web:lint` | ESLint + TypeScript type check |
| `bunx shadcn@latest add <name>` | Add a shadcn/ui component |

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
