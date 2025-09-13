import { NextRequest, NextResponse } from 'next/server';

interface ValidationRequest {
  englishText: string;
  spanishText: string;
  documentId: string;
  region?: string;
}

interface ValidationResult {
  confidence: number;
  shouldFallback: boolean;
  issues: string[];
  recommendations: string[];
}

// Simplified legal terms database for runtime validation
const LEGAL_TERMS_DB = {
  contract: {
    official: ['contrato', 'convenio', 'acuerdo'],
    weight: 10,
  },
  agreement: {
    official: ['acuerdo', 'convenio', 'contrato'],
    weight: 10,
  },
  party: {
    official: ['parte', 'partida'],
    weight: 8,
  },
  signature: {
    official: ['firma', 'signatura'],
    weight: 9,
  },
  notarization: {
    official: ['notarización', 'notariado'],
    weight: 9,
  },
  lease: {
    official: ['arrendamiento', 'alquiler'],
    weight: 10,
  },
  tenant: {
    official: ['inquilino', 'arrendatario'],
    weight: 8,
  },
  landlord: {
    official: ['propietario', 'arrendador'],
    weight: 8,
  },
};

function _calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;

  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 100;

  const distance = levenshteinDistance(
    longer.toLowerCase(),
    shorter.toLowerCase(),
  );
  return Math.round(((longer.length - distance) / longer.length) * 100);
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

function validateTranslation(
  englishText: string,
  spanishText: string,
  _documentId: string,
): ValidationResult {
  const result: ValidationResult = {
    confidence: 0,
    shouldFallback: false,
    issues: [],
    recommendations: [],
  };

  // 1. Length similarity check
  const lengthRatio =
    Math.min(englishText.length, spanishText.length) /
    Math.max(englishText.length, spanishText.length);
  const lengthScore = lengthRatio * 100;

  if (lengthScore < 50) {
    result.issues.push('Significant length difference between translations');
  }

  // 2. Legal terminology validation
  let terminologyScore = 100;
  const englishWords = englishText.toLowerCase().split(/\s+/);
  const spanishWords = spanishText.toLowerCase().split(/\s+/);

  Object.entries(LEGAL_TERMS_DB).forEach(([englishTerm, termData]) => {
    if (
      englishWords.some((word) => word.includes(englishTerm.replace('-', ' ')))
    ) {
      const expectedSpanishTerms = termData.official;

      const hasValidTranslation = expectedSpanishTerms.some((spanishTerm) =>
        spanishWords.some((word) => word.includes(spanishTerm)),
      );

      if (!hasValidTranslation) {
        terminologyScore -= termData.weight;
        result.issues.push(
          `Missing translation for legal term: ${englishTerm}`,
        );
        result.recommendations.push(
          `Consider using: ${expectedSpanishTerms.join(' or ')}`,
        );
      }
    }
  });

  // 3. Template variable consistency
  const englishVars = (englishText.match(/\{\{.*?\}\}/g) || []).length;
  const spanishVars = (spanishText.match(/\{\{.*?\}\}/g) || []).length;
  const variableScore = englishVars === spanishVars ? 100 : 50;

  if (englishVars !== spanishVars) {
    result.issues.push('Template variable mismatch between languages');
  }

  // 4. Structure consistency
  const englishSentences = englishText.split(/[.!?]+/).length;
  const spanishSentences = spanishText.split(/[.!?]+/).length;
  const structureScore =
    Math.abs(englishSentences - spanishSentences) <= 2 ? 100 : 70;

  // Calculate overall confidence
  result.confidence = Math.round(
    lengthScore * 0.2 +
      terminologyScore * 0.5 +
      structureScore * 0.2 +
      variableScore * 0.1,
  );

  // Determine if fallback is needed (80% threshold)
  result.shouldFallback = result.confidence < 80;

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidationRequest = await request.json();
    const { englishText, spanishText, documentId, region: _region } = body;

    // Validate inputs
    if (!englishText || !spanishText || !documentId) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: englishText, spanishText, documentId',
        },
        { status: 400 },
      );
    }

    // Perform validation
    const validationResult = validateTranslation(
      englishText,
      spanishText,
      documentId,
    );

    // Log if fallback is recommended (for monitoring)
    if (validationResult.shouldFallback) {
      console.warn(`Translation fallback recommended for ${documentId}:`, {
        confidence: validationResult.confidence,
        issues: validationResult.issues,
      });
    }

    return NextResponse.json(validationResult);
  } catch (error) {
    console.error('Translation validation error:', error);

    // Return safe fallback on error
    return NextResponse.json({
      confidence: 0,
      shouldFallback: true,
      issues: ['Validation service error'],
      recommendations: ['Use English version for legal accuracy'],
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Translation Validation API',
    version: '1.0.0',
    methods: ['POST'],
    description:
      'Validates Spanish legal translations against English originals',
  });
}
