export async function parseLargeJSON<T>(json: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const worker = new Worker(
      new URL('../workers/jsonParser.worker.ts', import.meta.url),
      { type: 'module' },
    );
    worker.onmessage = (event) => {
      const { parsed, error } = event.data as {
        parsed?: T;
        error?: string;
      };
      worker.terminate();
      if (error) {
        reject(new Error(error));
      } else {
        resolve(parsed as T);
      }
    };
    worker.onerror = (err) => {
      worker.terminate();
      reject(err);
    };
    worker.postMessage(json);
  });
}
