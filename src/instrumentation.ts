// src/instrumentation.ts
// Minimal instrumentation hook kept for compatibility.

export async function register() {
  // No-op instrumentation hook retained for compatibility.
}

export const onRequestError = () => {
  // Error handler intentionally left blank; no external SDK integration.
};
