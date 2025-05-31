import { useQuery } from '@tanstack/react-query';

interface PdfPreviewParams {
  documentType: string;
  answers: Record<string, unknown>;
  state?: string;
}

export function usePdfPreview(params: PdfPreviewParams | null) {
  return useQuery({
    queryKey: ['pdfPreview', params],
    enabled: !!params,
    queryFn: async () => {
      if (!params) return null;
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const arrayBuffer = await res.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    },
    staleTime: 1000 * 60 * 5,
  });
}
