const fs = require('fs');

const content = fs.readFileSync('.env.local', 'utf8');
console.log('File content:\n', content);
