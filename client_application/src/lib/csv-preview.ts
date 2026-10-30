/** Reads a CSV for the upload preview, in the browser. */

import { MAX_UPLOAD_BYTES, PREVIEW_ROW_COUNT } from "@/content/sandbox-upload";

export type CsvPreview = {
  fileName: string;
  columns: string[];
  rows: string[][];
  rowCount: number;
  /** Row numbers (1 is the first after the header) with a different number of values than there are columns. */
  uneven: number[];
};

export type CsvResult = { preview: CsvPreview } | { problem: string };

/** Split CSV text into rows of values. Handles quoted values, doubled quotes and line breaks inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let isQuoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (isQuoted) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') isQuoted = false;
      else value += character;
    } else if (character === '"') isQuoted = true;
    else if (character === ",") {
      row.push(value);
      value = "";
    } else if (character === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
    } else value += character;
  }
  if (value || row.length > 0) rows.push([...row, value.replace(/\r$/, "")]);
  return rows.filter((candidate) => candidate.some((cell) => cell.trim() !== ""));
}

export function toCsvResult(fileName: string, text: string): CsvResult {
  const [columns, ...rows] = parseCsv(text.replace(/^﻿/, ""));
  if (!columns) return { problem: `${fileName} is empty.` };
  if (rows.length === 0) return { problem: `${fileName} has a header row but no rows after it.` };

  return {
    preview: {
      fileName,
      columns,
      rows: rows.slice(0, PREVIEW_ROW_COUNT),
      rowCount: rows.length,
      uneven: rows.flatMap((row, index) => (row.length === columns.length ? [] : [index + 1])),
    },
  };
}

/** Why a file can't be previewed, before reading it. */
export function findFileProblem(file: { name: string; size: number }): string | null {
  if (!file.name.toLowerCase().endsWith(".csv")) return `${file.name} isn't a CSV file. Choose a file ending in .csv.`;
  if (file.size > MAX_UPLOAD_BYTES) return `${file.name} is over the ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB limit.`;
  return null;
}
