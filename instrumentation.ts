// instrumentation.ts (root)
// Ensure Next.js can load the instrumentation hook in dev and prod.

export async function register() {
  // No-op: Sentry instrumentation removed
}

export const onRequestError = () => {
  // No-op error handler (Sentry removed)
};

