import 'server-only';

import { evaluateGuardrails } from '@/ai/guardrails';
import {
  createChatCompletion,
  extractMessageContent,
  getAIGatewayModel,
  isAIGatewayConfigured,
} from '@/ai/gateway';

const EXPLAIN_MODEL = process.env.AI_GATEWAY_EXPLAIN_MODEL;

const REFUSAL_MESSAGE =
  'Unable to explain this clause right now. A specialist will review it.';

export async function explainClause(text: string): Promise<string> {
  if (!text?.trim()) {
    return 'Clause text is required.';
  }

  if (!isAIGatewayConfigured()) {
    return 'AI explanation service is currently unavailable.';
  }

  const prompt = `Explain this legal clause in plain English and include a Spanish translation when helpful:\n\n"${text}"`;

  const preDecision = await evaluateGuardrails({
    prompt,
    channel: 'explain_clause',
  });

  if (!preDecision.allowed) {
    return REFUSAL_MESSAGE;
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
          content: prompt,
        },
      ],
      temperature: 0.3,
      maxTokens: 400,
    });

    const explanation = extractMessageContent(completion) || 'No explanation returned.';

    const postDecision = await evaluateGuardrails(
      { prompt, channel: 'explain_clause' },
      explanation,
    );

    if (!postDecision.allowed) {
      return REFUSAL_MESSAGE;
    }

    return explanation;
  } catch (error) {
    console.debug('[explain-clause] AI gateway failure:', error);
    return 'Unable to retrieve explanation.';
  }
}
