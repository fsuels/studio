import 'server-only';

import {
  createChatCompletion,
  extractMessageContent,
  getAIGatewayModel,
  isAIGatewayConfigured,
} from '@/ai/gateway';

export interface DocumentSummaryOptions {
  readingLevel?: 'simple' | 'standard' | 'advanced';
  maxLength?: 'brief' | 'detailed' | 'comprehensive';
  focusAreas?: string[];
  includeKeyTerms?: boolean;
}

export interface DocumentSummary {
  summary: string;
  keyPoints: string[];
  importantTerms?: { term: string; definition: string }[];
  readingTime: string;
  complexity: 'low' | 'medium' | 'high';
  warnings?: string[];
}

const SUMMARY_MODEL = process.env.AI_GATEWAY_SUMMARY_MODEL;
const SIMPLIFY_MODEL = process.env.AI_GATEWAY_SIMPLIFY_MODEL;

const FALLBACK_SUMMARY: DocumentSummary = {
  summary:
    'Unable to generate an AI summary at this time. Please review the document manually.',
  keyPoints: [
    'Review all sections carefully',
    'Pay attention to rights, obligations, and signatures',
    'Record any deadlines or required actions',
    'Consult a legal professional if you require advice',
  ],
  readingTime: '< 1 minute',
  complexity: 'medium',
  warnings: ['AI summarization unavailable'],
};

const readingLevelInstructions = {
  simple:
    'Use simple, everyday language. Write at a 6th-grade reading level. Avoid legal jargon.',
  standard:
    'Use clear, accessible language. Write at a high school reading level. Explain legal terms when needed.',
  advanced:
    'Use professional but clear language. Write at a college reading level. Include necessary legal terminology with context.',
};

const lengthInstructions = {
  brief: 'Keep the summary to 2-3 sentences maximum.',
  detailed: 'Provide a thorough but concise summary in 1-2 paragraphs.',
  comprehensive:
    'Provide a detailed summary with comprehensive coverage of all major sections.',
};

function estimateReadingTime(text: string): { readingTime: string; complexity: DocumentSummary['complexity'] } {
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  const readingTime = minutes < 1 ? '< 1 minute' : `${minutes} minute${minutes > 1 ? 's' : ''}`;
  const hasComplexTerms =
    /\b(whereas|heretofore|pursuant|notwithstanding|indemnify|covenant|warranty|liability|damages|breach|remedy|jurisdiction|venue|arbitration|mediation)\b/gi.test(
      text,
    );

  const complexity: DocumentSummary['complexity'] =
    wordCount < 500 && !hasComplexTerms
      ? 'low'
      : wordCount < 1500 && !hasComplexTerms
        ? 'medium'
        : 'high';

  return { readingTime, complexity };
}

export async function summarizeDocument(
  documentText: string,
  documentType?: string,
  options: DocumentSummaryOptions = {},
): Promise<DocumentSummary | null> {
  if (!isAIGatewayConfigured()) {
    const { readingTime, complexity } = estimateReadingTime(documentText);
    return { ...FALLBACK_SUMMARY, readingTime, complexity };
  }

  const {
    readingLevel = 'standard',
    maxLength = 'detailed',
    focusAreas = [],
    includeKeyTerms = true,
  } = options;

  const { readingTime, complexity } = estimateReadingTime(documentText);
  const focusInstruction =
    focusAreas.length > 0
      ? `Pay special attention to these areas: ${focusAreas.join(', ')}.`
      : '';

  const messages = [
    {
      role: 'system' as const,
      content: 'You are a bilingual legal document assistant producing plain-language explanations without offering legal advice. Respond with strict JSON.',
    },
    {
      role: 'user' as const,
      content: `DOCUMENT TYPE: ${documentType || 'Legal Document'}\n\nINSTRUCTIONS:\n- ${readingLevelInstructions[readingLevel]}\n- ${lengthInstructions[maxLength]}\n- ${focusInstruction}\n- Identify 3-5 key points every reader should understand\n- ${
        includeKeyTerms
          ? 'Define important legal terms in simple language'
          : 'Avoid complex legal terminology'
      }\n- Highlight potential risks, obligations, or deadlines\n- Remain objective; do not provide legal advice\n\nDOCUMENT TEXT:\n${documentText}\n\nRESPONSE FORMAT (JSON):\n{\n  "summary": "Plain-language summary of the document",\n  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],\n  "importantTerms": [{"term": "Legal Term", "definition": "Simple explanation"}],\n  "warnings": ["Important warning or consideration"]\n}\n\nReturn only valid JSON.`,
    },
  ];

  try {
    const completion = await createChatCompletion({
      model: getAIGatewayModel(SUMMARY_MODEL),
      messages,
      temperature: 0.2,
      responseFormat: 'json',
      maxTokens: 1500,
    });

    const content = extractMessageContent(completion);
    if (!content) {
      throw new Error('AI gateway returned empty content');
    }

    const parsed = JSON.parse(content) as Partial<DocumentSummary> & {
      warnings?: string[];
    };

    const summary: DocumentSummary = {
      summary: parsed.summary ?? FALLBACK_SUMMARY.summary,
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      importantTerms: includeKeyTerms
        ? (Array.isArray(parsed.importantTerms) ? parsed.importantTerms : [])
        : undefined,
      readingTime,
      complexity,
      warnings: Array.isArray(parsed.warnings)
        ? parsed.warnings
        : parsed.warnings
          ? [String(parsed.warnings)]
          : [],
    };

    return summary;
  } catch (error) {
    console.error('[summarize-document] AI gateway failure:', error);
    return { ...FALLBACK_SUMMARY, readingTime, complexity };
  }
}

export async function simplifyLegalJargon(text: string): Promise<string> {
  if (!isAIGatewayConfigured()) {
    return text;
  }

  const prompt = `Replace legal jargon in this text with simple, everyday language while preserving the meaning.\n\n"${text}"\n\nRules:\n- Keep the same meaning and legal accuracy\n- Use common words instead of legal terms when possible\n- Make it accessible to someone without legal training\n- Preserve the original sentence structure when possible\n\nReturn only the simplified text.`;

  try {
    const completion = await createChatCompletion({
      model: getAIGatewayModel(SIMPLIFY_MODEL || SUMMARY_MODEL),
      messages: [
        {
          role: 'system',
          content:
            'You rewrite legal text in plain language while maintaining accuracy. Reply with text only.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      maxTokens: 600,
    });

    return extractMessageContent(completion) || text;
  } catch (error) {
    console.error('[simplify-legal-jargon] AI gateway failure:', error);
    return text;
  }
}

// Cache for document summaries to avoid repeated AI calls
const summaryCache = new Map<
  string,
  { summary: DocumentSummary; timestamp: number }
>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function getCachedDocumentSummary(
  documentText: string,
  documentType?: string,
  options: DocumentSummaryOptions = {},
): Promise<DocumentSummary | null> {
  const cacheKey = `${documentType || 'unknown'}-${JSON.stringify(options)}-${documentText.slice(0, 100)}`;
  const cached = summaryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.summary;
  }

  const summary = await summarizeDocument(documentText, documentType, options);

  if (summary) {
    summaryCache.set(cacheKey, { summary, timestamp: Date.now() });
  }

  return summary;
}
