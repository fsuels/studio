// src/app/api/ai/legal-translate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { aiInstance } from '@/ai/ai-instance';

export async function POST(request: NextRequest) {
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
      legalSystem
    } = body;

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text, source language, and target language are required' },
        { status: 400 }
      );
    }

    const translatedText = await translateWithLegalPreservation(text, {
      sourceLanguage,
      targetLanguage,
      jurisdiction,
      documentType,
      legalTermMap: legalTermMap || {},
      preservedTerms: preservedTerms || [],
      legalSystem
    });

    return NextResponse.json({
      translatedText,
      metadata: {
        sourceLanguage,
        targetLanguage,
        preservedTermsCount: preservedTerms?.length || 0,
        legalTermsTranslated: Object.keys(legalTermMap || {}).length,
        processingTime: Date.now()
      }
    });

  } catch (error) {
    console.error('Legal translation failed:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

async function translateWithLegalPreservation(
  text: string,
  context: {
    sourceLanguage: string;
    targetLanguage: string;
    jurisdiction?: string;
    documentType?: string;
    legalTermMap: Record<string, string>;
    preservedTerms: string[];
    legalSystem?: string;
  }
): Promise<string> {
  try {
    // Create term protection markers
    let protectedText = text;
    const termMarkers: Record<string, string> = {};
    
    // Mark preserved terms to prevent translation
    context.preservedTerms.forEach((term, index) => {
      const marker = `__PRESERVED_${index}__`;
      termMarkers[marker] = term;
      protectedText = protectedText.replace(
        new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi'),
        marker
      );
    });

    // Mark legal terms for controlled translation
    Object.entries(context.legalTermMap).forEach(([original, translation], index) => {
      const marker = `__LEGAL_${index}__`;
      termMarkers[marker] = translation;
      protectedText = protectedText.replace(
        new RegExp(`\\b${escapeRegExp(original)}\\b`, 'gi'),
        marker
      );
    });

    const prompt = `
You are a professional legal translator specializing in ${context.sourceLanguage} to ${context.targetLanguage} translation.

CRITICAL INSTRUCTIONS:
1. Translate the following legal document text with extreme accuracy
2. Preserve the exact meaning and legal intent
3. DO NOT translate any text marked with __PRESERVED_X__ markers
4. DO NOT translate any text marked with __LEGAL_X__ markers
5. Maintain the original structure and formatting
6. Use appropriate legal terminology for ${context.targetLanguage}
7. Consider ${context.legalSystem || 'common law'} legal system conventions

Context:
- Document Type: ${context.documentType || 'Legal Document'}
- Jurisdiction: ${context.jurisdiction || 'Not specified'}
- Legal System: ${context.legalSystem || 'Common Law'}
- Source: ${context.sourceLanguage}
- Target: ${context.targetLanguage}

Text to translate:
"${protectedText}"

Provide ONLY the translated text without any explanations or notes.
Maintain all marker placeholders exactly as they appear.
`;

    const translatedText = await aiInstance.generateText(prompt);
    
    // Restore protected terms
    let finalText = translatedText.trim();
    Object.entries(termMarkers).forEach(([marker, replacement]) => {
      finalText = finalText.replace(new RegExp(marker, 'g'), replacement);
    });

    return finalText;

  } catch (error) {
    console.error('AI translation failed:', error);
    
    // Fallback to basic translation with term preservation
    return await fallbackTranslation(text, context);
  }
}

async function fallbackTranslation(
  text: string,
  context: {
    sourceLanguage: string;
    targetLanguage: string;
    legalTermMap: Record<string, string>;
    preservedTerms: string[];
  }
): Promise<string> {
  // Simple fallback: apply term mappings and preserve terms
  let result = text;
  
  // Apply legal term translations
  Object.entries(context.legalTermMap).forEach(([original, translation]) => {
    result = result.replace(
      new RegExp(`\\b${escapeRegExp(original)}\\b`, 'gi'),
      translation
    );
  });

  // Note: In a real implementation, you would integrate with a translation service
  // For now, we'll just apply the term mappings and add a note
  
  if (context.sourceLanguage !== context.targetLanguage) {
    // Could integrate with Google Translate API, Azure Translator, etc.
    console.warn('Fallback translation: only legal terms translated, full translation needs service integration');
  }

  return result;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}