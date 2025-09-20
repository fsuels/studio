import path from 'node:path';
import { readFileSync } from 'node:fs';

describe('LegalTranslationEngine dictionary encoding', () => {
  const filePath = path.join(
    process.cwd(),
    'src',
    'lib',
    'legal-translation',
    'LegalTranslationEngine.ts',
  );
  const source = readFileSync(filePath, 'utf8');

  it('has no Unicode replacement characters', () => {
    expect(source.includes('\uFFFD')).toBe(false);
  });

  it('has no mojibake question mark sequences', () => {
    const pattern = new RegExp(
      '[A-Za-z\\u00C1\\u00C9\\u00CD\\u00D3\\u00DA\\u00D1\\u00DC\\u00E1\\u00E9\\u00ED\\u00F3\\u00FA\\u00F1\\u00FC]\\?[A-Za-z\\u00C1\\u00C9\\u00CD\\u00D3\\u00DA\\u00D1\\u00DC\\u00E1\\u00E9\\u00ED\\u00F3\\u00FA\\u00F1\\u00FC]',
      'u',
    );

    expect(pattern.test(source)).toBe(false);
  });
});
