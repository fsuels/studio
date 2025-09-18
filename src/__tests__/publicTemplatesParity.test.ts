import fs from 'fs';
import path from 'path';

const PUBLIC_TEMPLATES_ROOT = path.join(__dirname, '..', '..', 'public', 'templates');
const EN_DIR = path.join(PUBLIC_TEMPLATES_ROOT, 'en');
const ES_DIR = path.join(PUBLIC_TEMPLATES_ROOT, 'es');

function getMarkdownFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((filename) => filename.endsWith('.md'))
    .sort();
}

describe('Public templates parity', () => {
  const enTemplates = getMarkdownFiles(EN_DIR);
  const esTemplates = getMarkdownFiles(ES_DIR);

  test('Spanish public templates mirror English inventory', () => {
    expect(esTemplates).toEqual(enTemplates);
  });

  test.each(enTemplates)(`non-empty content for %s`, (filename) => {
    const enPath = path.join(EN_DIR, filename);
    const esPath = path.join(ES_DIR, filename);

    expect(fs.existsSync(esPath)).toBe(true);

    const enContent = fs.readFileSync(enPath, 'utf8').trim();
    const esContent = fs.readFileSync(esPath, 'utf8').trim();

    expect(enContent.length).toBeGreaterThan(0);
    expect(esContent.length).toBeGreaterThan(0);
  });
});
