/** What Playground includes, shown on the landing page. Edit here, not in the components. */

import { env } from "@/lib/env";
import { repositoryFolderUrl } from "@/lib/links";
import type { DatabaseEngine } from "@/services/health";

export type Library = {
  name: string;
  /** Installed, but needs configuration (keys, tables, flows) before it does anything. */
  needsSetup?: boolean;
};

export type CardLink = { label: string; href: string };

export type Application = {
  name: string;
  role: string;
  summary: string;
  folder: string;
  includes: Library[];
  links: CardLink[];
};

/** Shown under the landing page tagline. */
export const languagesLine = "TypeScript · Python · PostgreSQL 18 · pgvector or SQLite";

/** Marks a library that needs setup, with this hint on hover. */
export const SETUP_MARK = "*";
export const SETUP_HINT = "Installed, needs setup before use";
export const setupNote = `${SETUP_HINT}: authentication (signing keys, a users table, login) is not wired up yet.`;

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
    links: [{ label: "README", href: repositoryFolderUrl("client_application") }],
  },
  {
    name: "Server Application",
    role: "Back End · Python 3.14",
    summary:
      "The API. Validates requests, reads and writes PostgreSQL, versions every schema change, and serves vector similarity search.",
    folder: "server_application",
    includes: [
      { name: "FastAPI" },
      { name: "SQLAlchemy 2.1.5" },
      { name: "Alembic" },
      { name: "Pydantic" },
      { name: "uv" },
      { name: "Polars" },
      { name: "Pandas" },
      { name: "PyJWT", needsSetup: true },
      { name: "bcrypt", needsSetup: true },
    ],
    links: [
      { label: "README", href: repositoryFolderUrl("server_application") },
      // Swagger is turned off in production, so the link only appears where it works.
      ...(env.apiDocsUrl ? [{ label: "API docs", href: env.apiDocsUrl }] : []),
    ],
  },
];

/** The two databases an organization's Playground chooses between. */
export const dataStoreOptions: { engine: DatabaseEngine; libraries: Library[] }[] = [
  { engine: "postgresql", libraries: [{ name: "PostgreSQL 18" }, { name: "pgvector" }] },
  { engine: "sqlite", libraries: [{ name: "SQLite" }] },
];

/** Marks the Data Store, pointing to the footnote about choosing a database. */
export const DATABASE_MARK = "†";
export const databaseNote =
  "The Playground starter kit includes a choice: PostgreSQL with pgvector or SQLite. Each organization's Playground picks one:";
export const databaseCommands = ["mise run db:choose postgresql", "mise run db:choose sqlite"];

export const tooling: Library[] = [{ name: "mise" }, { name: "bun" }, { name: "Docker" }];
