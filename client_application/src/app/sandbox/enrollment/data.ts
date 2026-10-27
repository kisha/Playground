import { type ChartResponse, sandboxLoader } from "@/app/sandbox/shared";

/** /sandbox/enrollment: one type and one loader per endpoint. Mirrors its schemas.py on the server. */

export type EnrollmentByModality = ChartResponse<{ term: string; in_person: number; online: number }>;
export type EnrollmentByProgram = ChartResponse<{ program: string; share: number }>;

export const endpoints = {
  byModality: sandboxLoader<EnrollmentByModality>("/enrollment/by-modality"),
  byProgram: sandboxLoader<EnrollmentByProgram>("/enrollment/by-program"),
};
