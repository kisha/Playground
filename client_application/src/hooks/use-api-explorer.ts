"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { type PresetRequest, presetRequests } from "@/content/sandbox-requests";
import { type ExplorerExchange, sendPresetRequest } from "@/lib/api-explorer";

/**
 * State for the sandbox's API explorer: which preset is selected and what came back.
 * The first preset is sent on load. Only the latest request may update the panel, so a slow
 * earlier one can't overwrite a newer answer.
 */
export function useApiExplorer() {
  const [selectedRequest, setSelectedRequest] = useState<PresetRequest>(presetRequests[0]);
  const [exchange, setExchange] = useState<ExplorerExchange>({ state: "sending" });
  const latestRequestId = useRef(0);

  const send = useCallback((request: PresetRequest) => {
    const requestId = ++latestRequestId.current;
    void sendPresetRequest(request).then((result) => {
      if (requestId === latestRequestId.current) setExchange(result);
    });
  }, []);

  useEffect(() => {
    send(presetRequests[0]);
  }, [send]);

  function sendAgain() {
    setExchange({ state: "sending" });
    send(selectedRequest);
  }

  function selectAndSend(request: PresetRequest) {
    setSelectedRequest(request);
    setExchange({ state: "sending" });
    send(request);
  }

  return { selectedRequest, exchange, sendAgain, selectAndSend };
}
