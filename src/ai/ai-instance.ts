
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

console.log('[ai-instance.ts] Module execution starting. NODE_ENV:', process.env.NODE_ENV);

const googleApiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!googleApiKey || googleApiKey.trim() === '') {
  console.error('---');
  console.error('[ai-instance.ts] CRITICAL FAILURE: GOOGLE_GENAI_API_KEY environment variable is NOT SET or is EMPTY.');
  console.error('[ai-instance.ts] This key is essential for Genkit Google AI plugin initialization.');
  console.error('[ai-instance.ts] Ensure the key is correctly defined in your .env file (e.g., GOOGLE_GENAI_API_KEY=AIz...) or environment variables.');
  console.error('[ai-instance.ts] Without this key, AI services cannot initialize, leading to "Internal Server Error" or similar issues when AI flows are called.');
  console.error('---');
  throw new Error('FATAL: Missing or empty GOOGLE_GENAI_API_KEY. AI services cannot start.');
} else {
    const keyPreview = `${googleApiKey.substring(0, 4)}...${googleApiKey.substring(googleApiKey.length - 4)}`;
    console.log(`[ai-instance.ts] SUCCESS: GOOGLE_GENAI_API_KEY environment variable found (Preview: ${keyPreview}, Length: ${googleApiKey.length}). Attempting Genkit initialization.`);
}

let ai!: ReturnType<typeof genkit>;

try {
  console.log('[ai-instance.ts] Initializing Genkit with googleAI plugin...');
  ai = genkit({
    plugins: [
      googleAI({
        apiKey: googleApiKey,
        // Removed apiVersion to use default, ensure this is intended or specify if needed.
      }),
    ],
    // enableTracing: false, // Temporarily disabled for simplification
    // promptDir: './prompts', // Removed as not currently used by flows
  });
  console.log('[ai-instance.ts] Genkit initialization with googleAI plugin SUCCEEDED.');

} catch (error: unknown) {
  console.error('---');
  console.error('[ai-instance.ts] CATASTROPHIC ERROR during Genkit.genkit() initialization:');
  if (error instanceof Error) {
     console.error(`[ai-instance.ts] Error Name: ${error.name}`);
     console.error(`[ai-instance.ts] Error Message: ${error.message}`);
     console.error(`[ai-instance.ts] Error Stack: ${error.stack}`);
  } else {
      console.error('[ai-instance.ts] Caught non-Error object during Genkit initialization:', error);
  }
  console.error('[ai-instance.ts] This usually means a problem with the API key (even if present), plugin configuration, or network connectivity to Google AI services.');
  console.error('[ai-instance.ts] The application will likely be unstable or crash when AI features are accessed.');
  console.error('---');
  throw new Error(`Genkit initialization failed catastrophically: ${error instanceof Error ? error.message : String(error)}`);
}

if (!ai) {
  console.error('[ai-instance.ts] CRITICAL: Genkit "ai" instance is null or undefined AFTER initialization block. This should not happen.');
  throw new Error('FATAL: Genkit "ai" instance is unexpectedly null after initialization.');
}

console.log('[ai-instance.ts] Module execution finished. Exporting initialized "ai" instance.');
export { ai };
