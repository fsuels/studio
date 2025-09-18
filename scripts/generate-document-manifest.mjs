import { promises as fs } from 'node:fs';
import path from 'node:path';
import prettier from 'prettier';
import ts from 'typescript';

const PROJECT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DOCUMENTS_DIR = path.resolve(PROJECT_ROOT, 'src', 'lib', 'documents');
const OUTPUT_FILE = path.resolve(DOCUMENTS_DIR, 'manifest.generated.ts');
const OUTPUT_JSON_FILE = path.resolve(DOCUMENTS_DIR, 'manifest.generated.json');


function normalizeStrings(values) {
  if (!Array.isArray(values)) return [];
  return Array.from(
    new Set(
      values
        .filter((value) => typeof value === 'string')
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

function evaluateNode(node) {
  if (!node) return undefined;

  if (ts.isStringLiteralLike(node)) {
    return node.text;
  }

  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (node.kind === ts.SyntaxKind.NullKeyword) {
    return null;
  }

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((element) => evaluateNode(element)).filter((value) => value !== undefined);
  }

  if (ts.isObjectLiteralExpression(node)) {
    const result = {};

    node.properties.forEach((property) => {
      if (!ts.isPropertyAssignment(property)) return;

      const key = property.name;
      if (!key) return;

      let propertyName;
      if (ts.isIdentifier(key)) {
        propertyName = key.text;
      } else if (ts.isStringLiteralLike(key)) {
        propertyName = key.text;
      } else if (ts.isNumericLiteral(key)) {
        propertyName = key.text;
      }

      if (!propertyName) return;

      const value = evaluateNode(property.initializer);
      if (value !== undefined) {
        result[propertyName] = value;
      }
    });

    return result;
  }

  if (ts.isTemplateExpression(node) && node.templateSpans.length === 0) {
    return node.head.text;
  }

  if (ts.isParenthesizedExpression(node)) {
    return evaluateNode(node.expression);
  }

  return undefined;
}

async function parseMetadataFile(file) {
  const sourceText = await fs.readFile(file, 'utf8');
  const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true);

  let metadataObject = null;

  source.forEachChild((node) => {
    if (metadataObject) return;

    if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      node.declarationList.declarations.forEach((declaration) => {
        if (metadataObject) return;
        if (!declaration.initializer) return;

        if (declaration.type) {
          const typeText = declaration.type.getText(source);
          if (!typeText.includes('LegalDocument')) {
            return;
          }
        }

        const value = evaluateNode(declaration.initializer);
        if (value && typeof value === 'object' && value.id) {
          metadataObject = value;
        }
      });
    }
  });

  if (!metadataObject || typeof metadataObject.id !== 'string') {
    console.warn(`Unable to parse metadata for ${file}`);
    return null;
  }

  return metadataObject;
}

function ensureTranslation(doc, locale) {
  const translation = doc.translations?.[locale];
  const fallback = doc.translations?.en;

  const name =
    (translation?.name ?? '').trim() ||
    (locale === 'es' ? (doc.translations?.es?.name ?? '').trim() : '') ||
    (fallback?.name ?? '').trim() ||
    (doc.name ?? '').trim() ||
    doc.id;

  const description =
    (translation?.description ?? '').trim() ||
    (fallback?.description ?? '').trim() ||
    (doc.description ?? '').trim() ||
    '';

  const aliasSource = translation?.aliases?.length
    ? translation.aliases
    : fallback?.aliases?.length
      ? fallback.aliases
      : doc.aliases ?? [];

  return {
    name,
    description,
    aliases: normalizeStrings(aliasSource),
  };
}

