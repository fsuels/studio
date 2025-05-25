// src/app/api/document-template/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale');
  const country = searchParams.get('country');
  const docId = searchParams.get('docId');

  if (!locale || !country || !docId) {
    return NextResponse.json({ error: 'Missing locale, country, or docId parameter' }, { status: 400 });
  }

  const filePath = `templates/${locale}/${country}/${docId}.md`;

  try {
    // Assuming read_file is a function that calls the tool and returns a structured response
    const fileReadResponse = await read_file({ path: filePath });

    if (fileReadResponse.status === 'succeeded') {
      // Assuming the file content is in fileReadResponse.result
      const markdownContent = fileReadResponse.result;
      return new NextResponse(markdownContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown',
        },
      });
    } else {
      // Handle cases where the tool returns an error (e.g., file not found)
      console.error(`Error reading file ${filePath}:`, fileReadResponse.error);
      return NextResponse.json({ error: 'Document template not found' }, { status: 404 });
    }
  } catch (error) {
    console.error(`Unexpected error reading file ${filePath}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}