import fs from 'node:fs';
import path from 'node:path';

export interface GeneratedMetadata {
  id: string;
  title: string;
  description: string;
  category: string;
  jurisdiction: string;
  tags: string[];
  aliases: string[];
  requiresNotary?: boolean;
  officialForm?: boolean;
  states?: string[];
  estimatedTime?: string;
  complexity?: 'simple' | 'intermediate' | 'complex';
  translations: {
    en: { name: string; description: string; aliases: string[] };
    es: { name: string; description: string; aliases: string[] };
  };
}

export interface DocumentManifestEntry {
  id: string;
  importPath: string;
  meta: GeneratedMetadata;
}

interface ManifestJsonPayload {
  entries: DocumentManifestEntry[];
  metadata: Record<string, GeneratedMetadata>;
  ids: string[];
  generatedAt?: string;
}

let manifestCache: ManifestJsonPayload | null = null;

function loadManifest(): ManifestJsonPayload {
  if (manifestCache) {
    return manifestCache;
  }

  const manifestPath = path.resolve(
    __dirname,
    '..',
    '..',
    'src',
    'lib',
    'documents',
    'manifest.generated.json',
  );

  const raw = fs.readFileSync(manifestPath, 'utf8');
  manifestCache = JSON.parse(raw) as ManifestJsonPayload;
  return manifestCache;
}

export function getDocumentManifest(): DocumentManifestEntry[] {
  return loadManifest().entries;
}

export function getDocumentMetadata(id: string): GeneratedMetadata | null {
  const manifest = loadManifest();
  return manifest.metadata[id] ?? null;
}

export function getDocumentIds(): string[] {
  return loadManifest().ids;
}
