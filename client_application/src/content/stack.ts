/** What Playground includes, shown on the landing page. Edit here, not in the components. */

export type Library = {
  name: string;
  /** Installed, but needs configuration (keys, tables, flows) before it does anything. */
  needsSetup?: boolean;
};

export type Application = {
  name: string;
  role: string;
  summary: string;
  folder: string;
  includes: Library[];
};

export const applications: Application[] = [
  {
    name: "Client Application",
    role: "Front End · TypeScript",
    summary:
      "The web interface. Server-rendered pages in black and white with light and dark modes, ready-made charts, and one typed client for every API call.",
    folder: "client_application",
    includes: [
      { name: "Next.js 16" },
      { name: "React 19" },
      { name: "Tailwind CSS 4" },
      { name: "shadcn/ui Charts" },
      { name: "Recharts" },
      { name: "next-themes" },
      { name: "pele" },
      { name: "jose", needsSetup: true },
    ],
  },
  {
    name: "Server Application",
    role: "Back End · Python 3.14",
    summary:
      "The API. Validates requests, reads and writes PostgreSQL, versions every schema change, and serves vector similarity search.",
    folder: "server_application",
    includes: [
      { name: "FastAPI" },
      { name: "SQLAlchemy 2" },
      { name: "Alembic" },
      { name: "Pydantic" },
      { name: "uv" },
      { name: "Polars" },
      { name: "Pandas" },
      { name: "PyJWT", needsSetup: true },
      { name: "bcrypt", needsSetup: true },
    ],
  },
];

export const sharedFoundation: { label: string; items: Library[] }[] = [
  { label: "Data Store", items: [{ name: "PostgreSQL 18" }, { name: "pgvector" }] },
  { label: "Tooling", items: [{ name: "mise" }, { name: "bun" }, { name: "Docker" }] },
];

export const setupNote =
  "Installed, needs setup before use: authentication (signing keys, a users table, login) is not wired up yet.";
