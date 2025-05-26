import { OpenAI } from 'openai';

const getClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  return apiKey ? new OpenAI({ apiKey }) : null;
};

export async function summarizeDocument(text: string): Promise<string> {
  const client = getClient();
  if (!client) {
    return 'AI summary service not configured.';
  }
  try {
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: `Summarize the following document:\n${text}` }],
      temperature: 0.3,
    });
    return res.choices[0].message.content ?? '';
  } catch (err: unknown) {
    console.error('Failed to summarize document', err);
    return 'Error generating summary.';
  }
}
