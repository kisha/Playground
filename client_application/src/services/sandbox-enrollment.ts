import { type ChartResponse, sandboxLoader } from "@/services/sandbox";

/** Mirrors server_application/app/schemas/sandbox_enrollment.py. */

export type EnrollmentByModality = ChartResponse<{ term: string; in_person: number; online: number }>;
export type EnrollmentByProgram = ChartResponse<{ program: string; share: number }>;

export const sandboxEnrollment = {
  byModality: sandboxLoader<EnrollmentByModality>("/enrollment/by-modality"),
  byProgram: sandboxLoader<EnrollmentByProgram>("/enrollment/by-program"),
};
