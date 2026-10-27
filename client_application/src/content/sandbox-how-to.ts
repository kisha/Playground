/** The files behind every sandbox page, shown on the /sandbox/enrollment example in the order you change them. */

/** One of the two parts every sandbox page has, with this example's version of it. */
export type SandboxPagePart = {
  name: string;
  framework: string;
  /** This example's version, as shown: an endpoint's full path, or a page route. */
  example: string;
  /** For an endpoint, its path relative to the API base URL, so the example links to the live JSON. */
  apiPath?: string;
  docs: { label: string; file: string; section: string };
};

export const sandboxPageParts: SandboxPagePart[] = [
  {
    name: "Backend endpoint",
    framework: "FastAPI",
    example: "/api/v1/sandbox/enrollment/by-program",
    apiPath: "/sandbox/enrollment/by-program",
    docs: { label: "Add a sandbox endpoint", file: "server_application/README.md", section: "add-a-sandbox-endpoint" },
  },
  {
    name: "Frontend page with its route",
    framework: "Next.js",
    example: "/sandbox/enrollment",
    docs: { label: "Add a sandbox page", file: "client_application/README.md", section: "add-a-sandbox-page" },
  },
];

export type BuildStep = {
  file: string;
  what: string;
};

export const serverSteps: BuildStep[] = [
  { file: "app/sandbox/enrollment/", what: "Copy this folder to app/sandbox/<topic>/." },
  { file: "schemas.py", what: "Your rows. Reuse ChartResponse so every chart answers with meta plus rows." },
  { file: "mock_data.py", what: "The mock data each endpoint returns." },
  { file: "routes.py", what: 'Your endpoints. Set prefix="/sandbox/<topic>" and tags=["sandbox: <topic>"].' },
  { file: "app/sandbox/router.py", what: "One line to mount it. Production turns the sandbox off." },
];

export const clientSteps: BuildStep[] = [
  { file: "src/app/sandbox/enrollment/", what: "Copy this folder to src/app/sandbox/<topic>/." },
  { file: "data.ts", what: "One type and one loader per endpoint from step 1." },
  { file: "chart-config.ts", what: "Which fields each chart draws, and their labels." },
  { file: "charts.tsx", what: "Your charts, built from ChartCard, TrendChart, BarList and the rest." },
  { file: "page.tsx", what: "Your title and text. Remove <HowToAddASandboxPage />." },
];
