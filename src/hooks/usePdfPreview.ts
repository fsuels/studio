import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
      const res = await axios.post('/api/generate-pdf', params, { responseType: 'arraybuffer' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    },
    staleTime: 1000 * 60 * 5,
  });
}
