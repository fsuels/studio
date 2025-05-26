import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { pdfBase64, fileName } = await req.json();
  if (!pdfBase64) {
    return NextResponse.json({ error: 'Missing pdfBase64' }, { status: 400 });
  }

  const apiKey = process.env.SIGNWELL_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'SIGNWELL_API_KEY not configured' },
      { status: 500 },
    );
  }

  try {
    const res = await fetch('https://api.signwell.com/v1/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        test_mode: true,
        files: [
          { file_base64: pdfBase64, file_name: fileName || 'document.pdf' },
        ],
        signers: [{ name: 'Signer', email: 'signer@example.com' }],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: 'SignWell API error', details: data },
        { status: res.status },
      );
    }

    return NextResponse.json({
      documentId: data.id,
      signingUrl: data.signing_links?.[0]?.url,
      raw: data,
    });
  } catch (err: unknown) {
    console.error('SignWell API call failed', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
