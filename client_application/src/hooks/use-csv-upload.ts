"use client";

import { useState } from "react";

import { SAMPLE_CSV, SAMPLE_FILE_NAME } from "@/content/sandbox-upload";
import { type CsvResult, findFileProblem, toCsvResult } from "@/lib/csv-preview";

/** The chosen file's preview or problem. The file is only read here, in the browser; nothing is sent anywhere. */
export function useCsvUpload() {
  const [result, setResult] = useState<CsvResult | null>(null);

  async function chooseFile(file: File) {
    const problem = findFileProblem(file);
    setResult(problem ? { problem } : toCsvResult(file.name, await file.text()));
  }

  return {
    result,
    chooseFile,
    useSample: () => setResult(toCsvResult(SAMPLE_FILE_NAME, SAMPLE_CSV)),
    clear: () => setResult(null),
  };
}
