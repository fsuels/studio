const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local (10 vars confirmed)
dotenv.config({ path: path.resolve('C:/dev/123legaldoc/.env.local') });

const XAI_API_KEY = process.env.XAI_API_KEY;
const API_URL = 'https://api.x.ai/v1/chat/completions';

if (!XAI_API_KEY) {
  console.error('Error: XAI_API_KEY not found in .env.local. Check file content and path.');
  process.exit(1);
}

async function callGrok4(prompt) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'grok-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50,  // Small for testing
      },
      {
        headers: {
          Authorization: `Bearer ${XAI_API_KEY}`,  // Literal backticks and $ preserved
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Grok 4:', error.response?.data?.error?.message || error.message);
    if (error.response?.status === 401) {
      console.error('Invalid API key or header. Regenerate at console.x.ai.');
    } else if (error.response?.status === 429) {
      console.error('Quota exceeded. Check console.x.ai for usage.');
    }
    throw error;
  }
}

// Test usage
async function main() {
  const prompt = 'Test: Respond with "Grok 4 connected" only.';
  const result = await callGrok4(prompt);
  console.log('Grok 4 Response:\n', result);
}

main().catch(console.error);
