// scripts/generate-previews.js
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import MarkdownIt from 'markdown-it';

const templatesDir = path.join(process.cwd(), 'public', 'templates');
const outDir       = path.join(process.cwd(), 'public', 'images', 'previews');
const languages    = ['en','es'];

async function generate() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }); // Added sandbox args
  const mdInstance = new MarkdownIt(); // Create instance of MarkdownIt

  for (const lang of languages) {
    const mdDir  = path.join(templatesDir, lang);
    const pngDir = path.join(outDir, lang);
    fs.mkdirSync(pngDir, { recursive: true });

    if (!fs.existsSync(mdDir)) {
        console.warn(`Markdown directory not found for language ${lang}: ${mdDir}`);
        continue;
    }

    for (const file of fs.readdirSync(mdDir).filter(f => f.endsWith('.md'))) {
      const id      = file.replace(/\.md$/, '');
      const mdPath  = path.join(mdDir, file);
      const pngPath = path.join(pngDir, `${id}.png`);

      // **FRESHNESS CHECK**
      if (fs.existsSync(pngPath)) {
        const mdTime  = fs.statSync(mdPath).mtimeMs;
        const pngTime = fs.statSync(pngPath).mtimeMs;
        if (pngTime >= mdTime) {
          console.log(`⏭ up-to-date: ${lang}/${id}.png`);
          continue;
        }
      }

      console.log(`🔄 Generating preview for ${lang}/${id}`);
      const raw   = fs.readFileSync(mdPath, 'utf-8');
      const htmlBody = mdInstance.render(raw); // Use the instance
      const page  = await browser.newPage();
      
      // Set viewport to a typical high-resolution display of a letter-sized page
      // 8.5 inches * 96 DPI = 816px, 11 inches * 96 DPI = 1056px
      // Using a slightly larger width for better capture of full-width elements like tables.
      await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 2 }); 

      await page.setContent(`
        <html><head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
              padding: 32px; 
              width: 8.5in; /* Standard letter width */
              height: 11in; /* Standard letter height */
              box-sizing: border-box; 
              margin: 0;
              background-color: white; /* Ensure background for screenshot */
            }
            .prose h1 { font-size:24px; margin-top:0; margin-bottom: 16px; font-weight: 600;}
            .prose h2 { font-size:20px; margin-bottom: 12px; font-weight: 600;}
            .prose h3 { font-size:18px; margin-bottom: 10px; font-weight: 600;}
            .prose p, .prose li { font-size: 12px; line-height: 1.6; margin-bottom: 8px; }
            .prose ul, .prose ol { padding-left: 20px; margin-bottom: 10px; }
            .prose table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11px; }
            .prose table, .prose th, .prose td { border: 1px solid #ccc; } /* Light grey border */
            .prose th, .prose td { padding: 6px 8px; text-align: left; }
            .prose th { background-color: #f0f0f0; font-weight: 600; } /* Light grey header */
            .prose strong { font-weight: 600; }
            .prose hr { border-top: 1px solid #e5e7eb; margin: 16px 0; }
            /* Add more specific styles from your globals.css if needed */
          </style>
        </head><body class="prose">${htmlBody}</body></html>
      `, { waitUntil: 'networkidle0' });
      
      // Screenshot the entire body or a specific element if preferred
      const elementToScreenshot = await page.$('body');
      if (elementToScreenshot) {
          await elementToScreenshot.screenshot({ 
              path: pngPath, 
              omitBackground: false, // Keep background for non-transparent PNGs
              type: 'png', // Explicitly set type
              // Clip to the page dimensions to ensure consistent preview size
              clip: { x: 0, y: 0, width: 816, height: 1056 } 
          });
      } else {
          console.error(`Could not find body element for ${lang}/${id}.png`);
      }
      await page.close();
    }
  }
  await browser.close();
  console.log('All previews checked/generated.');
}

generate().catch(err => { console.error('Error generating previews:', err); process.exit(1); });
