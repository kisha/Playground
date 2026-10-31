/** The files behind every sandbox page, shown on the /sandbox/add-a-sandbox-page page in the order you change them. */

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
    example: "/api/v1/sandbox/add-a-sandbox-page?charts=by-program",
    apiPath: "/sandbox/add-a-sandbox-page?charts=by-program",
    docs: { label: "Add a sandbox endpoint", file: "server_application/README.md", section: "add-a-sandbox-endpoint" },
  },
  {
    name: "Frontend page with its route",
    framework: "Next.js",
    does: "Fetches that JSON and draws the charts, at its own route.",
    example: "/sandbox/add-a-sandbox-page",
    docs: { label: "Add a sandbox page", file: "client_application/README.md", section: "add-a-sandbox-page" },
  },
];

export type BuildStep = {
  file: string;
  what: string;
};

export const serverSteps: BuildStep[] = [
  { file: "app/sandbox/add_a_sandbox_page/", what: "Copy this folder to app/sandbox/<topic>/." },
  {
    file: "schemas.py",
    what: "Define the rows each chart returns and name your charts in ChartName. Keep ChartResponse, so every chart returns meta and rows.",
  },
  { file: "mock_data.py", what: "Return the mock data for each chart, and list each one in CHART_LOADERS." },
  {
    file: "routes.py",
    what: 'Set prefix="/sandbox/<topic>". That one endpoint serves your whole page, with ?charts= choosing what it returns.',
  },
  { file: "app/sandbox/router.py", what: "Add one line to mount your router. The sandbox is off in production." },
];

export const clientSteps: BuildStep[] = [
  {
    file: "src/app/(app)/sandbox/add-a-sandbox-page/",
    what: "Copy this folder to src/app/(app)/sandbox/<topic>/. The folder name becomes the route: /sandbox/<topic>.",
  },
  { file: "data.ts", what: "Add one type and one loader for each chart from step 1." },
  { file: "chart-config.ts", what: "Choose which fields each chart draws, and their labels." },
  { file: "charts.tsx", what: "Build your charts from ChartCard, TrendChart, BarList and the other chart components." },
  { file: "page.tsx", what: "Set your title and text. Delete the <HowToAddASandboxPage /> line." },
  { file: "src/content/sandbox-examples.ts", what: "Add one entry, so your page appears in the left sidebar." },
];
