// src/app/api/translation/reviewers/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface Reviewer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: 'legal_professional' | 'native_speaker' | 'subject_expert';
  specializations: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  certifications: string[];
  availability: 'available' | 'busy' | 'unavailable';
  pricePerHour?: number;
  jurisdiction: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetLanguage, jurisdiction, documentType, specializations } = body;

    // Get available reviewers based on criteria
    const reviewers = await getAvailableReviewers({
      targetLanguage,
      jurisdiction,
      documentType,
      specializations: specializations || []
    });

    return NextResponse.json(reviewers);

  } catch (error) {
    console.error('Failed to fetch reviewers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviewers' },
      { status: 500 }
    );
  }
}

async function getAvailableReviewers(criteria: {
  targetLanguage?: string;
  jurisdiction?: string;
  documentType?: string;
  specializations: string[];
}): Promise<Reviewer[]> {
  // In a real implementation, this would query a database
  // For now, we'll return mock data filtered by criteria
  
  const allReviewers: Reviewer[] = [
    {
      id: 'reviewer_1',
      name: 'Maria González',
      email: 'maria.gonzalez@legalreview.com',
      avatar: '/avatars/maria.jpg',
      type: 'legal_professional',
      specializations: ['contract_law', 'corporate_law', 'legal_translation'],
      languages: ['es', 'en'],
      rating: 4.9,
      reviewCount: 156,
      certifications: ['Certified Legal Translator', 'Bar Association Member'],
      availability: 'available',
      pricePerHour: 125,
      jurisdiction: ['ES', 'MX', 'AR']
    },
    {
      id: 'reviewer_2',
      name: 'Jean-Pierre Dubois',
      email: 'jp.dubois@legalfr.com',
      avatar: '/avatars/jean-pierre.jpg',
      type: 'legal_professional',
      specializations: ['civil_law', 'contract_law', 'legal_translation'],
      languages: ['fr', 'en'],
      rating: 4.8,
      reviewCount: 203,
      certifications: ['Avocat au Barreau de Paris', 'Legal Translation Certificate'],
      availability: 'available',
      pricePerHour: 140,
      jurisdiction: ['FR', 'BE', 'CA-QC']
    },
    {
      id: 'reviewer_3',
      name: 'Dr. Klaus Weber',
      email: 'k.weber@rechtsberatung.de',
      avatar: '/avatars/klaus.jpg',
      type: 'legal_professional',
      specializations: ['commercial_law', 'international_law', 'legal_translation'],
      languages: ['de', 'en'],
      rating: 4.7,
      reviewCount: 89,
      certifications: ['Rechtsanwalt', 'Certified Court Interpreter'],
      availability: 'busy',
      pricePerHour: 160,
      jurisdiction: ['DE', 'AT', 'CH']
    },
    {
      id: 'reviewer_4',
      name: 'Isabella Rossi',
      email: 'i.rossi@legaleitaliano.it',
      avatar: '/avatars/isabella.jpg',
      type: 'legal_professional',
      specializations: ['family_law', 'property_law', 'legal_translation'],
      languages: ['it', 'en'],
      rating: 4.6,
      reviewCount: 134,
      certifications: ['Avvocato', 'Legal Translation Specialist'],
      availability: 'available',
      pricePerHour: 110,
      jurisdiction: ['IT']
    },
    {
      id: 'reviewer_5',
      name: 'Carlos Silva',
      email: 'c.silva@juridicobr.com',
      avatar: '/avatars/carlos.jpg',
      type: 'native_speaker',
      specializations: ['language_review', 'cultural_adaptation'],
      languages: ['pt', 'en'],
      rating: 4.5,
      reviewCount: 67,
      certifications: ['Native Speaker Certificate', 'Translation Review Specialist'],
      availability: 'available',
      pricePerHour: 75,
      jurisdiction: ['BR', 'PT']
    },
    {
      id: 'reviewer_6',
      name: 'Dr. Sarah Chen',
      email: 's.chen@legaltrans.com',
      avatar: '/avatars/sarah.jpg',
      type: 'subject_expert',
      specializations: ['intellectual_property', 'technology_law', 'legal_translation'],
      languages: ['en', 'es', 'fr'],
      rating: 4.9,
      reviewCount: 245,
      certifications: ['PhD in Legal Studies', 'IP Law Specialist', 'Certified Legal Translator'],
      availability: 'available',
      pricePerHour: 200,
      jurisdiction: ['US-ALL', 'CA-ALL', 'EU']
    }
  ];

  // Filter reviewers based on criteria
  let filteredReviewers = allReviewers.filter(reviewer => {
    // Check language compatibility
    if (criteria.targetLanguage && !reviewer.languages.includes(criteria.targetLanguage)) {
      return false;
    }

    // Check jurisdiction compatibility
    if (criteria.jurisdiction) {
      const hasJurisdiction = reviewer.jurisdiction.some(j => 
        j === criteria.jurisdiction || 
        j.startsWith(criteria.jurisdiction?.split('-')[0] || '') ||
        criteria.jurisdiction?.startsWith(j.split('-')[0])
      );
      if (!hasJurisdiction) return false;
    }

    // Check specializations
    if (criteria.specializations.length > 0) {
      const hasSpecialization = criteria.specializations.some(spec =>
        reviewer.specializations.includes(spec) ||
        reviewer.specializations.includes('legal_translation')
      );
      if (!hasSpecialization) return false;
    }

    return true;
  });

  // Sort by rating and availability
  filteredReviewers.sort((a, b) => {
    // Available reviewers first
    if (a.availability === 'available' && b.availability !== 'available') return -1;
    if (b.availability === 'available' && a.availability !== 'available') return 1;
    
    // Then by rating
    return b.rating - a.rating;
  });

  // Add estimated turnaround time based on availability and workload
  return filteredReviewers.map(reviewer => ({
    ...reviewer,
    estimatedTurnaround: getEstimatedTurnaround(reviewer),
    isRecommended: reviewer.rating >= 4.7 && reviewer.reviewCount >= 50
  }));
}

function getEstimatedTurnaround(reviewer: Reviewer): string {
  switch (reviewer.availability) {
    case 'available':
      return reviewer.reviewCount > 100 ? '2-4 hours' : '4-8 hours';
    case 'busy':
      return '1-2 days';
    case 'unavailable':
      return '3-5 days';
    default:
      return '1-2 days';
  }
}