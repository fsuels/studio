import { describe, expect, it } from '@jest/globals';
import { loadDocument } from '@/lib/dynamic-document-loader';
import {
  getAllDocumentMetadata,
  getDocumentMetadata,
  getManifestEntries,
} from '@/lib/document-metadata-registry';

const MANIFEST_ENTRIES = getManifestEntries();

describe('Document manifest integrity', () => {
  it('exposes a non-empty manifest aligned with metadata registry', () => {
    expect(MANIFEST_ENTRIES.length).toBeGreaterThan(50);

    const metadataById = new Map(
      getAllDocumentMetadata().map((meta) => [meta.id, meta]),
    );

    MANIFEST_ENTRIES.forEach((entry) => {
      expect(entry.id).toBe(entry.meta.id);
      const registryMeta = metadataById.get(entry.id);
      expect(registryMeta).toBeDefined();
      expect(registryMeta?.translations.en.name).toBeTruthy();
    });
  });

  it('dynamically loads representative documents from the manifest', async () => {
    const sampleEntries = MANIFEST_ENTRIES.slice(0, Math.min(5, MANIFEST_ENTRIES.length));

    await Promise.all(
      sampleEntries.map(async (entry) => {
        const result = await loadDocument(entry.id);
        expect(result.document).not.toBeNull();
        expect(result.document?.id).toBe(entry.id);

        const metadata = getDocumentMetadata(entry.id);
        expect(metadata?.category).toBe(entry.meta.category);
      }),
    );
  });
});
