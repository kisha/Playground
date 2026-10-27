/** The files behind every sandbox page, shown on the /sandbox/enrollment example in the order you change them. */

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
