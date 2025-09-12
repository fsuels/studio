// ai-instance.ts
// Stubbed AI instance: Genkit/Google AI integration disabled.
// This placeholder prevents server errors related to missing GOOGLE_GENAI_API_KEY.

// Export a no-op AI object for compatibility. Replace with actual implementation when needed.
type AIStub = {
  run: (..._args: unknown[]) => Promise<unknown | null>;
};

const ai: AIStub = {
  // Example stub method
  run: async (..._args: unknown[]) => {
    console.warn('AI functionality is currently disabled.');
    return null;
  },
};

export { ai };
