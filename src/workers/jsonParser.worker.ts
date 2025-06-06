self.onmessage = (event: MessageEvent<string>) => {
  try {
    const parsed = JSON.parse(event.data);
    // Use structured cloning to send result
    (self as DedicatedWorkerGlobalScope).postMessage({ parsed });
  } catch (err) {
    (self as DedicatedWorkerGlobalScope).postMessage({
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
export {};
