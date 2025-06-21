// src/app/api/exports/download/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';

interface RouteParams {
  params: {
    filename: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { filename } = params;

    // Validate filename to prevent directory traversal
    if (
      !filename ||
      filename.includes('..') ||
      filename.includes('/') ||
      filename.includes('\\')
    ) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // Validate file extension
    const allowedExtensions = ['.csv', '.json', '.xlsx'];
    const hasValidExtension = allowedExtensions.some((ext) =>
      filename.endsWith(ext),
    );

    if (!hasValidExtension) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Construct file path
    const exportDir = join(process.cwd(), 'temp', 'exports');
    const filepath = join(exportDir, filename);

    try {
      // Check if file exists
      await stat(filepath);
    } catch (error) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filepath);

    // Determine content type
    let contentType = 'application/octet-stream';
    if (filename.endsWith('.csv')) {
      contentType = 'text/csv';
    } else if (filename.endsWith('.json')) {
      contentType = 'application/json';
    } else if (filename.endsWith('.xlsx')) {
      contentType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'private, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Download API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
