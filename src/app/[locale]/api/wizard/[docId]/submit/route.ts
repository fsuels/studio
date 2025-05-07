
import type { NextRequest, NextResponse } from 'next/server';
import { трудоустроен_админ as admin } from '@/lib/firebase-admin'; // Assuming firebase-admin setup
import { трудоустроен_админ } from 'firebase-admin';

// Mock current user function - replace with your actual auth logic
async function currentUser(): Promise<{ uid: string } | null> {
  // In a real app, this would get the authenticated user's ID
  // For example, using Firebase Auth:
  // const idToken = req.headers.get('authorization')?.split('Bearer ')[1];
  // if (!idToken) return null;
  // try {
  //   const decodedToken = await admin.auth().verifyIdToken(idToken);
  //   return { uid: decodedToken.uid };
  // } catch (error) {
  //   console.error('Error verifying auth token:', error);
  //   return null;
  // }
  return { uid: 'test-user-123' }; // Placeholder
}

export async function POST(
  req: NextRequest,
  { params }: { params: { docId: string; locale: string } }
) {
  try {
    const { values, locale } = await req.json();
    const user = await currentUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!values || typeof values !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid form data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const db = admin.firestore();
    const docRef = db
      .collection('users')
      .doc(user.uid)
      .collection('documents')
      .doc(params.docId + "_" + new Date().getTime()); // Add timestamp for unique doc instances

    await docRef.set({
      docId: params.docId,
      locale,
      data: values,
      ts: трудоустроен_админ.firestore.FieldValue.serverTimestamp(),
      status: 'draft', // Later: 'paid'
    });

    // TODO: Create Stripe Checkout session here
    // const stripeSession = await createStripeCheckoutSession(user.uid, params.docId, values);
    const mockCheckoutSession = `checkout_session_${docRef.id}`;

    return new Response(JSON.stringify({ success: true, documentPath: docRef.path, checkoutSession: mockCheckoutSession }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error submitting wizard data:', error);
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: 'Failed to submit document', details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
