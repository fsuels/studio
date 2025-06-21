// src/app/api/ai/identify-legal-terms/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { aiInstance } from '@/ai/ai-instance';

interface LegalTerm {
  term: string;
  definition: string;
  jurisdiction: string[];
  confidence: number;
  context: string;
  alternatives?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, jurisdiction, documentType, language } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // AI-powered legal term identification
    const legalTerms = await identifyLegalTermsWithAI(text, {
      jurisdiction,
      documentType,
      language,
    });

    return NextResponse.json({
      legalTerms,
      metadata: {
        termsFound: legalTerms.length,
        jurisdiction,
        language,
        processingTime: Date.now(),
      },
    });
  } catch (error) {
    console.error('Legal term identification failed:', error);
    return NextResponse.json(
      { error: 'Failed to identify legal terms' },
      { status: 500 },
    );
  }
}

async function identifyLegalTermsWithAI(
  text: string,
  context: {
    jurisdiction?: string;
    documentType?: string;
    language?: string;
  },
): Promise<LegalTerm[]> {
  try {
    const prompt = `
You are a legal terminology expert. Identify and analyze legal terms in the following text.

Text: "${text}"

Context:
- Jurisdiction: ${context.jurisdiction || 'Unknown'}
- Document Type: ${context.documentType || 'Unknown'}
- Language: ${context.language || 'Unknown'}

For each legal term found, provide:
1. The exact term as it appears
2. A clear definition
3. Applicable jurisdictions
4. Confidence score (0-1)
5. Context within the document
6. Alternative terms if applicable

Return as JSON array with this structure:
[{
  "term": "string",
  "definition": "string", 
  "jurisdiction": ["string"],
  "confidence": number,
  "context": "string",
  "alternatives": ["string"]
}]

Only include terms that are genuinely legal concepts, not common words.
`;

    const response = await aiInstance.generateText(prompt);

    // Parse AI response
    let parsedTerms: LegalTerm[] = [];

    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsedTerms = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: parse structured text response
        parsedTerms = parseStructuredResponse(response, context);
      }
    } catch (parseError) {
      console.warn('Failed to parse AI response, using fallback:', parseError);
      parsedTerms = extractTermsWithFallback(text, context);
    }

    // Validate and filter terms
    return parsedTerms
      .filter((term) => term.term && term.definition && term.confidence > 0.3)
      .slice(0, 20); // Limit to top 20 terms
  } catch (error) {
    console.error('AI term identification failed:', error);
    return extractTermsWithFallback(text, context);
  }
}

function parseStructuredResponse(response: string, context: any): LegalTerm[] {
  const terms: LegalTerm[] = [];
  const lines = response.split('\n').filter((line) => line.trim());

  let currentTerm: Partial<LegalTerm> = {};

  for (const line of lines) {
    if (line.includes('Term:')) {
      if (currentTerm.term) {
        terms.push(currentTerm as LegalTerm);
      }
      currentTerm = {
        term: line
          .replace(/.*Term:\s*/, '')
          .replace(/['"]/g, '')
          .trim(),
        jurisdiction: [context.jurisdiction || 'Unknown'],
        confidence: 0.7,
      };
    } else if (line.includes('Definition:')) {
      currentTerm.definition = line.replace(/.*Definition:\s*/, '').trim();
    } else if (line.includes('Context:')) {
      currentTerm.context = line.replace(/.*Context:\s*/, '').trim();
    }
  }

  if (currentTerm.term) {
    terms.push(currentTerm as LegalTerm);
  }

  return terms;
}

function extractTermsWithFallback(text: string, context: any): LegalTerm[] {
  // Fallback: use predefined legal term patterns
  const commonLegalTerms = [
    {
      pattern:
        /\b(consideration|contract|agreement|liability|negligence|damages)\b/gi,
      confidence: 0.9,
    },
    {
      pattern: /\b(plaintiff|defendant|appellant|respondent)\b/gi,
      confidence: 0.95,
    },
    {
      pattern: /\b(jurisdiction|venue|discovery|deposition)\b/gi,
      confidence: 0.85,
    },
    {
      pattern: /\b(force majeure|due process|habeas corpus)\b/gi,
      confidence: 0.92,
    },
    {
      pattern: /\b(indemnify|indemnification|hold harmless)\b/gi,
      confidence: 0.88,
    },
  ];

  const legalTermDefinitions: Record<string, string> = {
    consideration: 'Something of value exchanged between parties in a contract',
    contract: 'A legally binding agreement between two or more parties',
    agreement: 'A mutual understanding between parties',
    liability: "Legal responsibility for one's acts or omissions",
    negligence: 'Failure to exercise reasonable care',
    damages: 'Monetary compensation for loss or injury',
    plaintiff: 'The party who initiates a lawsuit',
    defendant: 'The party being sued or accused',
    jurisdiction: 'The authority of a court to hear cases',
    'force majeure':
      'Unforeseeable circumstances preventing contract fulfillment',
  };

  const foundTerms: LegalTerm[] = [];

  for (const { pattern, confidence } of commonLegalTerms) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        const term = match.toLowerCase();
        if (legalTermDefinitions[term]) {
          foundTerms.push({
            term: match,
            definition: legalTermDefinitions[term],
            jurisdiction: [context.jurisdiction || 'US-ALL'],
            confidence,
            context: 'Found in document text',
            alternatives: [],
          });
        }
      }
    }
  }

  // Remove duplicates
  const uniqueTerms = foundTerms.filter(
    (term, index, self) =>
      index ===
      self.findIndex((t) => t.term.toLowerCase() === term.term.toLowerCase()),
  );

  return uniqueTerms.slice(0, 10);
}
