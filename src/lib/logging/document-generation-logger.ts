// Structured logging helpers for document generation pipeline

type DocumentGenerationContext = Record<string, unknown> | undefined;

const LOG_PREFIX = '[DocumentGen]';

const sanitizeContext = (context: DocumentGenerationContext) => {
  if (!context) return {};

  return Object.fromEntries(
    Object.entries(context).filter(([, value]) => value !== undefined),
  );
};

const formatError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { message: String(error) };
};

export function logDocumentGenerationStart(
  operation: string,
  context?: Record<string, unknown>,
): number {
  const startTime = Date.now();
  console.log(
    LOG_PREFIX,
    'START',
    operation,
    JSON.stringify(
      sanitizeContext({
        ...context,
        timestamp: new Date(startTime).toISOString(),
      }),
    ),
  );

  return startTime;
}

export function logDocumentGenerationSuccess(
  operation: string,
  startTime: number,
  context?: Record<string, unknown>,
  result?: Record<string, unknown>,
) {
  const endTime = Date.now();
  const durationMs = endTime - startTime;

  console.log(
    LOG_PREFIX,
    'SUCCESS',
    operation,
    JSON.stringify(
      sanitizeContext({
        ...context,
        ...result,
        durationMs,
        timestamp: new Date(endTime).toISOString(),
      }),
    ),
  );
}

export function logDocumentGenerationError(
  operation: string,
  startTime: number,
  context: Record<string, unknown> | undefined,
  error: unknown,
) {
  const endTime = Date.now();
  const durationMs = endTime - startTime;

  console.error(
    LOG_PREFIX,
    'ERROR',
    operation,
    JSON.stringify(
      sanitizeContext({
        ...context,
        durationMs,
        timestamp: new Date(endTime).toISOString(),
        error: formatError(error),
      }),
    ),
  );
}
