"use client";

import { Send } from "lucide-react";

import { FlowConnector } from "@/components/flow-connector";
import { ApiEndpointList } from "@/components/sandbox/api-endpoint-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { presetRequests } from "@/content/sandbox-requests";
import { useApiExplorer } from "@/hooks/use-api-explorer";
import { type ApiEndpoint, sendsOnSelect } from "@/lib/api-endpoints";
import { type ExplorerExchange, formatJson, isErrorStatus } from "@/lib/api-explorer";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

const responseSkeletonWidths = [80, 60, 70, 40];

function Panel({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border">
      <div className="flex min-h-11 items-center justify-between gap-3 border-b bg-muted/50 px-4 py-2.5 text-xs">
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
  if (exchange.state !== "done") return null;
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

/** Find an endpoint or use a quick pick, fill in what it needs, send it to the server and show what comes back. */
export function ApiExplorer() {
  const {
    selectedRequest,
    paramValues,
    setParamValue,
    bodyText,
    setBodyText,
    hasBodyMistake,
    canSend,
    requestPath,
    exchange,
    sendCount,
    sendSelected,
    selectRequest,
    selectAndSend,
  } = useApiExplorer();

  function chooseEndpoint(endpoint: ApiEndpoint) {
    if (sendsOnSelect(endpoint)) selectAndSend(endpoint);
    else selectRequest(endpoint);
  }

  return (
    <div className="@container flex flex-col gap-4">
      <ApiEndpointList selectedId={selectedRequest.id} onSelect={chooseEndpoint} />

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Quick picks">
        {presetRequests.map((request) => {
          const isSelected = request.id === selectedRequest.id;
          return (
            <button
              key={request.id}
              type="button"
              aria-pressed={isSelected}
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

      <div className="flex flex-col lg:flex-row">
        <Panel
          title="Request"
          aside={
            <Button size="xs" variant="outline" disabled={!canSend} onClick={sendSelected}>
              <Send aria-hidden /> Send
            </Button>
          }
        >
          <p className="font-mono text-xs break-all">
            <span className="mr-2 rounded bg-foreground px-1.5 py-0.5 font-semibold text-background">
              {selectedRequest.method}
            </span>
            {env.apiBaseUrl}
            {requestPath}
          </p>

          {(selectedRequest.params ?? []).length > 0 && (
            <div className="mt-4 flex flex-col gap-3">
              {selectedRequest.params?.map((param) => (
                <div key={param.name} className="flex flex-col gap-1.5">
                  <label htmlFor={`api-param-${param.name}`} className="text-xs text-muted-foreground">
                    <span className="font-mono text-foreground">{param.name}</span> ({param.location}
                    {param.required ? ", required" : ""})
                  </label>
                  <Input
                    id={`api-param-${param.name}`}
                    value={paramValues[param.name] ?? ""}
                    onChange={(event) => setParamValue(param.name, event.target.value)}
                    className="font-mono text-xs md:text-xs"
                  />
                </div>
              ))}
            </div>
          )}

          {selectedRequest.body !== undefined && (
            <div className="mt-4 flex flex-col gap-1.5">
              <label htmlFor="api-request-body" className="text-xs text-muted-foreground">
                Body
              </label>
              <Textarea
                id="api-request-body"
                value={bodyText}
                onChange={(event) => setBodyText(event.target.value)}
                rows={6}
                spellCheck={false}
                aria-invalid={hasBodyMistake}
                className="font-mono text-xs md:text-xs"
              />
              {hasBodyMistake && <p className="text-xs">This isn&apos;t valid JSON yet. Fix it to send.</p>}
            </div>
          )}
        </Panel>

        <FlowConnector direction="responsive" trigger={sendCount} className="lg:mt-5 lg:self-start" />

        <Panel title="Response" aside={<ResponseStatus exchange={exchange} />}>
          {exchange.state === "idle" && <p className="text-sm text-muted-foreground">Press Send to try it.</p>}
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
