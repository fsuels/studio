// src/app/[locale]/api/wizard/[docId]/submit/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAdmin } from '@/lib/firebase-admin'; // Firebase Admin SDK
import { documentLibrary } from '@/lib/document-library';

// Placeholder for user authentication - replace with your actual auth logic
async function getCurrentUser(): Promise<{
  uid: string;
  email?: string | null;
} | null> {
  console.warn(
    '[submit/route.ts] Using MOCK getCurrentUser. Replace with actual authentication.',
  );
  return { uid: 'test-user-123', email: 'test-user@example.com' }; // Placeholder
}

// Initial console logs for environment variables (for debugging during build/server start)
if (!process.env.STRIPE_SECRET_KEY) {
  console.error(
    '[submit/route.ts] CRITICAL AT MODULE LOAD: STRIPE_SECRET_KEY environment variable is not set.',
  );
}
const DEFAULT_DOCUMENT_PRICE = 35; // Fallback price in dollars

export async function POST(
  req: Request,
  { params }: { params: { docId: string; locale: string } },
) {
  const logPrefix = `[API /wizard/${params.docId}/submit]`;
  console.log(`${logPrefix} Received POST request.`);

  const admin = getAdmin();

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    console.error(
      `${logPrefix} CRITICAL RUNTIME: STRIPE_SECRET_KEY is not set. Aborting.`,
    );
    return NextResponse.json(
      {
        error:
          'Payment provider configuration is missing. Please contact support.',
        code: 'STRIPE_KEY_MISSING',
      },
      { status: 503 },
    );
  }


  const stripe = new Stripe(stripeSecretKey, {
    // Updated to the latest Stripe API version supported by the SDK
    apiVersion: '2025-04-30.basil',
  });

  try {
    const body = await req.json();
    console.log(`${logPrefix} Request body:`, body);
    const { values, locale: bodyLocale, planType } = body;
    const effectiveLocale = bodyLocale || params.locale;

    // Reject if planType is present and not 'single'
    if (planType && planType !== 'single') {
      console.error(
        `${logPrefix} Invalid planType received: ${planType}. Only 'single' is supported.`,
      );
      return NextResponse.json(
        {
          error:
            'Invalid plan type. Only single document purchase is supported.',
          code: 'INVALID_PLAN_TYPE',
        },
        { status: 400 },
      );
    }

    const user = await getCurrentUser();

    if (!user || !user.uid) {
      console.error(`${logPrefix} Unauthorized access attempt.`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log(`${logPrefix} User authenticated: ${user.uid}`);

    const docConfig = documentLibrary.find((d) => d.id === params.docId);

    if (!docConfig) {
      console.error(
        `${logPrefix} Document configuration not found for docId: ${params.docId}`,
      );
      return NextResponse.json(
        { error: 'Document configuration not found' },
        { status: 404 },
      );
    }
    console.log(`${logPrefix} Document config found: ${docConfig.name}`);

    if (docConfig.schema) {
      const validationResult = docConfig.schema.safeParse(values);
      if (!validationResult.success) {
        console.error(
          `${logPrefix} Invalid form data:`,
          validationResult.error.flatten(),
        );
        return NextResponse.json(
          {
            error: 'Invalid form data',
            details: validationResult.error.flatten(),
            code: 'INVALID_FORM_DATA',
          },
          { status: 400 },
        );
      }
      console.log(
        `${logPrefix} Form data validated successfully against Zod schema.`,
      );
    } else {
      console.warn(
        `${logPrefix} No Zod schema found for document ID: ${params.docId}. Skipping server-side validation of 'values'.`,
      );
    }

    let db;
    try {
      db = admin.firestore();
      console.log(`${logPrefix} Firestore instance obtained.`);
    } catch (dbError) {
      console.error(`${logPrefix} Failed to get Firestore instance:`, dbError);
      return NextResponse.json(
        {
          error: 'Internal server error: Database connection failed.',
          details:
            dbError instanceof Error ? dbError.message : 'Unknown DB error',
          code: 'DB_CONNECTION_FAILED',
        },
        { status: 500 },
      );
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
        pricePaid: docConfig.basePrice || DEFAULT_DOCUMENT_PRICE,
      });
      console.log(
        `${logPrefix} Document draft saved to Firestore: users/${user.uid}/documents/${documentInstanceId}`,
      );
    } catch (firestoreError) {
      console.error(
        `${logPrefix} Firestore set operation failed:`,
        firestoreError,
      );
      return NextResponse.json(
        {
          error: 'Failed to save document draft.',
          details:
            firestoreError instanceof Error
              ? firestoreError.message
              : 'Unknown Firestore error',
          code: 'FIRESTORE_SAVE_FAILED',
        },
        { status: 500 },
      );
    }

    let paymentIntent;
    try {
      const documentDisplayName =
        effectiveLocale === 'es'
          ? docConfig.translations?.es?.name ||
            docConfig.translations?.en?.name ||
            docConfig.name ||
            docConfig.id
          : docConfig.translations?.en?.name ||
            docConfig.name ||
            docConfig.translations?.es?.name ||
            docConfig.id;
      const documentDisplayDescription =
        effectiveLocale === 'es'
          ? docConfig.translations?.es?.description ||
            docConfig.translations?.en?.description ||
            docConfig.description ||
            ''
          : docConfig.translations?.en?.description ||
            docConfig.description ||
            docConfig.translations?.es?.description ||
            '';

      const priceCents = (docConfig.basePrice || DEFAULT_DOCUMENT_PRICE) * 100;
      paymentIntent = await stripe.paymentIntents.create({
        amount: priceCents,
        currency: 'usd',
        metadata: {
          userId: user.uid,
          docId: params.docId,
          documentInstanceId: documentInstanceId,
          locale: effectiveLocale,
          name: documentDisplayName,
          description: documentDisplayDescription,
        },
      });
      console.log(
        `${logPrefix} Stripe payment intent created: ${paymentIntent.id}`,
      );
    } catch (stripeError) {
      console.error(
        `${logPrefix} Stripe payment intent creation failed:`,
        stripeError,
      );
      return NextResponse.json(
        {
          error: 'Failed to create payment intent.',
          details:
            stripeError instanceof Error
              ? stripeError.message
              : 'Unknown Stripe error',
          code: 'STRIPE_INTENT_FAILED',
        },
        { status: 500 },
      );
    }

    if (!paymentIntent.client_secret) {
      console.error(
        `${logPrefix} Stripe client secret missing after payment intent creation.`,
      );
      return NextResponse.json(
        {
          error: 'Stripe client secret missing.',
          code: 'STRIPE_SECRET_MISSING',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(
      `${logPrefix} Unhandled error in wizard submission API:`,
      error,
    );
    let errorMessage = 'Internal server error during submission.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      {
        error: 'Failed to process document submission',
        details: errorMessage,
        code: 'UNHANDLED_SUBMISSION_ERROR',
      },
      { status: 500 },
    );
  }
}
