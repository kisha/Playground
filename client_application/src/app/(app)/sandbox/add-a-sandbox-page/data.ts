import { type ChartResponse, chartLoader } from "@/app/(app)/sandbox/shared";

/** /sandbox/add-a-sandbox-page: one type and one loader per chart. Mirrors its schemas.py on the server. */

type EnrollmentByModality = ChartResponse<{ term: string; in_person: number; online: number }>;
export type EnrollmentByProgram = ChartResponse<{ program: string; share: number }>;

const ENDPOINT = "/add-a-sandbox-page";

export const chartLoaders = {
  byModality: chartLoader<EnrollmentByModality>(ENDPOINT, "by-modality"),
  byProgram: chartLoader<EnrollmentByProgram>(ENDPOINT, "by-program"),
};