function buildEntry(file, doc) {
  const moduleDir = path.dirname(file);
  const relativeImport = `./${path
    .relative(path.dirname(OUTPUT_FILE), moduleDir)
    .split(path.sep)
    .join('/')}`;

  const en = ensureTranslation(doc, 'en');
  const es = ensureTranslation(doc, 'es');

  const requiresNotary =
    doc.requiresNotary ??
    doc.requiresNotarization ??
    undefined;

  const states = Array.isArray(doc.states)
    ? doc.states
    : doc.states === 'all'
      ? ['all']
      : undefined;

  const jurisdiction = (doc.jurisdiction || 'us').toString().toLowerCase();
  const category = (doc.category ?? 'Uncategorized').toString();

  const tags = normalizeStrings([...(doc.keywords ?? []), ...(doc.keywords_es ?? [])]);
  const aliases = normalizeStrings([...en.aliases, ...es.aliases]);

  return {
    id: doc.id,
    importPath: relativeImport,
    meta: {
      id: doc.id,
      title: en.name,
      description: en.description,
      category,
      jurisdiction,
      tags,
      aliases,
      requiresNotary,
      officialForm: doc.officialForm,
      states,
      estimatedTime: doc.estimatedTime,
      complexity: doc.complexity,
      translations: {
        en,
        es,
      },
    },
  };
}

async function findMetadataFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('(') && entry.name.endsWith(')')) continue;
      files.push(...(await findMetadataFiles(path.join(dir, entry.name))));
    } else if (entry.isFile() && entry.name === 'metadata.ts') {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

async function generateManifest() {
  const files = await findMetadataFiles(DOCUMENTS_DIR);
  const manifestEntries = [];

  for (const file of files) {
    const doc = await parseMetadataFile(file);
    if (!doc) continue;
    manifestEntries.push(buildEntry(file, doc));
  }

  manifestEntries.sort((a, b) => a.id.localeCompare(b.id));

  const manifestLiteral = manifestEntries
    .map((entry) => `  ${JSON.stringify(entry, null, 2)}`)
    .join(',\n');

  const importMapLiteral = manifestEntries
    .map((entry) => `  '${entry.id}': () => import('${entry.importPath}')`)
    .join(',\n');

  const metadataMapLiteral = manifestEntries
    .map(
      (entry) =>
        `  '${entry.id}': ${JSON.stringify(entry.meta, null, 2)}`,
    )
    .join(',\n');

  const idsLiteral = manifestEntries.map((entry) => `  '${entry.id}'`).join(',\n');

  const jsonPayload = {
    entries: manifestEntries,
    metadata: Object.fromEntries(
      manifestEntries.map((entry) => [entry.id, entry.meta]),
    ),
    ids: manifestEntries.map((entry) => entry.id),
    generatedAt: new Date().toISOString(),
  };

  const fileContents = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.\n// Run: node scripts/generate-document-manifest.mjs\n\nexport interface GeneratedMetadata {\n  id: string;\n  title: string;\n  description: string;\n  category: string;\n  jurisdiction: string;\n  tags: string[];\n  aliases: string[];\n  requiresNotary?: boolean;\n  officialForm?: boolean;\n  states?: string[];\n  estimatedTime?: string;\n  complexity?: 'simple' | 'intermediate' | 'complex';\n  translations: {\n    en: { name: string; description: string; aliases: string[] };\n    es: { name: string; description: string; aliases: string[] };\n  };\n}\n\nexport interface DocumentManifestEntry {\n  id: string;\n  importPath: string;\n  meta: GeneratedMetadata;\n}\n\nexport const DOCUMENT_MANIFEST: DocumentManifestEntry[] = [\n${manifestLiteral}\n];\n\nexport const DOCUMENT_IMPORTS: Record<string, () => Promise<any>> = {\n${importMapLiteral}\n};\n\nexport const DOCUMENT_METADATA: Record<string, GeneratedMetadata> = {\n${metadataMapLiteral}\n};\n\nexport const DOCUMENT_IDS: string[] = [\n${idsLiteral}\n];\n`;

  const prettierConfig = await prettier.resolveConfig(PROJECT_ROOT).catch(() => undefined);
  const formatted = await prettier.format(fileContents, {
    ...(prettierConfig ?? {}),
    parser: 'typescript',
  });

  await fs.writeFile(OUTPUT_FILE, formatted);
  await fs.writeFile(OUTPUT_JSON_FILE, JSON.stringify(jsonPayload, null, 2));
  console.log(`Generated manifest with ${manifestEntries.length} documents.`);
}

generateManifest().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
