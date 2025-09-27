import { getMarkdown } from "@/lib/markdown-cache";
import { loadWorkflowDocument } from "@/lib/workflow/document-workflow";
import { resolveDocSlug } from "@/lib/slug-alias";
import DocPreviewClient from "./DocPreviewClient";

export const dynamic = "force-static";
export const revalidate = 1800;

type Params = { locale: string; docId: string };

export default async function PreviewPage({ params }: { params: Promise<Params> }) {
  const { locale, docId } = await params;

  const canonical = resolveDocSlug(docId);
  const document = await loadWorkflowDocument(canonical);
  const markdownContent = await getMarkdown(locale as "en" | "es", canonical);

  const docMeta = document
    ? {
        id: document.id,
        translations: document.translations,
        name: document.name,
        description: document.description,
      }
    : null;

  if (!docMeta) {
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-white px-6 text-center">
        <div className="space-y-3">
          <h1 className="text-xl font-semibold text-slate-900">Preview unavailable</h1>
          <p className="text-sm text-slate-600">
            We couldn&apos;t load this document preview. Please go back and try again.
          </p>
        </div>
      </main>
    );
  }

  const displayName =
    (locale === "es" && (docMeta.translations?.es?.name || docMeta.name)) ||
    docMeta.translations?.en?.name ||
    docMeta.name;

  return (
    <DocPreviewClient
      docId={docMeta.id}
      locale={locale as "en" | "es"}
      markdownContent={markdownContent}
      documentDisplayName={displayName}
      displayName={displayName}
    />
  );
}
