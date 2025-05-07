// scripts/generate-previews.js

import fs from 'fs';
import path from 'path';
// import { fileURLToPath } from 'url'; // Not strictly needed if using process.cwd() consistently
import puppeteer from 'puppeteer';
import MarkdownIt from 'markdown-it'; // Added back MarkdownIt as puppeteer alone might not render .md as styled HTML

// --- CONFIGURATION — adjust as needed ---
const templatesDir = path.join(process.cwd(), 'src', 'data', 'templates');  // your .md files
const outDir       = path.join(process.cwd(), 'public', 'images', 'previews');
const languages    = ['en','es'];

// make sure output dirs exist
for (const lang of languages) {
  fs.mkdirSync(path.join(outDir, lang), { recursive: true });
}

async function generate() {
  const mdInstance = new MarkdownIt();
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }); // Added sandbox args for compatibility
  
  for (const lang of languages) {
    const mdDir = path.join(templatesDir, lang);
    const pngDir = path.join(outDir, lang);
    
    if (!fs.existsSync(mdDir)) {
        console.warn(`Markdown directory not found for language ${lang}: ${mdDir}`);
        continue;
    }

    const mdFiles = fs.readdirSync(mdDir).filter(f => f.endsWith('.md'));

    for (const mdFile of mdFiles) {
      const docId    = path.basename(mdFile, '.md');
      const mdPath   = path.join(mdDir, mdFile);
      const pngPath  = path.join(pngDir, `${docId}.png`);

      // skip if PNG exists and is newer than the Markdown
      if (fs.existsSync(pngPath)) {
        const mdStat  = fs.statSync(mdPath);
        const pngStat = fs.statSync(pngPath);
        if (pngStat.mtimeMs >= mdStat.mtimeMs) {
          console.log(`⏭ up-to-date: ${lang}/${docId}.png`);
          continue;
        }
      }

      console.log(`✏️  Rendering: ${lang}/${docId}`);
      
      const rawMdContent = fs.readFileSync(mdPath, 'utf-8');
      const htmlBody = mdInstance.render(rawMdContent);

      const html = `
        <html>
        <head>
          <style>
            body { font-family: Inter, sans-serif; padding: 32px; width: 8.5in; height: 11in; box-sizing: border-box; margin: 0; background-color: white; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 8px; text-align: left; font-size: 12px; }
            h1 { font-size: 24px; margin-top:24px; margin-bottom: 12px; }
            h2 { font-size: 18px; margin-top:20px; margin-bottom: 10px; }
            h3 { font-size: 16px; margin-top:18px; margin-bottom: 8px; }
            p, li {font-size: 12px; line-height: 1.6;}
            ul, ol { padding-left: 20px; margin-bottom: 10px;}
            img { max-width: 100%; }
            /* Add more specific styles from your globals.css if needed */
          </style>
        </head>
        <body>${htmlBody}</body>
        </html>
      `;
      
      const page = await browser.newPage();
      await page.setViewport({ width: 816, height: 1056 }); // 8.5x11 inches at 96 DPI
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      await page.screenshot({ 
          path: pngPath, 
          omitBackground: false, // Keep background for non-transparent PNGs
          type: 'png',
          clip: { x: 0, y: 0, width: 816, height: 1056 } // Clip to the page dimensions
      });
      await page.close();
    }
  }
  await browser.close();
  console.log('All previews checked/generated.');
}

generate().catch(err => {
  console.error('Error generating previews:', err);
  process.exit(1);
});
