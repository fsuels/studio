import { OpenAI } from 'openai';

let openai: OpenAI | null = null;

const initOpenAI = (): OpenAI | null => {
  if (openai) return openai;
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    console.error('[explain-clause] Missing NEXT_PUBLIC_OPENAI_API_KEY');
    return null;
  }
  try {
    openai = new OpenAI({ apiKey });
    return openai;
  } catch (err) {
    console.error('[explain-clause] Failed to init OpenAI', err);
    return null;
  }
};

export async function explainClause(text: string): Promise<string> {
  const client = initOpenAI();
  if (!client) return 'AI service unavailable.';
  const prompt = `Explain this legal clause in plain English: "${text}"`;
  try {
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });
    return res.choices[0].message.content?.trim() || '';
  } catch (err) {
    console.error('[explain-clause] API error', err);
    return 'Unable to retrieve explanation.';
  }
}
