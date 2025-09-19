import 'server-only';

import {
  createChatCompletion,
  extractMessageContent,
  getAIGatewayModel,
  isAIGatewayConfigured,
} from '@/ai/gateway';

const DOCUMENT_SUMMARY_MODEL = process.env.AI_GATEWAY_SUMMARY_MODEL;

export async function summarizeDocument(text: string): Promise<string> {
  if (!text?.trim()) {
    return '';
  }

  if (!isAIGatewayConfigured()) {
    return 'AI summary service not configured.';
  }

  try {
    const completion = await createChatCompletion({
      model: getAIGatewayModel(DOCUMENT_SUMMARY_MODEL),
      messages: [
        {
          role: 'system',
          content:
            'You produce short, neutral summaries of legal documents in plain language. Do not provide legal advice.',
        },
        {
          role: 'user',
          content: `Summarize the following document in a short paragraph:\n\n${text}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 400,
    });

    return extractMessageContent(completion) || '';
  } catch (error) {
    console.error('[services/document-summary] AI gateway failure:', error);
    return 'Error generating summary.';
  }
}
