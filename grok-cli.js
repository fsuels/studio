const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { program } = require('commander');

// Load .env.local
dotenv.config({ path: path.resolve('C:/dev/123legaldoc/.env.local') });

const XAI_API_KEY = process.env.XAI_API_KEY;
const API_URL = 'https://api.x.ai/v1/chat/completions';

if (!XAI_API_KEY) {
  console.error('Error: XAI_API_KEY not found in .env.local.');
  process.exit(1);
}

async function callGrok4(prompt) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'grok-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096,  // Higher for code fixes
      },
      {
        headers: {
          Authorization: `Bearer ${XAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error.response?.data?.error?.message || error.message);
    if (error.response?.status === 401) console.error('Invalid key.');
    if (error.response?.status === 429) console.error('Quota hit.');
    process.exit(1);
  }
}

program
  .version('1.0.0')
  .description('Grok 4 CLI for project tasks')
  .argument('<prompt>', 'Prompt for Grok 4 (e.g., "Fix bug in app.js")')
  .option('-f, --file <path>', 'File to include in prompt (relative path, e.g., app.js)')
  .option('-o, --output <path>', 'Save Grok response to file (e.g., fixed-app.js)')
  .action(async (prompt, options) => {
    let fullPrompt = prompt;
    if (options.file) {
      const filePath = path.resolve(options.file);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        fullPrompt = `${prompt}\n\nFile content:\n${fileContent}`;
      } else {
        console.error(`File not found: ${options.file}`);
        process.exit(1);
      }
    }
    const result = await callGrok4(fullPrompt);
    console.log('Grok 4 Response:\n', result);
    if (options.output) {
      fs.writeFileSync(options.output, result, 'utf8');
      console.log(`Saved to ${options.output}`);
    }
  });

program.parse();
