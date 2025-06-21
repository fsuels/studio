// src/services/signwell.ts

export interface SignWellDocumentResponse {
  documentId: string;
  signingUrl?: string;
  raw?: unknown;
}

export interface SignWellStatusResponse {
  status: string;
  signingUrl?: string;
  raw?: unknown;
}

/**
 * Create a new SignWell document for signing.
 * POSTs to your Next.js API route at /api/signwell.
 */
export async function createSignWellDocument(
  pdfBase64: string,
  fileName = 'document.pdf',
): Promise<SignWellDocumentResponse> {
  const res = await fetch('/api/signwell', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pdfBase64, fileName }),
  });
  if (!res.ok) {
    throw new Error(`SignWell API error: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as SignWellDocumentResponse;
}

/**
 * Fetches the current status *and* signingUrl of an existing SignWell doc.
 * GETs from /api/signwell/[documentId].
 * Your API route should return JSON: { status, signingUrl, … }.
 */
export async function fetchSignWellStatus(
  documentId: string,
): Promise<SignWellStatusResponse> {
  const res = await fetch(`/api/signwell/${encodeURIComponent(documentId)}`);
  if (!res.ok) {
    throw new Error(
      `SignWell status check failed: ${res.status} ${res.statusText}`,
    );
  }
  const data = await res.json();
  return {
    status: data.status as string,
    signingUrl: data.signingUrl as string | undefined,
    raw: data,
  };
}

/**
 * Convenience alias for retrieving just the signingUrl.
 * View pages can `import { getSignWellUrl }` directly.
 */
export async function getSignWellUrl(documentId: string): Promise<string> {
  const { signingUrl } = await fetchSignWellStatus(documentId);
  if (!signingUrl) {
    throw new Error(`No signingUrl returned for document ${documentId}`);
  }
  return signingUrl;
}
