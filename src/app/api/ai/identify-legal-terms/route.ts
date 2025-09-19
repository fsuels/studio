// src/app/api/ai/identify-legal-terms/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { aiInstance, GuardrailViolationError } from '@/ai/ai-instance';

interface LegalTerm {
  term: string;
  definition: string;
  jurisdiction: string[];
  confidence: number;
  context: string;
  alternatives?: string[];
}

type DetectionContext = {
  jurisdiction?: string;
  documentType?: string;
  language?: string;
};

type DetectionOutcome = {
  terms: LegalTerm[];
  source: 'ai' | 'fallback';
  warnings: string[];
};

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  try {
    const body = await request.json();
    const { text, jurisdiction, documentType, language } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const outcome = await identifyLegalTermsWithAI(text, {
      jurisdiction,
      documentType,
      language,
    });
    const durationMs = Date.now() - startedAt;

    return NextResponse.json({
      legalTerms: outcome.terms,
      metadata: {
        termsFound: outcome.terms.length,
        jurisdiction,
        language,
        documentType,
        processingTimeMs: durationMs,
        source: outcome.source,
        warnings: outcome.warnings,
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
  context: DetectionContext,
): Promise<DetectionOutcome> {
  const warnings: string[] = [];

  try {
    const prompt = `
You are a bilingual legal terminology expert. Identify legal terms in the text below and provide structured information.

Return ONLY valid JSON matching:
[
  {
    "term": "string",
    "definition": "string",
    "jurisdiction": ["string"],
    "confidence": number,
    "context": "string",
    "alternatives": ["string"]
  }
]

Text: "${text}"

Context:
- Jurisdiction: ${context.jurisdiction || 'Unknown'}
- Document Type: ${context.documentType || 'Unknown'}
- Language: ${context.language || 'Unknown'}

Rules:
- Only include genuine legal concepts.
- Set confidence between 0 and 1.
- Provide concise, plain-language definitions.
- Leave alternatives empty if none exist.`;

    const response = await aiInstance.generateText(prompt, {
      system:
        'You detect legal terminology with compliance focus. Respond with strict JSON and avoid legal advice.',
      channel: 'legal_term_detection',
      language: (context.language as 'en' | 'es' | undefined) ?? 'en',
      jurisdiction: context.jurisdiction,
      metadata: {
        documentType: context.documentType,
      },
      responseFormat: 'json',
      temperature: 0.1,
      maxTokens: 900,
    });

    const parsed = JSON.parse(response) as unknown;
    const terms = Array.isArray(parsed) ? (parsed as LegalTerm[]) : [];
    const cleaned = terms
      .filter((term) =>
        term && typeof term.term === 'string' && typeof term.definition === 'string'
          ? typeof term.confidence === 'number' && term.confidence > 0
          : false,
      )
      .map((term) => ({
        term: term.term,
        definition: term.definition,
        jurisdiction:
          Array.isArray(term.jurisdiction) && term.jurisdiction.length > 0
            ? term.jurisdiction
            : [context.jurisdiction || 'Unknown'],
        confidence: Math.min(1, Math.max(0, Number(term.confidence))),
        context: term.context || 'Identified in document text',
        alternatives: Array.isArray(term.alternatives)
          ? term.alternatives
          : [],
      }));

    return {
      terms: cleaned.slice(0, 20),
      source: 'ai',
      warnings,
    };
  } catch (error) {
    if (error instanceof GuardrailViolationError) {
      console.warn('Guardrails blocked legal term detection', error.decision);
      warnings.push(
        error.decision.reason || 'Guardrails blocked the legal term detection request.',
      );
    } else {
      console.error('AI term identification failed:', error);
      warnings.push(
        error instanceof Error ? error.message : 'AI term detection unavailable.',
      );
    }

    const fallbackTerms = extractTermsWithFallback(text, context);
    return {
      terms: fallbackTerms,
      source: 'fallback',
      warnings,
    };
  }
}

function extractTermsWithFallback(
  text: string,
  context: DetectionContext,
): LegalTerm[] {
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
    venue: 'Location where a legal case is heard',
    discovery: 'Pre-trial exchange of evidence between parties',
    deposition: 'Sworn out-of-court testimony used for discovery',
    'force majeure':
      'Unforeseeable circumstances preventing contract fulfillment',
    'due process': 'Fundamental fairness required by law in legal proceedings',
    'habeas corpus': 'Legal action to determine unlawful detention',
    indemnify: 'To compensate for harm or loss',
    indemnification: 'Obligation to compensate for loss or harm',
    'hold harmless': 'Promise not to hold someone responsible for liability',
  };

  const foundTerms: LegalTerm[] = [];

  for (const { pattern, confidence } of commonLegalTerms) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        const key = match.toLowerCase();
        if (legalTermDefinitions[key]) {
          foundTerms.push({
            term: match,
            definition: legalTermDefinitions[key],
            jurisdiction: [context.jurisdiction || 'US-ALL'],
            confidence,
            context: 'Found in document text',
            alternatives: [],
          });
        }
      }
    }
  }

  const uniqueTerms = foundTerms.filter(
    (term, index, self) =>
      index ===
      self.findIndex((t) => t.term.toLowerCase() === term.term.toLowerCase()),
  );

  return uniqueTerms.slice(0, 10);
}
