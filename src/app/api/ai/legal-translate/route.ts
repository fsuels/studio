// src/app/api/ai/legal-translate/route.ts
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

type TranslationContext = {
  sourceLanguage: string;
  targetLanguage: string;
  jurisdiction?: string;
  documentType?: string;
  legalTermMap: Record<string, string>;
  preservedTerms: string[];
  legalSystem?: string;
};

type TranslationOutcome = {
  text: string;
  source: 'ai' | 'fallback';
  warnings: string[];
};

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  try {
    const body = await request.json();
    const {
      text,
      sourceLanguage,
      targetLanguage,
      jurisdiction,
      documentType,
      legalTermMap,
      preservedTerms,
      legalSystem,
    } = body;

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text, source language, and target language are required' },
        { status: 400 },
      );
    }

    const context: TranslationContext = {
      sourceLanguage,
      targetLanguage,
      jurisdiction,
      documentType,
      legalTermMap: legalTermMap || {},
      preservedTerms: preservedTerms || [],
      legalSystem,
    };

    const outcome = await translateWithLegalPreservation(text, context);
    const durationMs = Date.now() - startedAt;

    return NextResponse.json({
      translatedText: outcome.text,
      metadata: {
        sourceLanguage,
        targetLanguage,
        preservedTermsCount: context.preservedTerms.length,
        legalTermsTranslated: Object.keys(context.legalTermMap).length,
        jurisdiction,
        documentType,
        processingTimeMs: durationMs,
        source: outcome.source,
        warnings: outcome.warnings,
      },
    });
  } catch (error) {
    console.error('Legal translation failed:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}

async function translateWithLegalPreservation(
  text: string,
  context: TranslationContext,
): Promise<TranslationOutcome> {
  const termMarkers: Record<string, string> = {};
  let protectedText = text;

  context.preservedTerms.forEach((term, index) => {
    const marker = `__PRESERVED_${index}__`;
    termMarkers[marker] = term;
    protectedText = protectedText.replace(
      new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi'),
      marker,
    );
  });

  Object.entries(context.legalTermMap).forEach(([original, translation], index) => {
    const marker = `__LEGAL_${index}__`;
    termMarkers[marker] = translation;
    protectedText = protectedText.replace(
      new RegExp(`\\b${escapeRegExp(original)}\\b`, 'gi'),
      marker,
    );
  });

  const prompt = `
You are a professional legal translator specializing in ${context.sourceLanguage} to ${context.targetLanguage} localization.

CRITICAL INSTRUCTIONS:
1. Translate the following legal document text with precise preservation of legal meaning.
2. DO NOT translate any content wrapped in __PRESERVED_X__ markers.
3. Replace __LEGAL_X__ markers with the mapped translation provided.
4. Maintain structure, numbering, and formatting exactly.
5. Apply legal terminology appropriate for ${context.targetLanguage} within the ${context.legalSystem || 'common law'} system.
6. Avoid legal advice; provide neutral translation only.

Context:
- Document Type: ${context.documentType || 'Legal Document'}
- Jurisdiction: ${context.jurisdiction || 'Not specified'}
- Legal System: ${context.legalSystem || 'Common Law'}

Text to translate:
"${protectedText}"

Return ONLY the translated text with markers intact.`;

  try {
    const translated = await aiInstance.generateText(prompt, {
      system:
        'You are a bilingual legal translator. Preserve intent, refrain from legal advice, and follow all marker rules exactly.',
      channel: 'legal_translation',
      language: context.targetLanguage,
      jurisdiction: context.jurisdiction,
      metadata: {
        documentType: context.documentType,
        preservedTermCount: context.preservedTerms.length,
        mappedTermCount: Object.keys(context.legalTermMap).length,
      },
      temperature: 0.1,
      maxTokens: Math.min(2048, Math.max(600, Math.ceil(text.length / 2))),
    });

    let finalText = translated.trim();
    Object.entries(termMarkers).forEach(([marker, replacement]) => {
      finalText = finalText.replace(new RegExp(marker, 'g'), replacement);
    });

    return {
      text: finalText,
      source: 'ai',
      warnings: [],
    };
  } catch (error) {
    const warnings: string[] = [];
    if (error instanceof GuardrailViolationError) {
      console.warn('Guardrails blocked translation request', error.decision);
      warnings.push(
        error.decision.reason || 'Guardrails blocked the translation request.',
      );
    } else {
      console.error('AI translation failed:', error);
      warnings.push(
        error instanceof Error ? error.message : 'AI translation unavailable.',
      );
    }

    const fallback = await fallbackTranslation(text, context);
    return {
      text: fallback,
      source: 'fallback',
      warnings,
    };
  }
}

async function fallbackTranslation(
  text: string,
  context: TranslationContext,
): Promise<string> {
  let result = text;

  Object.entries(context.legalTermMap).forEach(([original, translation]) => {
    result = result.replace(
      new RegExp(`\\b${escapeRegExp(original)}\\b`, 'gi'),
      translation,
    );
  });

  if (context.sourceLanguage !== context.targetLanguage) {
    console.warn(
      'Fallback translation executed without full-language conversion; only legal term mappings applied.',
    );
  }

  return result;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
