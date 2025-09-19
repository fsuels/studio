import 'server-only';

type ChatCompletionMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatCompletionResponse = {
  choices: Array<{
    message?: {
      role?: string;
      content: string | null;
    };
    finish_reason?: string;
  }>;
};

const DEFAULT_MODEL = process.env.AI_GATEWAY_MODEL ?? 'gpt-oss-20b';

const sanitize = (value: string | undefined | null): string =>
  value?.trim() ?? '';

export function getAIGatewayUrl(): string {
  return sanitize(process.env.AI_GATEWAY_URL);
}

export function getAIGatewayApiKey(): string {
  return sanitize(process.env.AI_GATEWAY_API_KEY);
}

export function isAIGatewayConfigured(): boolean {
  return Boolean(getAIGatewayUrl() && getAIGatewayApiKey());
}

export function getAIGatewayModel(fallback?: string): string {
  return sanitize(fallback) || DEFAULT_MODEL;
}

type ChatCompletionOptions = {
  model?: string;
  messages: ChatCompletionMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'json' | 'text';
};

export async function createChatCompletion(
  options: ChatCompletionOptions,
): Promise<ChatCompletionResponse> {
  const url = getAIGatewayUrl();
  const apiKey = getAIGatewayApiKey();

  if (!url || !apiKey) {
    throw new Error('AI gateway is not configured');
  }

  const payload: Record<string, unknown> = {
    model: getAIGatewayModel(options.model),
    messages: options.messages,
    temperature: options.temperature ?? 0.2,
  };

  if (options.maxTokens) {
    payload.max_tokens = options.maxTokens;
  }

  if (options.responseFormat === 'json') {
    payload.response_format = { type: 'json_object' };
  }

  const response = await fetch(`${url.replace(/\/$/, '')}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `AI gateway error (${response.status}): ${body.slice(0, 2000)}`,
    );
  }

  return (await response.json()) as ChatCompletionResponse;
}

export function extractMessageContent(
  completion: ChatCompletionResponse,
): string {
  return (
    completion.choices?.[0]?.message?.content?.trim() ?? ''
  );
}
