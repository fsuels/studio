import { OpenAI } from 'openai';

let openai: OpenAI | null = null;

const initOpenAI = (): OpenAI | null => {
  if (openai) return openai;
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    console.error('[summarize-document] Missing NEXT_PUBLIC_OPENAI_API_KEY');
    return null;
  }
  try {
    openai = new OpenAI({ apiKey });
    return openai;
  } catch (err) {
    console.error('[summarize-document] Failed to init OpenAI', err);
    return null;
  }
};

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

export async function summarizeDocument(
  documentText: string,
  documentType?: string,
  options: DocumentSummaryOptions = {}
): Promise<DocumentSummary | null> {
  const client = initOpenAI();
  if (!client) {
    console.error('[summarize-document] OpenAI client not available');
    return null;
  }

  const {
    readingLevel = 'standard',
    maxLength = 'detailed',
    focusAreas = [],
    includeKeyTerms = true
  } = options;

  // Estimate reading time (average 200 words per minute)
  const wordCount = documentText.split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  const readingTime = readingTimeMinutes < 1 ? '< 1 minute' : `${readingTimeMinutes} minute${readingTimeMinutes > 1 ? 's' : ''}`;

  // Determine complexity based on document length and legal terminology
  const hasComplexTerms = /\b(whereas|heretofore|pursuant|notwithstanding|indemnify|covenant|warranty|liability|damages|breach|remedy|jurisdiction|venue|arbitration|mediation)\b/gi.test(documentText);
  const complexity: 'low' | 'medium' | 'high' = 
    wordCount < 500 && !hasComplexTerms ? 'low' :
    wordCount < 1500 && !hasComplexTerms ? 'medium' : 'high';

  const readingLevelInstructions = {
    simple: 'Use simple, everyday language. Write at a 6th-grade reading level. Avoid legal jargon.',
    standard: 'Use clear, accessible language. Write at a high school reading level. Explain legal terms when needed.',
    advanced: 'Use professional but clear language. Write at a college reading level. Include necessary legal terminology with context.'
  };

  const lengthInstructions = {
    brief: 'Keep the summary to 2-3 sentences maximum.',
    detailed: 'Provide a thorough but concise summary in 1-2 paragraphs.',
    comprehensive: 'Provide a detailed summary with comprehensive coverage of all major sections.'
  };

  const focusInstruction = focusAreas.length > 0 
    ? `Pay special attention to these areas: ${focusAreas.join(', ')}.`
    : '';

  const prompt = `
    You are a legal document expert specializing in plain-language explanations. 
    
    DOCUMENT TYPE: ${documentType || 'Legal Document'}
    
    INSTRUCTIONS:
    - ${readingLevelInstructions[readingLevel]}
    - ${lengthInstructions[maxLength]}
    - ${focusInstruction}
    - Identify 3-5 key points that every reader should understand
    - ${includeKeyTerms ? 'Define important legal terms in simple language' : 'Avoid complex legal terminology'}
    - Highlight any potential risks, obligations, or important deadlines
    - Be objective and factual - don't provide legal advice
    
    DOCUMENT TEXT:
    ${documentText}
    
    RESPONSE FORMAT (JSON):
    {
      "summary": "Plain-language summary of the document",
      "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
      "importantTerms": [{"term": "Legal Term", "definition": "Simple explanation"}],
      "warnings": ["Important warning or consideration"]
    }
    
    Respond only with valid JSON.
  `;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.choices[0].message.content?.trim();
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(content);
    
    const summary: DocumentSummary = {
      summary: parsedResponse.summary || '',
      keyPoints: parsedResponse.keyPoints || [],
      importantTerms: includeKeyTerms ? (parsedResponse.importantTerms || []) : undefined,
      readingTime,
      complexity,
      warnings: parsedResponse.warnings || [],
    };

    return summary;

  } catch (err) {
    console.error('[summarize-document] API error', err);
    
    // Return a fallback summary
    return {
      summary: 'Unable to generate AI summary at this time. Please review the document manually.',
      keyPoints: [
        'Review all sections carefully',
        'Pay attention to your rights and obligations',
        'Note any important dates or deadlines',
        'Consider consulting with a legal professional if needed'
      ],
      readingTime,
      complexity,
      warnings: ['AI summarization temporarily unavailable']
    };
  }
}

export async function simplifyLegalJargon(text: string): Promise<string> {
  const client = initOpenAI();
  if (!client) return text;

  const prompt = `
    Replace legal jargon in this text with simple, everyday language while preserving the meaning:
    
    "${text}"
    
    Rules:
    - Keep the same meaning and legal accuracy
    - Use common words instead of legal terms when possible
    - Make it accessible to someone without legal training
    - Keep the same sentence structure when possible
    
    Return only the simplified text, nothing else.
  `;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content?.trim() || text;
  } catch (err) {
    console.error('[simplify-jargon] API error', err);
    return text;
  }
}

// Cache for document summaries to avoid repeated API calls
const summaryCache = new Map<string, { summary: DocumentSummary; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function getCachedDocumentSummary(
  documentText: string,
  documentType?: string,
  options: DocumentSummaryOptions = {}
): Promise<DocumentSummary | null> {
  // Create a cache key based on document content and options
  const cacheKey = `${documentType || 'unknown'}-${JSON.stringify(options)}-${documentText.slice(0, 100)}`;
  
  // Check cache first
  const cached = summaryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.summary;
  }

  // Generate new summary
  const summary = await summarizeDocument(documentText, documentType, options);
  
  // Cache the result
  if (summary) {
    summaryCache.set(cacheKey, { summary, timestamp: Date.now() });
  }

  return summary;
}