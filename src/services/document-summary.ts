import 'server-only';

import { evaluateGuardrails } from '@/ai/guardrails';
import {
  createChatCompletion,
  extractMessageContent,
  getAIGatewayModel,
  isAIGatewayConfigured,
} from '@/ai/gateway';

const DOCUMENT_SUMMARY_MODEL = process.env.AI_GATEWAY_SUMMARY_MODEL;

const REFUSAL_MESSAGE =
  'Unable to summarize this document right now. A specialist will review it.';

export async function summarizeDocument(text: string): Promise<string> {
  if (!text?.trim()) {
    return '';
  }

  if (!isAIGatewayConfigured()) {
    return 'AI summary service not configured.';
  }

  const prompt = `Summarize the following legal document in a short paragraph without giving legal advice:\n\n${text}`;

  const preDecision = await evaluateGuardrails({
    prompt,
    channel: 'summary',
  });

  if (!preDecision.allowed) {
    return REFUSAL_MESSAGE;
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
          content: prompt,
        },
      ],
      temperature: 0.3,
      maxTokens: 400,
    });

    const summary = extractMessageContent(completion) || '';

    const postDecision = await evaluateGuardrails(
      { prompt, channel: 'summary' },
      summary,
    );

    if (!postDecision.allowed) {
      return REFUSAL_MESSAGE;
    }

    return summary;
  } catch (error) {
    console.error('[services/document-summary] AI gateway failure:', error);
    return 'Error generating summary.';
  }
}
