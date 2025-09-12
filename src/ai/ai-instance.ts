// ai-instance.ts
// Stubbed AI instance: Genkit/Google AI integration disabled.
// This placeholder prevents server errors related to missing GOOGLE_GENAI_API_KEY.

// Minimal interfaces to satisfy imports across the app without pulling real AI deps.
type PromptConfig<I = unknown, O = unknown> = {
  name: string;
  model?: string;
  input?: { schema?: unknown };
  output?: { schema?: unknown; format?: string };
  prompt: string;
};

type FlowConfig<I = unknown, O = unknown> = {
  name: string;
  inputSchema?: unknown;
  outputSchema?: unknown;
};

type AIStub = {
  run: (..._args: unknown[]) => Promise<unknown | null>;
  definePrompt: <I = unknown, O = unknown>(
    _config: PromptConfig<I, O>,
  ) => (input: I & Record<string, unknown>) => Promise<{ output: O }>;
  defineFlow: <I = unknown, O = unknown>(
    _config: FlowConfig<I, O>,
    handler: (input: I) => Promise<O>,
  ) => (input: I) => Promise<O>;
};

const ai: AIStub = {
  run: async (..._args: unknown[]) => {
    console.warn('AI functionality is currently disabled.');
    return null;
  },
  definePrompt: <I, O>(_config: PromptConfig<I, O>) => {
    return async (_input: I & Record<string, unknown>) => {
      console.warn('AI prompt execution is disabled. Returning empty output.');
      return { output: undefined as unknown as O };
    };
  },
  defineFlow: <I, O>(_config: FlowConfig<I, O>, handler: (input: I) => Promise<O>) => {
    // Pass-through to the provided handler
    return async (input: I) => handler(input);
  },
};

// Very small surface used by API routes that expect a text generation function
const aiInstance = {
  async generateText(prompt: string): Promise<string> {
    console.warn('AI generateText disabled. Echoing prompt for testing.');
    return String(prompt);
  },
};

export { ai, aiInstance };
