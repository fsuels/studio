#!/usr/bin/env tsx

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'YOUR_FIREBASE_API_KEY',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'YOUR_FIREBASE_AUTH_DOMAIN',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'YOUR_FIREBASE_PROJECT_ID',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'YOUR_FIREBASE_STORAGE_BUCKET',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? 'YOUR_FIREBASE_MESSAGING_SENDER_ID',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? 'YOUR_FIREBASE_APP_ID',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Sample marketplace templates based on the existing document library
const marketplaceTemplates = [
  {
    id: 'vehicle-bill-of-sale',
    name: 'Vehicle Bill of Sale',
    slug: 'vehicle-bill-of-sale',
    description: 'Complete bill of sale template for buying and selling used vehicles. Includes all required fields and state-specific compliance.',
    category: 'Automotive',
    tags: ['vehicle', 'purchase', 'legal', 'automotive', 'car'],
    keywords: ['car', 'vehicle', 'buy', 'purchase', 'auto', 'used', 'bill of sale', 'automotive', 'selling', 'buying', 'truck', 'motorcycle', 'boat'],
    jurisdiction: 'US',
    states: 'all',
    languageSupport: ['en', 'es'],
    visibility: 'public',
    moderationStatus: 'approved',
    verified: true,
    featured: true,
    createdBy: 'system',
    creatorProfile: {
      userId: 'system',
      displayName: '123LegalDoc',
      verified: true,
      badges: ['official'],
      totalTemplates: 50,
      totalDownloads: 10000,
      totalRevenue: 0,
      averageRating: 4.9,
    },
    pricing: {
      type: 'one-time',
      basePrice: 2500,
      currency: 'USD',
      creatorShare: 0,
      platformFee: 100,
    },
    licenseType: 'premium',
    currentVersion: '1.0.0',
    stats: {
      totalDownloads: 850,
      averageRating: 4.8,
    },
    ratings: {
      averageRating: 4.8,
      totalRatings: 120,
    },
    lastUpdated: new Date(),
  },
  {
    id: 'employment-contract',
    name: 'Employment Contract',
    slug: 'employment-contract',
    description: 'Comprehensive employment agreement template with customizable terms for salary, benefits, and responsibilities.',
    category: 'Employment',
    tags: ['employment', 'contract', 'job', 'work', 'salary'],
    keywords: ['employment', 'job', 'work', 'contract', 'salary', 'benefits', 'employee', 'employer', 'hire', 'position', 'agreement'],
    jurisdiction: 'US',
    states: 'all',
    languageSupport: ['en'],
    visibility: 'public',
    moderationStatus: 'approved',
    verified: true,
    featured: true,
    createdBy: 'system',
    creatorProfile: {
      userId: 'system',
      displayName: '123LegalDoc',
      verified: true,
      badges: ['official'],
      totalTemplates: 50,
      totalDownloads: 10000,
      totalRevenue: 0,
      averageRating: 4.9,
    },
    pricing: {
      type: 'one-time',
      basePrice: 3500,
      currency: 'USD',
      creatorShare: 0,
      platformFee: 100,
    },
    licenseType: 'premium',
    currentVersion: '1.0.0',
    stats: {
      totalDownloads: 1200,
      averageRating: 4.7,
    },
    ratings: {
      averageRating: 4.7,
      totalRatings: 89,
    },
    lastUpdated: new Date(),
  },
  {
    id: 'nda-agreement',
    name: 'Non-Disclosure Agreement',
    slug: 'nda-agreement',
    description: 'Professional NDA template to protect confidential information in business relationships and partnerships.',
    category: 'Business',
    tags: ['nda', 'confidentiality', 'business', 'legal', 'agreement'],
    keywords: ['nda', 'non-disclosure', 'confidentiality', 'secret', 'information', 'business', 'agreement', 'legal', 'protect', 'confidential'],
    jurisdiction: 'US',
    states: 'all',
    languageSupport: ['en'],
    visibility: 'public',
    moderationStatus: 'approved',
    verified: true,
    featured: true,
    createdBy: 'system',
    creatorProfile: {
      userId: 'system',
      displayName: '123LegalDoc',
      verified: true,
      badges: ['official'],
      totalTemplates: 50,
      totalDownloads: 10000,
      totalRevenue: 0,
      averageRating: 4.9,
    },
    pricing: {
      type: 'one-time',
      basePrice: 2000,
      currency: 'USD',
      creatorShare: 0,
      platformFee: 100,
    },
    licenseType: 'premium',
    currentVersion: '1.0.0',
    stats: {
      totalDownloads: 950,
      averageRating: 4.9,
    },
    ratings: {
      averageRating: 4.9,
      totalRatings: 156,
    },
    lastUpdated: new Date(),
  },
  {
    id: 'lease-agreement',
    name: 'Residential Lease Agreement',
    slug: 'lease-agreement',
    description: 'Complete residential lease agreement template for landlords and tenants with state-specific clauses.',
    category: 'Real Estate',
    tags: ['lease', 'rental', 'property', 'landlord', 'tenant'],
    keywords: ['lease', 'rent', 'rental', 'property', 'landlord', 'tenant', 'apartment', 'house', 'residential', 'agreement'],
    jurisdiction: 'US',
    states: 'all',
    languageSupport: ['en', 'es'],
    visibility: 'public',
    moderationStatus: 'approved',
    verified: true,
    featured: false,
    createdBy: 'system',
    creatorProfile: {
      userId: 'system',
      displayName: '123LegalDoc',
      verified: true,
      badges: ['official'],
      totalTemplates: 50,
      totalDownloads: 10000,
      totalRevenue: 0,
      averageRating: 4.9,
    },
    pricing: {
      type: 'one-time',
      basePrice: 3000,
      currency: 'USD',
      creatorShare: 0,
      platformFee: 100,
    },
    licenseType: 'premium',
    currentVersion: '1.0.0',
    stats: {
      totalDownloads: 780,
      averageRating: 4.6,
    },
    ratings: {
      averageRating: 4.6,
      totalRatings: 94,
    },
    lastUpdated: new Date(),
  },
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    slug: 'service-agreement',
    description: 'Professional service agreement template for freelancers and service providers to define scope and terms.',
    category: 'Business',
    tags: ['service', 'freelance', 'contract', 'business', 'agreement'],
    keywords: ['service', 'freelance', 'contract', 'consultant', 'agreement', 'business', 'scope', 'terms', 'provider'],
    jurisdiction: 'US',
    states: 'all',
    languageSupport: ['en'],
    visibility: 'public',
    moderationStatus: 'approved',
    verified: true,
    featured: false,
    createdBy: 'system',
    creatorProfile: {
      userId: 'system',
      displayName: '123LegalDoc',
      verified: true,
      badges: ['official'],
      totalTemplates: 50,
      totalDownloads: 10000,
      totalRevenue: 0,
      averageRating: 4.9,
    },
    pricing: {
      type: 'one-time',
      basePrice: 2500,
      currency: 'USD',
      creatorShare: 0,
      platformFee: 100,
    },
    licenseType: 'premium',
    currentVersion: '1.0.0',
    stats: {
      totalDownloads: 650,
      averageRating: 4.5,
    },
    ratings: {
      averageRating: 4.5,
      totalRatings: 73,
    },
    lastUpdated: new Date(),
  },
  {
    id: 'llc-operating-agreement',
    name: 'LLC Operating Agreement',
    slug: 'llc-operating-agreement',
    description: 'Comprehensive LLC operating agreement template to establish company structure and member responsibilities.',
    category: 'Business Formation',
    tags: ['llc', 'business', 'operating', 'agreement', 'company'],
    keywords: ['llc', 'business', 'company', 'operating', 'agreement', 'formation', 'startup', 'entity', 'members', 'structure'],
    jurisdiction: 'US',
    states: 'all',
    languageSupport: ['en'],
    visibility: 'public',
    moderationStatus: 'approved',
    verified: true,
    featured: false,
    createdBy: 'system',
    creatorProfile: {
      userId: 'system',
      displayName: '123LegalDoc',
      verified: true,
      badges: ['official'],
      totalTemplates: 50,
      totalDownloads: 10000,
      totalRevenue: 0,
      averageRating: 4.9,
    },
    pricing: {
      type: 'one-time',
      basePrice: 4500,
      currency: 'USD',
      creatorShare: 0,
      platformFee: 100,
    },
    licenseType: 'premium',
    currentVersion: '1.0.0',
    stats: {
      totalDownloads: 420,
      averageRating: 4.8,
    },
    ratings: {
      averageRating: 4.8,
      totalRatings: 67,
    },
    lastUpdated: new Date(),
  }
];

async function seedMarketplaceTemplates() {
  console.log('🌱 Starting marketplace templates seeding...');
  
  try {
    const templatesRef = collection(db, 'marketplace-templates');
    
    for (const template of marketplaceTemplates) {
      const docRef = doc(templatesRef, template.id);
      await setDoc(docRef, template);
      console.log(`✅ Added template: ${template.name}`);
    }
    
    console.log(`🎉 Successfully seeded ${marketplaceTemplates.length} marketplace templates!`);
    console.log('\n📋 Templates added:');
    marketplaceTemplates.forEach(template => {
      console.log(`   • ${template.name} (${template.keywords.length} keywords)`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding marketplace templates:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedMarketplaceTemplates()
  .then(() => {
    console.log('\n✨ Marketplace templates seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error during seeding:', error);
    process.exit(1);
  });
