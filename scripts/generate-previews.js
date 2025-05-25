// scripts/generate-previews.js
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import MarkdownIt from 'markdown-it';
import Handlebars from 'handlebars';

const templatesDir = path.join(process.cwd(), 'templates');
const outDir       = path.join(process.cwd(), 'public', 'images', 'previews');
const languages    = ['en','es'];

async function generate() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  // Register handlebars helpers
  Handlebars.registerHelper('if', Handlebars.helpers.if);
  Handlebars.registerHelper('unless', Handlebars.helpers.unless);
  Handlebars.registerHelper('each', Handlebars.helpers.each);
  Handlebars.registerHelper('ifState', function(expected, options) {
    const current = String(this.state || '').toLowerCase();
    return current === String(expected).toLowerCase() ? options.fn(this) : options.inverse(this);
  });

  for (const lang of languages) {
    const mdLangDir  = path.join(templatesDir, lang); // Path to language-specific markdown templates
    const pngLangDir = path.join(outDir, lang);      // Path to language-specific preview images
    fs.mkdirSync(pngLangDir, { recursive: true });

    if (!fs.existsSync(mdLangDir)) {
        console.warn(`Markdown directory not found for language ${lang}: ${mdLangDir}`);
        continue;
    }

    for (const file of fs.readdirSync(mdLangDir).filter(f => f.endsWith('.md'))) {
      const id      = file.replace(/\.md$/, '');
      const mdPath  = path.join(mdLangDir, file); // Corrected mdPath
      const pngPath = path.join(pngLangDir, `${id}.png`);

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
      const template = Handlebars.compile(raw);
      const compiled = template({ locale: lang });
      const mdParser = new MarkdownIt();
      const htmlBody = mdParser.render(compiled);
      const page  = await browser.newPage();
      
      await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 2 }); 

      await page.setContent(`
        <html><head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
              padding: 32px; 
              width: 8.5in; 
              height: 11in; 
              box-sizing: border-box; 
              margin: 0;
              background-color: white; 
            }
            .prose h1 { font-size:24px; margin-top:0; margin-bottom: 16px; font-weight: 600;}
            .prose h2 { font-size:20px; margin-bottom: 12px; font-weight: 600;}
            .prose h3 { font-size:18px; margin-bottom: 10px; font-weight: 600;}
            .prose p, .prose li { font-size: 12px; line-height: 1.6; margin-bottom: 8px; }
            .prose ul, .prose ol { padding-left: 20px; margin-bottom: 10px; }
            .prose table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11px; }
            .prose table, .prose th, .prose td { border: 1px solid #ccc; }
            .prose th, .prose td { padding: 6px 8px; text-align: left; }
            .prose th { background-color: #f0f0f0; font-weight: 600; }
            .prose strong { font-weight: 600; }
            .prose hr { border-top: 1px solid #e5e7eb; margin: 16px 0; }
          </style>
        </head><body class="prose">${htmlBody}</body></html>
      `, { waitUntil: 'networkidle0' });
      
      const elementToScreenshot = await page.$('body');
      if (elementToScreenshot) {
          await elementToScreenshot.screenshot({ 
              path: pngPath, 
              omitBackground: false,
              type: 'png',
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
