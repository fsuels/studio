// src/app/api/document-template/route.ts
import { NextResponse } from 'next/server';

// This is a placeholder for the actual tool definition if provided by the environment.
// For local development, you might mock this or implement actual file reading.
async function read_file(params: { path: string }): Promise<{ status: 'succeeded' | 'failed'; result?: string; error?: string }> {
  // In a real environment, this would call the provisioned tool.
  // For now, let's simulate a failure if the path doesn't seem right or for testing.
  // This mock assumes the 'read_file' tool expects paths relative to the project root.
  console.log(`[read_file mock] Attempting to read: ${params.path}`);
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    // Simulate a simple file read for local dev if 'fs' could be used (not ideal for Next.js API routes directly)
    // Or, for now, let's assume it fails if not correctly prefixed, to highlight path issues.
    // This part is tricky without knowing the exact execution environment of the 'read_file' tool.
    // We'll assume for now it expects a path like 'public/templates/...'
    if (!params.path.startsWith('public/')) {
        console.warn(`[read_file mock] Path does not start with public/: ${params.path}. Simulating 'failed'.`);
        return { status: 'failed', error: `File not found or path incorrect (mock): ${params.path}. Expected path to start with 'public/' if tool operates from project root.` };
    }
    // A more robust mock would actually try to read from the filesystem here if 'fs' were available and safe.
    // For now, let's just assume if path is 'public/...' it might succeed.
    // To make it pass for existing files, we'd need to know they exist.
    // Let's simulate success for a known good path for testing:
    if (params.path === 'public/templates/en/us/bill-of-sale-vehicle.md') {
        return { status: 'succeeded', result: '# Mocked Bill of Sale Content' };
    }
     if (params.path === 'public/templates/en/us/promissory-note.md') {
        return { status: 'succeeded', result: '# Mocked Promissory Note Content' };
    }
  }
  // Default to failure for unknown paths in this mock
  return { status: 'failed', error: `File not found (mock): ${params.path}` };
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale');
  const country = searchParams.get('country');
  const docId = searchParams.get('docId');

  if (!locale || !country || !docId) {
    return NextResponse.json({ error: 'Missing locale, country, or docId parameter' }, { status: 400 });
  }

  // Corrected filePath to point to the 'public' directory
  const filePath = `public/templates/${locale}/${country}/${docId}.md`;
  console.log(`[api/document-template] Attempting to read file at: ${filePath}`);

  try {
    const fileReadResponse = await read_file({ path: filePath });

    if (fileReadResponse.status === 'succeeded' && fileReadResponse.result !== undefined) {
      const markdownContent = fileReadResponse.result;
      return new NextResponse(markdownContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown',
        },
      });
    } else {
      console.error(`[api/document-template] Error reading file ${filePath}: Status: ${fileReadResponse.status}, Error: ${fileReadResponse.error || 'No specific error message from tool.'}`);
      return NextResponse.json({ error: 'Document template not found or read error.', details: fileReadResponse.error || `Failed to read: ${filePath}` }, { status: 404 });
    }
  } catch (error) {
    console.error(`[api/document-template] Unexpected error processing request for ${filePath}:`, error);
    return NextResponse.json({ error: 'Internal server error while fetching template.', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
