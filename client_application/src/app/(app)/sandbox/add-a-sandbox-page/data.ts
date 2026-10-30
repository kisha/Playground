import { type ChartResponse, sandboxLoader } from "@/app/(app)/sandbox/shared";

/** /sandbox/add-a-sandbox-page: one type and one loader per endpoint. Mirrors its schemas.py on the server. */

export type EnrollmentByModality = ChartResponse<{ term: string; in_person: number; online: number }>;
export type EnrollmentByProgram = ChartResponse<{ program: string; share: number }>;

export const endpoints = {
  byModality: sandboxLoader<EnrollmentByModality>("/add-a-sandbox-page/by-modality"),
  byProgram: sandboxLoader<EnrollmentByProgram>("/add-a-sandbox-page/by-program"),
};
