const axios = require('axios');

const XAI_API_KEY = 'YOUR_KEY_HERE';  // Hardcode for test, remove later
const API_URL = 'https://api.x.ai/v1/chat/completions';

async function callGrok4(prompt) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'grok-4',  // Try 'grok-4'; if fails, change to 'grok-3-latest'
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: Bearer ,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error.response?.data?.error?.message || error.message);
    if (error.response?.status === 401) console.error('Invalid key');
    if (error.response?.status === 429) console.error('Quota hit');
    if (error.response?.data?.error?.code === 'model_not_found') console.error('Try model: grok-3-latest');
    throw error;
  }
}

async function main() {
  const prompt = 'Test: Respond with "Grok 4 connected" only.';
  const result = await callGrok4(prompt);
  console.log('Response:\n', result);
}

main().catch(console.error);
