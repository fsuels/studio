declare global {
  namespace NodeJS {
    type Timeout = unknown;
    interface ErrnoException extends Error {
      code?: string;
      errno?: number;
      syscall?: string;
      path?: string;
    }
    interface ProcessEnv {
      [key: string]: string | undefined;
    }
    interface Process {
      env: ProcessEnv;
    }
  }

  const process: NodeJS.Process;

  type Buffer = unknown;
  const Buffer: {
    from(input: string | ArrayBuffer | ArrayBufferView, encoding?: string): Buffer;
  };
}

export {};
