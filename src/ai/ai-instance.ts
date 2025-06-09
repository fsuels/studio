// ai-instance.ts
// Stubbed AI instance: Genkit/Google AI integration disabled.
// This placeholder prevents server errors related to missing GOOGLE_GENAI_API_KEY.

// Export a no-op AI object for compatibility. Replace with actual implementation when needed.
const ai: any = {
  // Example stub method
  run: async (...args: unknown[]) => {
    console.warn('AI functionality is currently disabled.');
    return null;
  }
};

export { ai };
