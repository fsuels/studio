#!/usr/bin/env ts-node
/**
 * new-document.ts
 * -------------------------------------------------------------
 * Scaffolds a “smart” legal document in the normalised structure.
 *
 * Usage:
 *   pnpm ts-node scripts/new-document.ts \
 *     --docId eviction-notice \
 *     --country us \
 *     --languages en,es \
 *     --source ./drafts/eviction-notice.raw.txt
 *
 * Flags
 *  --docId       kebab-case identifier (e.g., power-of-attorney)
 *  --country     ISO-3166-1 alpha-2 (e.g., us, ca)
 *  --languages   comma-separated ISO-639-1 codes (default: en)
 *  --source      optional path to raw TXT with [[placeholders]]
 *  --force       overwrite existing files
 * -------------------------------------------------------------
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

type Flags = {
  docId: string;
  country: string;
  languages: string[];
  source?: string;
  force?: boolean;
};

function parseFlags(): Flags {
  const argv = process.argv.slice(2);
  function get(flag: string) {
    const idx = argv.indexOf(`--${flag}`);
    if (idx === -1) return undefined;
    return argv[idx + 1];
  }
  const docId = get("docId");
  const country = get("country");
  const langs = get("languages") ?? "en";
  if (!docId || !country) {
    console.error("✖  --docId and --country are required");
    process.exit(1);
  }
  return {
    docId,
    country: country.toLowerCase(),
    languages: langs.split(",").map((l) => l.trim().toLowerCase()),
    source: get("source"),
    force: argv.includes("--force"),
  };
}

function toWords(id: string) {
  return id
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

async function writeFile(p: string, content: string, force = false) {
  try {
    if (!force) await fs.access(p);
    if (!force)
      throw new Error(`File exists: ${p} (use --force to overwrite)`);
  } catch {
    await fs.writeFile(p, content);
    console.log("✔︎", path.relative(process.cwd(), p));
  }
}

async function generate() {
  const f = parseFlags();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  // 1. Prepare paths
  const docRoot = path.resolve(
    __dirname,
    "..",
    "src",
    "lib",
    "documents",
    f.country,
    f.docId
  );
  const templateRoot = path.resolve(__dirname, "..", "templates");
  const testsRoot = path.resolve(__dirname, "..", "tests", "render");

  // 2. Read raw source (optional)
  let raw = "";
  if (f.source) {
    raw = await fs.readFile(f.source, "utf8");
  }

  // Detect placeholders [[field]]
  const placeholderRegex = /\[\[([a-zA-Z0-9_]+?)]]/g;
  const fields = new Set<string>();
  let match;
  while ((match = placeholderRegex.exec(raw))) fields.add(match[1]);

  // 3. Create directories
  await Promise.all([
    ensureDir(docRoot),
    ...f.languages.map((lang) =>
      ensureDir(path.join(templateRoot, lang, f.country))
    ),
    ensureDir(testsRoot),
  ]);

  // 4. schema.ts
  const schemaFields = [...fields].length
    ? [...fields]
        .map(
          (k) =>
            `  ${k}: z.string().min(1),${
              k.toLowerCase().includes("date") ? " // consider z.date()" : ""
            }`
        )
        .join("\n")
    : `  // TODO: add fields`;

  const schemaTs = `import { z } from "zod";
import { getCompliance } from "../../compliance";

export async function buildSchema(state: string) {
  const rule = await getCompliance("${f.country}", state, "${f.docId}");
  return z.object({
${schemaFields}
  });
}
`;
  await writeFile(path.join(docRoot, "schema.ts"), schemaTs, f.force);

  // 5. questions.ts
  const questionsTs = `import type { WizardQuestion } from "../../document-library/types";

export const questions: WizardQuestion[] = [
${[...fields]
  .map(
    (k) => `  {
    id: "${k}",
    label: "${toWords(k)}",
    type: "text",
  },`
  )
  .join("\n")}
];
`;
  await writeFile(path.join(docRoot, "questions.ts"), questionsTs, f.force);

  // 6. metadata.ts
  const metadataTs = `export const metadata = {
  id: "${f.docId}",
  title: "${toWords(f.docId)}",
  description: "TODO: description",
  categories: [],
  languages: [${f.languages.map((l) => `"${l}"`).join(", ")}],
  country: "${f.country}",
};
`;
  await writeFile(path.join(docRoot, "metadata.ts"), metadataTs, f.force);

  // 7. index.ts
  const indexTs = `export * from "./schema";
export * from "./questions";
export * from "./metadata";
`;
  await writeFile(path.join(docRoot, "index.ts"), indexTs, f.force);

  // 8. templates
  for (const lang of f.languages) {
    const tplPath = path.join(
      templateRoot,
      lang,
      f.country,
      `${f.docId}.md`
    );
    const body =
      raw
        ? raw.replace(placeholderRegex, (_m, p1) => `{{${p1}}}`)
        : `# ${toWords(f.docId)}

<!-- Replace with content. Use {{placeholders}} and Handlebars logic. -->
`;
    await writeFile(tplPath, body, f.force);
  }

  // 9. test scaffold
  const testTs = `import { registry } from "../../src/lib/document-library";
import { renderTemplate } from "../../src/lib/render"; // adjust if helper differs

test("renders ${f.docId} template without errors", async () => {
  const doc = registry["${f.country}"]["${f.docId}"];
  const html = await renderTemplate(doc, { locale: "${f.languages[0]}", state: "CA" }, {});
  expect(html).toContain(doc.metadata.title);
});
`;
  await writeFile(
    path.join(testsRoot, `${f.docId}.test.ts`),
    testTs,
    f.force
  );

  console.log("\n🎉 Done.  Review TODOs ➜ git add & commit.");
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});

