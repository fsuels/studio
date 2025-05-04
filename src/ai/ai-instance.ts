
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Log entry point of the module
console.log('[ai-instance.ts] Module execution starting.');

const googleApiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!googleApiKey) {
  // Log detailed error if the key is missing.
  console.error('---');
  console.error('[ai-instance.ts] FATAL ERROR: GOOGLE_GENAI_API_KEY environment variable is NOT set.');
  console.error('Ensure the GOOGLE_GENAI_API_KEY is defined in your .env file (e.g., GOOGLE_GENAI_API_KEY=...) or in your deployment environment variables.');
  console.error('Genkit Google AI plugin CANNOT be initialized without the API key.');
  console.error('---');
  // Throw a configuration error immediately.
  // This will likely cause an Internal Server Error upstream if not caught.
  throw new Error('Missing GOOGLE_GENAI_API_KEY environment variable. Cannot initialize AI services.');
} else {
    // Log success, but mask the key itself for security.
    console.log(`[ai-instance.ts] GOOGLE_GENAI_API_KEY environment variable found (length: ${googleApiKey.length}). Proceeding with Genkit initialization...`);
}

let ai: any; // Declare ai variable

try {
  console.log('[ai-instance.ts] Attempting to initialize Genkit...');
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
  console.log('[ai-instance.ts] Genkit initialization successful.');
} catch (error: unknown) {
  // Catch and log any errors during Genkit initialization
  console.error('---');
  console.error('[ai-instance.ts] FATAL ERROR during Genkit initialization:');
  if (error instanceof Error) {
     console.error('Error Message:', error.message);
     console.error('Error Stack:', error.stack);
  } else {
      console.error('Caught non-Error object:', error);
  }
   console.error('Check API key validity, network connectivity, and Genkit/Plugin configuration.');
  console.error('---');
  // Re-throw the error to ensure the application doesn't proceed in a broken state
  throw new Error(`Genkit initialization failed: ${error instanceof Error ? error.message : String(error)}`);
}

console.log('[ai-instance.ts] Module execution finished. Exporting ai instance.');
// Export the initialized ai instance
export { ai };
