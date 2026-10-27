/** The files behind every sandbox page, shown on the /sandbox/enrollment example in the order you change them. */

/** One of the two parts every sandbox page has, with this example's version of it. */
export type SandboxPagePart = {
  name: string;
  framework: string;
  /** What this part does, in one sentence. */
  does: string;
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
    does: "Returns the chart data as JSON.",
    example: "/api/v1/sandbox/enrollment/by-program",
    apiPath: "/sandbox/enrollment/by-program",
    docs: { label: "Add a sandbox endpoint", file: "server_application/README.md", section: "add-a-sandbox-endpoint" },
  },
  {
    name: "Frontend page with its route",
    framework: "Next.js",
    does: "Fetches that JSON and draws the charts, at its own route.",
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
  {
    file: "schemas.py",
    what: "Define the rows each endpoint returns. Keep ChartResponse, so every endpoint returns meta and rows.",
  },
  { file: "mock_data.py", what: "Return the mock data for each endpoint." },
  {
    file: "routes.py",
    what: 'Set prefix="/sandbox/<topic>" and tags=["sandbox: <topic>"]. The prefix sets your endpoints\' URL.',
  },
  { file: "app/sandbox/router.py", what: "Add one line to mount your router. The sandbox is off in production." },
];

export const clientSteps: BuildStep[] = [
  {
    file: "src/app/sandbox/enrollment/",
    what: "Copy this folder to src/app/sandbox/<topic>/. The folder name becomes the route: /sandbox/<topic>.",
  },
  { file: "data.ts", what: "Add one type and one loader for each endpoint from step 1." },
  { file: "chart-config.ts", what: "Choose which fields each chart draws, and their labels." },
  { file: "charts.tsx", what: "Build your charts from ChartCard, TrendChart, BarList and the other chart components." },
  { file: "page.tsx", what: "Set your title and text. Delete the <HowToAddASandboxPage /> line." },
];
