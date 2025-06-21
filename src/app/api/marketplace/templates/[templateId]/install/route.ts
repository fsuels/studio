// src/app/api/marketplace/templates/[templateId]/install/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import Stripe from 'stripe';
import type {
  MarketplaceTemplate,
  TemplateInstallation,
  TemplatePricing,
} from '@/types/marketplace';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

/**
 * GET /api/marketplace/templates/[templateId]/install
 * Check installation status and get installation options
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    // TODO: Add authentication
    // const user = await getCurrentUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { templateId } = params;
    const userId = 'user-id'; // TODO: Get from auth

    const db = await getDb();

    // Get template info
    const templateRef = doc(db, 'marketplace-templates', templateId);
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const template = templateSnap.data() as MarketplaceTemplate;

    // Check if already installed
    const installationsRef = collection(db, 'users', userId, 'template-installations');
    const existingQuery = query(
      installationsRef,
      where('templateId', '==', templateId),
      where('status', 'in', ['active', 'trial'])
    );
    const existingSnap = await getDocs(existingQuery);

    const isInstalled = !existingSnap.empty;
    const currentInstallation = isInstalled ? existingSnap.docs[0].data() as TemplateInstallation : null;

    // Determine pricing and options
    const pricingOptions = calculatePricingOptions(template.pricing, isInstalled);

    return NextResponse.json({
      success: true,
      data: {
        template: {
          id: template.id,
          name: template.name,
          description: template.description,
          pricing: template.pricing,
          currentVersion: template.currentVersion,
        },
        isInstalled,
        currentInstallation,
        pricingOptions,
        canInstall: !isInstalled || template.pricing.type === 'usage-based',
        requiresPayment: template.pricing.type !== 'free' && !isInstalled,
      },
    });

  } catch (error) {
    console.error('Get installation status error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check installation status' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/marketplace/templates/[templateId]/install
 * Install or purchase a template
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    // TODO: Add authentication
    // const user = await getCurrentUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { templateId } = params;
    const body = await request.json();
    const { 
      version,
      installationType = 'purchased',
      paymentMethodId,
      trial = false,
    } = body;

    const userId = 'user-id'; // TODO: Get from auth
    const db = await getDb();

    // Get template
    const templateRef = doc(db, 'marketplace-templates', templateId);
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const template = templateSnap.data() as MarketplaceTemplate;

    // Check if template is available for installation
    if (template.moderationStatus !== 'approved' || template.visibility !== 'public') {
      return NextResponse.json(
        { error: 'Template not available for installation' },
        { status: 403 }
      );
    }

    // Use current version if not specified
    const installVersion = version || template.currentVersion;

    // Check if already installed
    const installationsRef = collection(db, 'users', userId, 'template-installations');
    const existingQuery = query(
      installationsRef,
      where('templateId', '==', templateId),
      where('status', 'in', ['active', 'trial'])
    );
    const existingSnap = await getDocs(existingQuery);

    if (!existingSnap.empty && template.pricing.type !== 'usage-based') {
      return NextResponse.json(
        { error: 'Template already installed' },
        { status: 409 }
      );
    }

    let paymentResult: any = null;
    let installationRecord: TemplateInstallation;

    // Handle different pricing models
    if (template.pricing.type === 'free') {
      // Free installation
      installationRecord = await createInstallationRecord({
        userId,
        templateId,
        version: installVersion,
        installationType: 'free',
        pricing: template.pricing,
      });

    } else if (trial && template.pricing.type !== 'free') {
      // Trial installation
      const trialDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
      installationRecord = await createInstallationRecord({
        userId,
        templateId,
        version: installVersion,
        installationType: 'trial',
        pricing: template.pricing,
        expiresAt: new Date(Date.now() + trialDuration),
      });

    } else {
      // Paid installation
      if (!paymentMethodId) {
        return NextResponse.json(
          { error: 'Payment method required for paid templates' },
          { status: 400 }
        );
      }

      // Process payment with Stripe
      paymentResult = await processPayment({
        templateId,
        template,
        userId,
        paymentMethodId,
        installationType,
      });

      if (!paymentResult.success) {
        return NextResponse.json(
          { error: 'Payment failed', details: paymentResult.error },
          { status: 402 }
        );
      }

      installationRecord = await createInstallationRecord({
        userId,
        templateId,
        version: installVersion,
        installationType: 'purchased',
        pricing: template.pricing,
        paymentId: paymentResult.paymentIntent.id,
        amountPaid: paymentResult.paymentIntent.amount,
        currency: paymentResult.paymentIntent.currency,
      });
    }

    // Update template stats
    await updateTemplateStats(templateId, template, installationRecord);

    // TODO: Add to user's installed templates collection
    const userTemplateRef = doc(db, 'users', userId, 'installed-templates', templateId);
    await setDoc(userTemplateRef, {
      templateId,
      version: installVersion,
      installedAt: serverTimestamp(),
      installationType: installationRecord.installationType,
      status: 'active',
    });

    return NextResponse.json({
      success: true,
      data: {
        installation: installationRecord,
        payment: paymentResult,
        message: 'Template installed successfully',
      },
    });

  } catch (error) {
    console.error('Template installation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to install template',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate pricing options for a template
 */
