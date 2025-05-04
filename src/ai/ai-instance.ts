
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Log entry point of the module
console.log('[ai-instance.ts] Module execution starting.');

// Explicitly check for GOOGLE_GENAI_API_KEY
const googleApiKey = process.env.GOOGLE_GENAI_API_KEY;

// Detailed logging based on API key presence
if (!googleApiKey) {
  console.error('---');
  console.error('[ai-instance.ts] CRITICAL: GOOGLE_GENAI_API_KEY environment variable is NOT SET or is EMPTY.');
  console.error('[ai-instance.ts] Build/Runtime Check: Ensure the key is defined in your .env file (e.g., GOOGLE_GENAI_API_KEY=AIz...) or environment variables.');
  console.error('[ai-instance.ts] Without this key, Genkit Google AI plugin cannot initialize, likely causing downstream errors (e.g., Internal Server Error).');
  console.error('---');
  // Throw a configuration error immediately. This prevents proceeding with a non-functional AI setup.
  // This error during 'next build' or server startup will likely result in a build failure or an "Internal Server Error".
  throw new Error('Missing or empty GOOGLE_GENAI_API_KEY environment variable. Cannot initialize AI services.');
} else {
    // Log success, but only show partial key info for security verification.
    const keyPreview = `${googleApiKey.substring(0, 4)}...${googleApiKey.substring(googleApiKey.length - 4)}`;
    console.log(`[ai-instance.ts] SUCCESS: GOOGLE_GENAI_API_KEY environment variable found (Preview: ${keyPreview}, Length: ${googleApiKey.length}).`);
    console.log(`[ai-instance.ts] Proceeding with Genkit initialization using this key...`);
}

// Declare ai variable - Using 'any' for now, consider defining a more specific type if possible
let ai: any;

try {
  // Log right before initialization attempt
  console.log('[ai-instance.ts] Attempting to initialize Genkit with googleAI plugin...');
  ai = genkit({
    promptDir: './prompts', // Ensure this directory exists if used (though not currently used based on flow)
    plugins: [
      googleAI({
        apiKey: googleApiKey, // Use the validated variable
        // Consider explicitly setting API version if needed, e.g., apiVersion: 'v1beta'
      }),
    ],
    // model: 'googleai/gemini-1.5-flash-latest', // Default model (Optional, can be set per-prompt/flow)
    logLevel: 'debug', // Use 'info' or 'warn' in production, 'debug' for development
    enableTracing: true, // Enable tracing for monitoring flows (requires setup)
  });
  // Log successful initialization
  console.log('[ai-instance.ts] Genkit initialization with googleAI plugin completed successfully.');

} catch (error: unknown) {
  // Catch and log any errors during Genkit initialization itself
  console.error('---');
  console.error('[ai-instance.ts] FATAL ERROR during Genkit initialization:');
  if (error instanceof Error) {
     console.error(`[ai-instance.ts] Error Name: ${error.name}`);
     console.error(`[ai-instance.ts] Error Message: ${error.message}`);
     // Only log stack in debug mode or if specifically needed, can be very verbose
     // console.error('Error Stack:', error.stack);
  } else {
      console.error('[ai-instance.ts] Caught non-Error object during initialization:', error);
  }
  console.error('[ai-instance.ts] Possible Causes: Invalid API Key format/value, network issues reaching Google AI, incorrect plugin configuration.');
  console.error('---');
  // Re-throw the error to ensure the application fails fast if Genkit can't initialize.
  // This prevents the app from running in a state where AI features will inevitably fail.
  throw new Error(`Genkit initialization failed: ${error instanceof Error ? error.message : String(error)}`);
}

// Log before exporting
console.log('[ai-instance.ts] Module execution finished. Exporting initialized ai instance.');

// Export the initialized ai instance
export { ai };
