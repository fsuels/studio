import 'server-only';

import {
  createChatCompletion,
  extractMessageContent,
  getAIGatewayModel,
  isAIGatewayConfigured,
} from '@/ai/gateway';

const EXPLAIN_MODEL = process.env.AI_GATEWAY_EXPLAIN_MODEL;

export async function explainClause(text: string): Promise<string> {
  if (!text?.trim()) {
    return 'Clause text is required.';
  }

  if (!isAIGatewayConfigured()) {
    return 'AI explanation service is currently unavailable.';
  }

  try {
    const completion = await createChatCompletion({
      model: getAIGatewayModel(EXPLAIN_MODEL),
      messages: [
        {
          role: 'system',
          content:
            'You explain legal clauses in plain language without providing legal advice. Be concise and bilingual-friendly.',
        },
        {
          role: 'user',
          content: `Explain this legal clause in plain English and include a Spanish translation when helpful:\n\n"${text}"`,
        },
      ],
      temperature: 0.3,
      maxTokens: 400,
    });

    return extractMessageContent(completion) || 'No explanation returned.';
  } catch (error) {
    console.debug('[explain-clause] AI gateway failure:', error);
    return 'Unable to retrieve explanation.';
  }
}
