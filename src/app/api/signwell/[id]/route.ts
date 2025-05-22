import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const apiKey = process.env.SIGNWELL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'SIGNWELL_API_KEY not configured' }, { status: 500 });
  }
  try {
    const res = await fetch(`https://api.signwell.com/v1/documents/${id}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: 'SignWell API error', details: data }, { status: res.status });
    }
    return NextResponse.json({ status: data.status, raw: data });
  } catch (err: any) {
    console.error('SignWell status check failed', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
