/** The words and limits on the sandbox's Upload example. */

export const UPLOAD_STEPS = ["Choose a file", "Check the columns", "Preview the rows"];

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const PREVIEW_ROW_COUNT = 5;

export const SAMPLE_FILE_NAME = "sample-cohort.csv";

/** Invented numbers per cohort, with no student in them. */
export const SAMPLE_CSV = `cohort_year,enrollment_type,students,credits_attempted,credits_earned
2023,New,412,9888,7416
2023,Transfer,188,4324,2940
2024,New,436,10464,7952
2024,Transfer,201,4623,3236
2025,New,451,10824,8118
2025,Transfer,214,4922,3347
`;
