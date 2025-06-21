// src/app/api/collaboration/invite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { inviteCollaborator, acceptInvitation } from '@/lib/collaboration/auth';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { documentId, email, role, invitationId } = await request.json();

    // Get Firebase Auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization token' },
        { status: 401 },
      );
    }

    const idToken = authHeader.substring(7);
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (invitationId) {
      // Accept invitation
      const result = await acceptInvitation(invitationId, userId);

      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Invitation accepted successfully',
        });
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    } else {
      // Send invitation
      if (!documentId || !email || !role) {
        return NextResponse.json(
          {
            error: 'Document ID, email, and role are required',
          },
          { status: 400 },
        );
      }

      const result = await inviteCollaborator(documentId, userId, email, role);

      if (result.success) {
        return NextResponse.json({
          success: true,
          token: result.token,
          message: 'Invitation sent successfully',
        });
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    }
  } catch (error) {
    console.error('Collaboration invite error:', error);
    return NextResponse.json(
      { error: 'Failed to process invitation' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitationId');

    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID required' },
        { status: 400 },
      );
    }

    // Get invitation details (you can implement this based on your needs)
    // This could check if the invitation is valid, not expired, etc.

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitationId,
        // Add other invitation details here
      },
    });
  } catch (error) {
    console.error('Collaboration invite check error:', error);
    return NextResponse.json(
      { error: 'Failed to check invitation' },
      { status: 500 },
    );
  }
}
