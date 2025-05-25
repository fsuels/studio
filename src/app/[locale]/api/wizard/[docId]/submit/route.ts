// src/app/[locale]/api/wizard/[docId]/submit/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { admin } from '@/lib/firebase-admin'; // Firebase Admin SDK
import { documentLibrary } from '@/lib/document-library';

// Placeholder for user authentication - replace with your actual auth logic
async function getCurrentUser(): Promise<{ uid: string; email?: string | null } | null> {
  console.warn("[submit/route.ts] Using MOCK getCurrentUser. Replace with actual authentication.");
  return { uid: 'test-user-123', email: 'test-user@example.com' }; // Placeholder
}

// Initial console logs for environment variables (for debugging during build/server start)
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('[submit/route.ts] CRITICAL AT MODULE LOAD: STRIPE_SECRET_KEY environment variable is not set.');
}
if (!process.env.NEXT_PUBLIC_SITE_URL) {
    console.error('[submit/route.ts] CRITICAL AT MODULE LOAD: NEXT_PUBLIC_SITE_URL environment variable is not set. Stripe success/cancel URLs will be invalid.');
}

const FIXED_DOCUMENT_PRICE_CENTS = 35 * 100; // $35 in cents

export async function POST(
  req: Request,
  { params }: { params: { docId: string; locale: string } } 
) {
  const logPrefix = `[API /wizard/${params.docId}/submit]`;
  console.log(`${logPrefix} Received POST request.`);

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!stripeSecretKey) {
    console.error(`${logPrefix} CRITICAL RUNTIME: STRIPE_SECRET_KEY is not set. Aborting.`);
    return NextResponse.json({ error: 'Payment provider configuration is missing. Please contact support.', code: 'STRIPE_KEY_MISSING' }, { status: 503 });
  }

  if (!siteUrl) {
    console.error(`${logPrefix} CRITICAL RUNTIME: NEXT_PUBLIC_SITE_URL is not set. Aborting.`);
    return NextResponse.json({ error: 'Site URL configuration is missing. Please contact support.', code: 'SITE_URL_MISSING' }, { status: 503 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16', 
  });

  try {
    const body = await req.json();
    console.log(`${logPrefix} Request body:`, body);
    const { values, locale: bodyLocale, planType } = body; 
    const effectiveLocale = bodyLocale || params.locale;

    // Reject if planType is present and not 'single'
    if (planType && planType !== 'single') {
      console.error(`${logPrefix} Invalid planType received: ${planType}. Only 'single' is supported.`);
      return NextResponse.json({ error: 'Invalid plan type. Only single document purchase is supported.', code: 'INVALID_PLAN_TYPE' }, { status: 400 });
    }

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
        return NextResponse.json({ error: 'Invalid form data', details: validationResult.error.flatten(), code: 'INVALID_FORM_DATA' }, { status: 400 });
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
      return NextResponse.json({ error: 'Internal server error: Database connection failed.', details: (dbError instanceof Error ? dbError.message : 'Unknown DB error'), code: 'DB_CONNECTION_FAILED' }, { status: 500 });
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
        pricePaid: FIXED_DOCUMENT_PRICE_CENTS / 100, // Store the price paid in dollars
      });
      console.log(`${logPrefix} Document draft saved to Firestore: users/${user.uid}/documents/${documentInstanceId}`);
    } catch (firestoreError) {
      console.error(`${logPrefix} Firestore set operation failed:`, firestoreError);
      return NextResponse.json({ error: 'Failed to save document draft.', details: (firestoreError instanceof Error ? firestoreError.message : 'Unknown Firestore error'), code: 'FIRESTORE_SAVE_FAILED' }, { status: 500 });
    }

    let session;
    try {
      const documentDisplayName = docConfig.name_es && effectiveLocale === 'es' ? docConfig.name_es : docConfig.name;
      const documentDisplayDescription = docConfig.description_es && effectiveLocale === 'es' ? docConfig.description_es : docConfig.description;

      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: user.email || undefined, 
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: FIXED_DOCUMENT_PRICE_CENTS, 
              product_data: {
                name: documentDisplayName,
                description: documentDisplayDescription,
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
      return NextResponse.json({ error: 'Failed to create payment session.', details: (stripeError instanceof Error ? stripeError.message : 'Unknown Stripe error'), code: 'STRIPE_SESSION_FAILED' }, { status: 500 });
    }

    if (!session.url) {
        console.error(`${logPrefix} Stripe session URL not created, though session object exists.`);
        return NextResponse.json({ error: 'Stripe session URL missing after creation.', code: 'STRIPE_URL_MISSING' }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl: session.url });

  } catch (error) {
    console.error(`${logPrefix} Unhandled error in wizard submission API:`, error);
    let errorMessage = 'Internal server error during submission.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Failed to process document submission', details: errorMessage, code: 'UNHANDLED_SUBMISSION_ERROR' }, { status: 500 });
  }
}

