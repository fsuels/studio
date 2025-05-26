export interface SignWellDocumentResponse {
  documentId: string;
  signingUrl?: string;
  raw?: unknown;
}

export interface SignWellStatusResponse {
  status: string;
  raw?: unknown;
}

/**
 * Calls our Next.js API route to create a SignWell document for signing.
 * Expects pdfData as base64 string and optional filename.
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
    throw new Error(`SignWell API error: ${res.status}`);
  }
  const data = await res.json();
  return data as SignWellDocumentResponse;
}

/**
 * Checks the status of a SignWell document.
 */
export async function fetchSignWellStatus(
  documentId: string,
): Promise<SignWellStatusResponse> {
  const res = await fetch(`/api/signwell/${documentId}`);
  if (!res.ok) {
    throw new Error(`Status check failed: ${res.status}`);
  }
  const data = await res.json();
  return data as SignWellStatusResponse;
}
