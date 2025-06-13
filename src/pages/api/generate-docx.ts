// src/pages/api/generate-docx.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ error: string }>,
) {
  res.status(501).json({ error: 'DOCX generation not implemented.' });
}
