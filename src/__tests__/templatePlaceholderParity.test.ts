import fs from 'fs';
import path from 'path';

const TEMPLATES_ROOT = path.join(__dirname, '..', 'data', 'templates');
const EN_DIR = path.join(TEMPLATES_ROOT, 'en');
const ES_DIR = path.join(TEMPLATES_ROOT, 'es');

function extractPlaceholders(filePath: string): Set<string> {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(/\{\{[^}]+\}\}/g) ?? [];
  return new Set(matches);
}

function getTemplateFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((filename) => filename.endsWith('.md'))
    .sort();
}

describe('Source template parity', () => {
  const enTemplates = getTemplateFiles(EN_DIR);
  const esTemplates = getTemplateFiles(ES_DIR);

  test('Spanish source templates keep pace with English inventory', () => {
    expect(esTemplates).toEqual(enTemplates);
  });

  test.each(enTemplates)('placeholder parity for %s', (filename) => {
    const enPath = path.join(EN_DIR, filename);
    const esPath = path.join(ES_DIR, filename);

    expect(fs.existsSync(esPath)).toBe(true);

    const enPlaceholders = extractPlaceholders(enPath);
    const esPlaceholders = extractPlaceholders(esPath);

    expect(esPlaceholders).toEqual(enPlaceholders);
  });
});
