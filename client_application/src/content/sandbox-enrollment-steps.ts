/** The files behind the /sandbox/enrollment example, in the order you would create them. */

export type BuildStep = {
  file: string;
  what: string;
};

export const serverSteps: BuildStep[] = [
  {
    file: "app/schemas/sandbox_enrollment.py",
    what: "Response shapes. Reuse ChartMeta and ChartResponse so every chart answers with meta plus rows.",
  },
  { file: "app/services/sandbox_enrollment.py", what: "The mock data each endpoint returns." },
  {
    file: "app/api/v1/routes/sandbox_enrollment.py",
    what: 'A router with its own prefix, "/sandbox/enrollment", and its own Swagger tag.',
  },
  {
    file: "app/api/v1/router.py",
    what: "One line to add it to sandbox_router, which production turns off.",
  },
];

export const clientSteps: BuildStep[] = [
  { file: "src/services/sandbox-enrollment.ts", what: "Types that mirror the schemas, and one loader per endpoint." },
  { file: "src/content/sandbox-enrollment-charts.ts", what: "Which fields each chart draws, and their labels." },
  {
    file: "src/components/sandbox/enrollment-charts.tsx",
    what: "The charts, built from the existing ChartCard, TrendChart and BarList.",
  },
  {
    file: "src/app/sandbox/enrollment/page.tsx",
    what: "This page. The sandbox layout adds the header and footer, and 404s it in production.",
  },
];
