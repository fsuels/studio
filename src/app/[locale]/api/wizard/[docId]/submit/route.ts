// src/app/[locale]/api/wizard/[docId]/submit/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { трудоустроен_админ as admin } from '@/lib/firebase-admin'; // Aliased import
import { documentLibrary, type LegalDocument } from '@/lib/document-library'; // Using LegalDocument
import { z } from 'zod';

// Placeholder for user authentication - replace with your actual auth logic
async function getCurrentUser(): Promise<{ uid: string; email?: string | null } | null> {
  // Example: If using Firebase Auth on the client and passing ID token in headers
  // const idToken = req.headers.get('authorization')?.split('Bearer ')[1];
  // if (!idToken) return null;
  // try {
  //   const decodedToken = await admin.auth().verifyIdToken(idToken);
  //   return { uid: decodedToken.uid, email: decodedToken.email };
  // } catch (error) {
  //   console.error('Error verifying auth token:', error);
  //   return null;
  // }
  return { uid: 'test-user-123', email: 'test-user@example.com' }; // Placeholder
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use a recent API version
});

export async function POST(
  req: Request,
  { params }: { params: { docId: string; locale: string } } // locale is part of the path, but might also be in body
) {
  try {
    const body = await req.json();
    const { values, locale: bodyLocale } = body; // locale from body can override path if needed, or use path's
    const effectiveLocale = bodyLocale || params.locale;

    const user = await getCurrentUser();

    if (!user || !user.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const docConfig = documentLibrary.find(d => d.id === params.docId);

    if (!docConfig) {
      return NextResponse.json({ error: 'Document configuration not found' }, { status: 404 });
    }

    // Server-side validation against the Zod schema
    if (docConfig.schema) {
      const validationResult = docConfig.schema.safeParse(values);
      if (!validationResult.success) {
        return NextResponse.json({ error: 'Invalid form data', details: validationResult.error.flatten() }, { status: 400 });
      }
    } else {
        // If no schema, assume values are okay or handle as per app logic
        console.warn(`No Zod schema found for document ID: ${params.docId}. Skipping server-side validation of 'values'.`);
    }
    
    const db = admin.firestore();
    // Use a unique ID for each document instance, e.g., by appending a timestamp or using Firestore's auto-ID
    const documentInstanceId = `${params.docId}_${Date.now()}`;
    const docRef = db
      .collection('users')
      .doc(user.uid)
      .collection('documents')
      .doc(documentInstanceId); // Store each submission as a new document instance

    await docRef.set({
      originalDocId: params.docId, // To link back to the template type
      locale: effectiveLocale,
      data: values,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'draft', // Initial status
    });

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email || undefined, // Stripe requires email or customer ID
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: docConfig.basePrice * 100, // Price in cents
            product_data: {
              name: docConfig.name_es && effectiveLocale === 'es' ? docConfig.name_es : docConfig.name,
              description: docConfig.description_es && effectiveLocale === 'es' ? docConfig.description_es : docConfig.description,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${effectiveLocale}/dashboard?checkout_success=true&session_id={CHECKOUT_SESSION_ID}&doc_instance_id=${documentInstanceId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${effectiveLocale}/docs/${params.docId}/start?checkout_cancelled=true`,
      metadata: {
        userId: user.uid,
        docId: params.docId,
        documentInstanceId: documentInstanceId, // Store the instance ID
        locale: effectiveLocale,
      },
    });

    if (!session.url) {
        throw new Error("Stripe session URL not created.");
    }

    return NextResponse.json({ checkoutUrl: session.url });

  } catch (error) {
    console.error('Error in wizard submission API:', error);
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Failed to process document submission', details: errorMessage }, { status: 500 });
  }
}

// Optional: Add GET, PUT, DELETE handlers if needed for this route