function calculatePricingOptions(pricing: TemplatePricing, isInstalled: boolean) {
  const options: any = {
    free: pricing.type === 'free',
    oneTime: pricing.type === 'one-time',
    subscription: pricing.type === 'subscription',
    usageBased: pricing.type === 'usage-based',
  };

  if (pricing.type === 'free') {
    options.price = 0;
  } else if (pricing.type === 'one-time') {
    options.price = pricing.basePrice;
    options.currency = pricing.currency;
  } else if (pricing.type === 'subscription') {
    options.price = pricing.basePrice;
    options.interval = pricing.subscriptionInterval;
    options.currency = pricing.currency;
  } else if (pricing.type === 'usage-based') {
    options.pricePerUse = pricing.pricePerUse;
    options.freeUsageLimit = pricing.freeUsageLimit;
    options.currency = pricing.currency;
  }

  // Apply discounts if available
  if (pricing.discountedPrice && pricing.discountExpiry) {
    const now = new Date();
    const expiry = new Date(pricing.discountExpiry as any);
    if (now < expiry) {
      options.discountedPrice = pricing.discountedPrice;
      options.discountExpiry = pricing.discountExpiry;
      options.savings = options.price - pricing.discountedPrice;
    }
  }

  return options;
}

/**
 * Create installation record
 */
async function createInstallationRecord(params: {
  userId: string;
  templateId: string;
  version: string;
  installationType: string;
  pricing: TemplatePricing;
  paymentId?: string;
  amountPaid?: number;
  currency?: string;
  expiresAt?: Date;
}): Promise<TemplateInstallation> {
  const db = await getDb();
  const installationRef = doc(collection(db, 'users', params.userId, 'template-installations'));
  
  const installation: TemplateInstallation = {
    id: installationRef.id,
    userId: params.userId,
    templateId: params.templateId,
    templateVersion: params.version as any,
    installedAt: serverTimestamp() as any,
    installationType: params.installationType as any,
    paymentId: params.paymentId,
    amountPaid: params.amountPaid,
    currency: params.currency,
    usageCount: 0,
    documentsGenerated: 0,
    status: 'active',
    expiresAt: params.expiresAt ? (params.expiresAt as any) : undefined,
  };

  await setDoc(installationRef, installation);
  return installation;
}

/**
 * Process payment with Stripe
 */
async function processPayment(params: {
  templateId: string;
  template: MarketplaceTemplate;
  userId: string;
  paymentMethodId: string;
  installationType: string;
}) {
  try {
    const { template, paymentMethodId } = params;
    
    const amount = Math.round(template.pricing.basePrice * 100); // Convert to cents
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: template.pricing.currency || 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        templateId: params.templateId,
        userId: params.userId,
        type: 'template_purchase',
      },
      description: `Template: ${template.name}`,
    });

    return {
      success: true,
      paymentIntent,
    };

  } catch (error) {
    console.error('Stripe payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed',
    };
  }
}

/**
 * Update template statistics
 */
async function updateTemplateStats(
  templateId: string,
  template: MarketplaceTemplate,
  installation: TemplateInstallation
) {
  const db = await getDb();
  const templateRef = doc(db, 'marketplace-templates', templateId);

  const updates: any = {
    'stats.totalInstalls': (template.stats.totalInstalls || 0) + 1,
    'stats.uniqueUsers': (template.stats.uniqueUsers || 0) + 1,
    lastUpdated: serverTimestamp(),
  };

  if (installation.amountPaid) {
    updates['stats.totalRevenue'] = (template.stats.totalRevenue || 0) + (installation.amountPaid / 100);
    updates['stats.revenueThisMonth'] = (template.stats.revenueThisMonth || 0) + (installation.amountPaid / 100);
  }

  await updateDoc(templateRef, updates);
}