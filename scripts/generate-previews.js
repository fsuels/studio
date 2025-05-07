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
          console.log(`⏭ ${lang}/${docId}.png is fresh`);
          continue;
        }
      }

      console.log(`🖼️  Generating ${lang}/${docId}.png`);
      
      const rawMdContent = fs.readFileSync(mdPath, 'utf-8');
      const htmlBody = mdInstance.render(rawMdContent);

      const html = `
        <html>
        <head>
          <style>
            /* Basic styling for the preview - try to match your PDF/display style */
            body { 
              font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
              padding: 32px; 
              width: 8.5in; /* Standard letter width */
              height: 11in; /* Standard letter height */
              box-sizing: border-box; 
              margin: 0; 
              background-color: white; /* Ensure background for screenshot */
            }
            .prose h1 { font-size:24px; margin-top:0; margin-bottom: 16px; }
            .prose h2 { font-size:20px; margin-bottom: 12px; }
            .prose h3 { font-size:18px; margin-bottom: 10px; }
            .prose p, .prose li { font-size: 12px; line-height: 1.6; margin-bottom: 8px; }
            .prose ul, .prose ol { padding-left: 20px; margin-bottom: 10px; }
            .prose table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11px; }
            .prose table, .prose th, .prose td { border: 1px solid #ccc; }
            .prose th, .prose td { padding: 6px 8px; text-align: left; }
            .prose th { background-color: #f0f0f0; font-weight: 600; }
            .prose strong { font-weight: 600; }
            /* Add more specific styles from your globals.css if needed */
          </style>
        </head>
        <body class="prose">${htmlBody}</body>
        </html>`;
      
      const page = await browser.newPage();
      // Set viewport to a typical high-resolution display of a letter-sized page
      // 8.5 inches * 96 DPI = 816px, 11 inches * 96 DPI = 1056px
      await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 2 }); // Use deviceScaleFactor for sharper images
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // Screenshot the entire body or a specific element if preferred
      const elementToScreenshot = await page.$('body');
      if (elementToScreenshot) {
        await elementToScreenshot.screenshot({ 
            path: pngPath, 
            omitBackground: false, // Keep background for non-transparent PNGs
            type: 'png', // Explicitly set type
            // fullPage: true might be too large for previews, clip to viewport
            clip: { x: 0, y: 0, width: 816, height: 1056 } // Clip to the page dimensions
        });
      } else {
        console.error(`Could not find body element for ${lang}/${docId}.png`);
      }
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

