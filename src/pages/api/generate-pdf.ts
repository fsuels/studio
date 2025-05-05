// src/pages/api/generate-pdf.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { generatePdfDocument } from '@/services/pdf-generator';

type RequestData = {
  documentType: string;
  answers: Record<string, any>;
  state?: string; // Include state if needed by generator
};

type ErrorResponse = {
  error: string;
  details?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer | ErrorResponse> // Return Buffer for PDF or ErrorResponse
) {
  // --- TEMPORARY CHECK FOR STATIC EXPORT ---
  if (process.env.NEXT_PUBLIC_DISABLE_API_ROUTES === 'true') {
    console.warn(`[API /generate-pdf] API Route Disabled (NEXT_PUBLIC_DISABLE_API_ROUTES=true). Returning 503.`);
    return res.status(503).json({
      error: "PDF Generation Unavailable: API route is disabled for this deployment.",
      code: 'STATIC_EXPORT_API_DISABLED'
    });
  }
  // --- END TEMPORARY CHECK ---

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { documentType, answers, state } = req.body as RequestData;

    if (!documentType || !answers) {
      return res.status(400).json({ error: 'Missing documentType or answers in request body' });
    }

    console.log(`[API /generate-pdf] Received request for type: ${documentType}, State: ${state || 'N/A'}`);
    // console.log(`[API /generate-pdf] Answers:`, answers); // Avoid logging potentially sensitive data in production

    // Call the PDF generation service
    const pdfBytes = await generatePdfDocument({ documentType, answers });

    // Set headers for PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${documentType.replace(/[^a-zA-Z0-9]/g, '_') || 'document'}.pdf"`);
    res.setHeader('Content-Length', pdfBytes.length);

    console.log(`[API /generate-pdf] Successfully generated PDF (${pdfBytes.length} bytes). Sending response.`);
    // Send the PDF bytes as the response body
    return res.status(200).send(Buffer.from(pdfBytes));

  } catch (error: unknown) {
    console.error('[API /generate-pdf] Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({
      error: 'Failed to generate PDF document.',
      details: errorMessage,
    });
  }
}
