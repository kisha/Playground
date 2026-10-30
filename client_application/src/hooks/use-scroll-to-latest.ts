"use client";

import { useEffect, useRef } from "react";

/** A ref for a scrolling list that keeps its newest item in view whenever `latest` changes. */
export function useScrollToLatest<Element extends HTMLElement>(latest: unknown) {
  const scrollRef = useRef<Element>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [latest]);
  return scrollRef;
}
