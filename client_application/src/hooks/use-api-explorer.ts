"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { type ExplorerRequest, presetRequests } from "@/content/sandbox-requests";
import {
  buildRequestPath,
  type ExplorerExchange,
  hasMissingParams,
  initialBodyText,
  initialParamValues,
  type ParamValues,
  parseBodyText,
  sendExplorerRequest,
} from "@/lib/api-explorer";

/**
 * State for the sandbox's API explorer: the chosen request, what's been filled in, and what came back.
 * The first quick pick is sent on load. Only the latest request may update the panel, so a slow
 * earlier one can't overwrite a newer answer.
 */
export function useApiExplorer() {
  const [selectedRequest, setSelectedRequest] = useState<ExplorerRequest>(presetRequests[0]);
  const [paramValues, setParamValues] = useState<ParamValues>(() => initialParamValues(presetRequests[0]));
  const [bodyText, setBodyText] = useState(() => initialBodyText(presetRequests[0]));
  const [exchange, setExchange] = useState<ExplorerExchange>({ state: "sending" });
  const latestRequestId = useRef(0);
  /** How many requests have been sent. Each new one replays the Request → Response animation. */
  const [sendCount, setSendCount] = useState(0);

  const send = useCallback((method: string, path: string, body: unknown) => {
    const requestId = ++latestRequestId.current;
    setSendCount(requestId);
    setExchange({ state: "sending" });
    void sendExplorerRequest(method, path, body).then((result) => {
      if (requestId === latestRequestId.current) setExchange(result);
    });
  }, []);

  useEffect(() => {
    send(presetRequests[0].method, presetRequests[0].path, presetRequests[0].body);
  }, [send]);

  const parsedBody = selectedRequest.body === undefined ? { value: undefined } : parseBodyText(bodyText);
  const hasBodyMistake = parsedBody === null;
  const canSend = !hasBodyMistake && !hasMissingParams(selectedRequest, paramValues);
  const requestPath = buildRequestPath(selectedRequest, paramValues);

  /** Choose a request without sending it: the panel waits for Send. */
  function selectRequest(request: ExplorerRequest) {
    latestRequestId.current += 1;
    setSelectedRequest(request);
    setParamValues(initialParamValues(request));
    setBodyText(initialBodyText(request));
    setExchange({ state: "idle" });
  }

  function selectAndSend(request: ExplorerRequest) {
    selectRequest(request);
    send(request.method, buildRequestPath(request, initialParamValues(request)), request.body);
  }

  function sendSelected() {
    if (parsedBody) send(selectedRequest.method, requestPath, parsedBody.value);
  }

  function setParamValue(name: string, value: string) {
    setParamValues((previous) => ({ ...previous, [name]: value }));
  }

  return {
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
  };
}
