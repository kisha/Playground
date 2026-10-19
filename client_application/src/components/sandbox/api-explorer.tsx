"use client";

import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { presetRequests } from "@/content/sandbox-requests";
import { useApiExplorer } from "@/hooks/use-api-explorer";
import { type ExplorerExchange, formatJson, isErrorStatus } from "@/lib/api-explorer";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

const responseSkeletonWidths = [80, 60, 70, 40];

function Panel({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border">
      <div className="flex items-center justify-between gap-3 border-b bg-muted/50 px-4 py-2.5 text-xs">
        <span className="font-medium tracking-wide uppercase">{title}</span>
        {aside}
      </div>
      <div className="min-h-48 flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
}

function JsonBlock({ value }: { value: unknown }) {
  return <pre className="font-mono text-xs leading-relaxed break-all whitespace-pre-wrap">{formatJson(value)}</pre>;
}

/** "200 OK · 12 ms", underlined with dashes for errors. */
function ResponseStatus({ exchange }: { exchange: ExplorerExchange }) {
  if (exchange.state === "sending") return <span className="text-muted-foreground">sending…</span>;
  if (exchange.state === "unreachable") return null;
  const { status, statusText, durationMs } = exchange.response;
  return (
    <span className="font-mono tabular-nums">
      <span className={cn("font-semibold", isErrorStatus(status) && "underline decoration-dashed underline-offset-4")}>
        {status} {statusText}
      </span>
      <span className="text-muted-foreground"> · {durationMs} ms</span>
    </span>
  );
}

/** Send preset requests to the server application and show exactly what comes back. */
export function ApiExplorer() {
  const { selectedRequest, exchange, sendAgain, selectAndSend } = useApiExplorer();

  return (
    <div className="flex flex-col gap-4">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Example requests">
        {presetRequests.map((request) => {
          const isSelected = request.id === selectedRequest.id;
          return (
            <button
              key={request.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => selectAndSend(request)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                isSelected ? "border-foreground bg-foreground text-background" : "hover:bg-muted",
              )}
            >
              {request.label}
            </button>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground">{selectedRequest.note}</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Request"
          aside={
            <Button size="xs" variant="outline" onClick={sendAgain}>
              <Send aria-hidden /> Send again
            </Button>
          }
        >
          <p className="font-mono text-xs break-all">
            <span className="mr-2 rounded bg-foreground px-1.5 py-0.5 font-semibold text-background">
              {selectedRequest.method}
            </span>
            {env.apiBaseUrl}
            {selectedRequest.path}
          </p>
          {selectedRequest.body !== undefined && (
            <div className="mt-4">
              <p className="mb-1.5 text-xs text-muted-foreground">Body</p>
              <JsonBlock value={selectedRequest.body} />
            </div>
          )}
        </Panel>

        <Panel title="Response" aside={<ResponseStatus exchange={exchange} />}>
          {exchange.state === "done" && <JsonBlock value={exchange.response.body} />}
          {exchange.state === "sending" && (
            <div className="flex flex-col gap-2" aria-busy="true">
              {responseSkeletonWidths.map((widthPercent) => (
                <Skeleton key={widthPercent} className="h-3" style={{ width: `${widthPercent}%` }} />
              ))}
            </div>
          )}
          {exchange.state === "unreachable" && (
            <p className="text-sm">
              {exchange.message}. Start it with <code className="font-mono">mise run api:dev</code>.
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}
