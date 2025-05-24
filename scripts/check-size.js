const fs = require('fs');

function totalGzip(report) {
  return report.reduce((sum, item) => sum + (item.gzip || 0), 0);
}

if (process.argv.length < 4) {
  console.error('Usage: node check-size.js <base> <current>');
  process.exit(1);
}

const base = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const current = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));

const diff = totalGzip(current) - totalGzip(base);
if (diff > 100 * 1024) {
  console.error(`Bundle size increased by ${diff} bytes (>100KB)`);
  process.exit(1);
} else {
  console.log(`Bundle size change: ${diff} bytes`);
}
