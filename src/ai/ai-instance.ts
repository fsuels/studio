
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Log entry point of the module
console.log('[ai-instance.ts] Module loaded.');

const googleApiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!googleApiKey) {
  // Log detailed error if the key is missing.
  console.error('FATAL [ai-instance.ts]: GOOGLE_GENAI_API_KEY environment variable not found. Genkit Google AI plugin cannot be initialized. Ensure the .env file is loaded correctly and the variable is set.');
  // Throw a configuration error immediately.
  // This error will likely cause an Internal Server Error upstream if not caught.
  throw new Error('Missing GOOGLE_GENAI_API_KEY environment variable. Cannot initialize AI services.');
} else {
    // Log success, but mask the key itself for security.
    console.log(`[ai-instance.ts] GOOGLE_GENAI_API_KEY found (length: ${googleApiKey.length}). Initializing Google AI plugin...`);
}

let ai: any; // Declare ai variable

try {
  // Attempt to initialize Genkit
  ai = genkit({
    promptDir: './prompts', // Ensure this directory exists if used
    plugins: [
      googleAI({
        apiKey: googleApiKey, // Use the validated variable here
      }),
    ],
    // Consider setting a default model or ensure it's specified in prompts/flows
    // model: 'googleai/gemini-1.5-flash-latest', // Example default model
    logLevel: 'debug', // Enable more detailed Genkit logging during development
    enableTracing: true, // Enable tracing for better debugging
  });
  console.log('[ai-instance.ts] Genkit initialized successfully.');
} catch (error) {
  // Catch and log any errors during Genkit initialization
  console.error('[ai-instance.ts] FATAL: Error initializing Genkit:', error);
  // Re-throw the error to ensure the application doesn't proceed in a broken state
  throw new Error(`Genkit initialization failed: ${error instanceof Error ? error.message : String(error)}`);
}

// Export the initialized ai instance
export { ai };
