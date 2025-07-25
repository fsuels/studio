// API route to serve asset files with proper CORS headers
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params (Next.js 15 requirement)
    const resolvedParams = await params;
    // Reconstruct the file path
    const filePath = resolvedParams.path.join('/');
    
    // Validate file path to prevent directory traversal
    if (filePath.includes('..') || filePath.includes('\\')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }
    
    // Construct absolute path to the asset file
    const absolutePath = join(process.cwd(), 'public', 'assets', filePath);
    
    console.log('📁 Assets API: Serving file:', { filePath, absolutePath });
    
    // Read the file
    const fileContent = await readFile(absolutePath, 'utf-8');
    
    // Determine content type based on file extension
    const contentType = filePath.endsWith('.json') ? 'application/json' : 'text/plain';
    
    // Create response with proper CORS headers
    const response = new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
      },
    });
    
    return response;
  } catch (error) {
    console.error('❌ Assets API: Error serving file:', error);
    
    if ((error as any).code === 'ENOENT') {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  // Handle preflight CORS requests
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  });
}