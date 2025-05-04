
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const googleApiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!googleApiKey) {
  // Throw a configuration error immediately if the key is missing.
  // This prevents downstream errors that are harder to diagnose.
  console.error('FATAL: GOOGLE_GENAI_API_KEY environment variable not found. Genkit Google AI plugin cannot be initialized.');
  throw new Error('Missing GOOGLE_GENAI_API_KEY environment variable. Please ensure it is set in your .env file or environment.');
} else {
    console.log('GOOGLE_GENAI_API_KEY found. Initializing Google AI plugin.');
}


export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      apiKey: googleApiKey, // Use the variable here
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
