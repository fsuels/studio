
// src/app/[locale]/api/wizard/[docId]/submit/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { трудоустроен_админ as admin } from '@/lib/firebase-admin'; // Aliased import
import { documentLibrary, type LegalDocument } from '@/lib/document-library'; 
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
  console.warn("[submit/route.ts] Using MOCK getCurrentUser. Replace with actual authentication.");
  return { uid: 'test-user-123', email: 'test-user@example.com' }; // Placeholder
}

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('[submit/route.ts] CRITICAL: STRIPE_SECRET_KEY environment variable is not set.');
  // Potentially throw or handle globally if Stripe is essential for all paths
}
if (!process.env.NEXT_PUBLIC_SITE_URL) {
    console.error('[submit/route.ts] CRITICAL: NEXT_PUBLIC_SITE_URL environment variable is not set. Stripe success/cancel URLs will be invalid.');
}


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', 
});

export async function POST(
  req: Request,
  { params }: { params: { docId: string; locale: string } } 
) {
  const logPrefix = `[API /wizard/${params.docId}/submit]`;
  console.log(`${logPrefix} Received POST request.`);

  try {
    const body = await req.json();
    console.log(`${logPrefix} Request body:`, body);
    const { values, locale: bodyLocale } = body; 
    const effectiveLocale = bodyLocale || params.locale;

    const user = await getCurrentUser();

    if (!user || !user.uid) {
      console.error(`${logPrefix} Unauthorized access attempt.`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log(`${logPrefix} User authenticated: ${user.uid}`);

    const docConfig = documentLibrary.find(d => d.id === params.docId);

    if (!docConfig) {
      console.error(`${logPrefix} Document configuration not found for docId: ${params.docId}`);
      return NextResponse.json({ error: 'Document configuration not found' }, { status: 404 });
    }
    console.log(`${logPrefix} Document config found: ${docConfig.name}`);

    if (docConfig.schema) {
      const validationResult = docConfig.schema.safeParse(values);
      if (!validationResult.success) {
        console.error(`${logPrefix} Invalid form data:`, validationResult.error.flatten());
        return NextResponse.json({ error: 'Invalid form data', details: validationResult.error.flatten() }, { status: 400 });
      }
      console.log(`${logPrefix} Form data validated successfully against Zod schema.`);
    } else {
        console.warn(`${logPrefix} No Zod schema found for document ID: ${params.docId}. Skipping server-side validation of 'values'.`);
    }
    
    let db;
    try {
      db = admin.firestore();
      console.log(`${logPrefix} Firestore instance obtained.`);
    } catch (dbError) {
      console.error(`${logPrefix} Failed to get Firestore instance:`, dbError);
      return NextResponse.json({ error: 'Internal server error: Database connection failed.', details: (dbError instanceof Error ? dbError.message : 'Unknown DB error') }, { status: 500 });
    }
    
    const documentInstanceId = `${params.docId}_${Date.now()}`;
    const docRef = db
      .collection('users')
      .doc(user.uid)
      .collection('documents')
      .doc(documentInstanceId);

    try {
      await docRef.set({
        originalDocId: params.docId, 
        locale: effectiveLocale,
        data: values,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'draft', 
      });
      console.log(`${logPrefix} Document draft saved to Firestore: users/${user.uid}/documents/${documentInstanceId}`);
    } catch (firestoreError) {
      console.error(`${logPrefix} Firestore set operation failed:`, firestoreError);
      return NextResponse.json({ error: 'Failed to save document draft.', details: (firestoreError instanceof Error ? firestoreError.message : 'Unknown Firestore error') }, { status: 500 });
    }

    let session;
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
      if (!siteUrl) {
        console.error(`${logPrefix} NEXT_PUBLIC_SITE_URL is not set. Cannot create Stripe session.`);
        throw new Error("Site URL configuration is missing for Stripe checkout.");
      }

      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: user.email || undefined, 
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: docConfig.basePrice * 100, 
              product_data: {
                name: docConfig.name_es && effectiveLocale === 'es' ? docConfig.name_es : docConfig.name,
                description: docConfig.description_es && effectiveLocale === 'es' ? docConfig.description_es : docConfig.description,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${siteUrl}/${effectiveLocale}/dashboard?checkout_success=true&session_id={CHECKOUT_SESSION_ID}&doc_instance_id=${documentInstanceId}`,
        cancel_url: `${siteUrl}/${effectiveLocale}/docs/${params.docId}/start?checkout_cancelled=true`,
        metadata: {
          userId: user.uid,
          docId: params.docId,
          documentInstanceId: documentInstanceId, 
          locale: effectiveLocale,
        },
      });
      console.log(`${logPrefix} Stripe Checkout session created: ${session.id}`);
    } catch (stripeError) {
      console.error(`${logPrefix} Stripe session creation failed:`, stripeError);
      return NextResponse.json({ error: 'Failed to create payment session.', details: (stripeError instanceof Error ? stripeError.message : 'Unknown Stripe error') }, { status: 500 });
    }

    if (!session.url) {
        console.error(`${logPrefix} Stripe session URL not created, though session object exists.`);
        throw new Error("Stripe session URL not created after session object was formed.");
    }

    return NextResponse.json({ checkoutUrl: session.url });

  } catch (error) {
    console.error(`${logPrefix} Unhandled error in wizard submission API:`, error);
    let errorMessage = 'Internal server error during submission.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Failed to process document submission', details: errorMessage }, { status: 500 });
  }
}
