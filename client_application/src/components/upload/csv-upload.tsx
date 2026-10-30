"use client";

import { CloudUpload, FileText, X } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { MAX_UPLOAD_BYTES, PREVIEW_ROW_COUNT, UPLOAD_STEPS } from "@/content/sandbox-upload";
import { useCsvUpload } from "@/hooks/use-csv-upload";
import type { CsvPreview } from "@/lib/csv-preview";
import { cn } from "@/lib/utils";

/** Drop or choose a CSV, then check what's in it. Nothing leaves the browser. */
export function CsvUpload() {
  const { result, chooseFile, useSample, clear } = useCsvUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const preview = result && "preview" in result ? result.preview : null;
  const problem = result && "problem" in result ? result.problem : null;

  function handleFile(file: File | undefined) {
    if (file) void chooseFile(file);
    // So choosing the same file again still counts as a change.
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2" aria-label="Upload steps">
        {UPLOAD_STEPS.map((step, index) => (
          <li key={step} className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full border text-xs font-medium",
                preview || index === 0 ? "border-foreground bg-foreground text-background" : "text-muted-foreground",
              )}
            >
              {index + 1}
            </span>
            <span className={preview || index === 0 ? undefined : "text-muted-foreground"}>{step}</span>
          </li>
        ))}
      </ol>

      {preview ? (
        <CsvPreviewPanel preview={preview} onClear={clear} />
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDraggingOver(false);
            handleFile(event.dataTransfer.files[0]);
          }}
          className={cn(
            "flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-muted/30 p-8 text-center transition-colors",
            isDraggingOver && "border-foreground bg-muted",
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-muted">
            <CloudUpload aria-hidden className="size-5 text-muted-foreground" />
          </span>
          <p className="font-medium">Drop a CSV file here</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Up to {MAX_UPLOAD_BYTES / (1024 * 1024)} MB. It stays in your browser and isn&apos;t sent anywhere.
          </p>
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            <Button onClick={() => inputRef.current?.click()}>Choose a file</Button>
            <Button variant="outline" onClick={useSample}>
              Try a sample
            </Button>
          </div>
          <input
            ref={inputRef}
            id="csv-file-input"
            type="file"
            accept=".csv,text/csv"
            aria-label="Choose a CSV file"
            className="sr-only"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          {problem && (
            <p role="alert" className="text-sm font-medium">
              {problem}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CsvPreviewPanel({ preview, onClear }: { preview: CsvPreview; onClear: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-2xl border p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
          <FileText aria-hidden className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{preview.fileName}</p>
          <p className="text-xs text-muted-foreground">
            {preview.rowCount.toLocaleString("en-US")} rows · {preview.columns.length} columns
          </p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Remove this file" title="Remove this file" onClick={onClear}>
          <X />
        </Button>
      </div>

      {preview.uneven.length > 0 && (
        <p role="alert" className="border-l-2 border-foreground bg-muted/60 px-4 py-3 text-sm font-medium">
          {preview.uneven.length} rows have a different number of values than there are columns, starting at row{" "}
          {preview.uneven[0]}.
        </p>
      )}

      <section aria-labelledby="csv-columns-heading" className="flex flex-col gap-2">
        <h3 id="csv-columns-heading" className="text-sm font-semibold">
          Columns
        </h3>
        <ul className="flex flex-wrap gap-1.5">
          {preview.columns.map((column) => (
            <li key={column} className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
              {column}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="csv-rows-heading" className="flex flex-col gap-2">
        <h3 id="csv-rows-heading" className="text-sm font-semibold">
          First {Math.min(PREVIEW_ROW_COUNT, preview.rowCount)} rows
        </h3>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-xs tabular-nums">
            <thead className="bg-muted/50">
              <tr>
                {preview.columns.map((column) => (
                  <th key={column} scope="col" className="px-3 py-2 text-left font-medium whitespace-nowrap">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t">
                  {preview.columns.map((column, columnIndex) => (
                    <td key={column} className="px-3 py-2 whitespace-nowrap">
                      {row[columnIndex] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
