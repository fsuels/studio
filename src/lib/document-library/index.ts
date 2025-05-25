import fg from 'fast-glob';
import path from 'path';
import fs from 'fs';

export interface RegistryDoc {
  id: string;
  country: string;
  languages: string[];
  schema: unknown;
  questions: unknown;
  metadata: unknown;
  templatePath: (lang: string) => string;
}

function findTemplateLangs(country: string, id: string): string[] {
  const tmplRoot = path.join(process.cwd(), 'templates');
  if (!fs.existsSync(tmplRoot)) return [];
  const langs = fs.readdirSync(tmplRoot).filter((lang) =>
    fs.existsSync(path.join(tmplRoot, lang, country, `${id}.md`))
  );
  if (langs.length === 0) {
    throw new Error(`No templates found for ${country}/${id}`);
  }
  return langs;
}

export const docs: RegistryDoc[] = fg
  .sync('src/lib/documents/*/*/index.ts')
  .map((p) => {
    const [, , country, id] = p.split(path.sep);
    // dynamic import
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(path.join(process.cwd(), p));
    return {
      id,
      country,
      languages: findTemplateLangs(country, id),
      ...mod,
      templatePath: (lang: string) => `/templates/${lang}/${country}/${id}.md`,
    } as RegistryDoc;
  });

export const getDoc = (country: string, id: string) =>
  docs.find((d) => d.country === country && d.id === id);

export const getRoute = (doc: RegistryDoc, locale = 'en') =>
  `/${locale}/docs/${doc.country}/${doc.id}`;

