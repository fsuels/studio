const dotenv = require('dotenv');
const path = require('path');

// Load with debug
dotenv.config({ path: path.resolve('C:/dev/123legaldoc/.env.local'), debug: true });

// Debug output
console.log('Loaded env vars count:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_') || key === 'XAI_API_KEY' || key === 'FIREBASE_PROJECT_ID' || key === 'DISABLE_CSP_DEV').length);
console.log('XAI_API_KEY:', process.env.XAI_API_KEY ? 'Found' : 'Not found');
if (process.env.XAI_API_KEY) {
  console.log('Key value:', process.env.XAI_API_KEY);
}
