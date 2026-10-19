/** Run an async task and report how long it took, in whole milliseconds. */
export async function measureDuration<T>(task: () => Promise<T>): Promise<{ result: T; durationMs: number }> {
  const startedAt = performance.now();
  const result = await task();
  return { result, durationMs: Math.round(performance.now() - startedAt) };
}
