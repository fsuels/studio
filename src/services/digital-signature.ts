export interface DigitalSignatureResult {
  success: boolean;
  message: string;
  signedPdf: Uint8Array | null;
  signingUrl?: string;
  documentId?: string;
}

/**
 * Sends the PDF data to our SignWell integration API route.
 */
export interface SignPdfOptions {
  fileName?: string;
}

export async function signPdfDocument(
  pdfData: Uint8Array,
  options: SignPdfOptions = {},
): Promise<DigitalSignatureResult> {
  try {
    const binary = Array.from(pdfData)
      .map((b) => String.fromCharCode(b))
      .join('');
    const pdfBase64 =
      typeof btoa === 'function'
        ? btoa(binary)
        : Buffer.from(binary, 'binary').toString('base64');
    const res = await fetch('/api/signwell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdfBase64, fileName: options?.fileName }),
    });

    if (!res.ok) {
      const err = await res.json();
      return {
        success: false,
        message: err.error || 'Failed to create SignWell document',
        signedPdf: null,
      };
    }

    const data = await res.json();
    return {
      success: true,
      message: 'SignWell document created',
      signedPdf: null,
      signingUrl: data.signingUrl,
      documentId: data.documentId,
    };
  } catch (error: unknown) {
    console.error('[digital-signature] Error calling SignWell API:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, message, signedPdf: null };
  }
}
