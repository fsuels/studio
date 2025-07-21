import React from 'react';

interface PDFPreviewProps {
  templateId?: string;
  answers?: Record<string, unknown>;
  upsells?: {
    includeNotarization: boolean;
    includeRecording: boolean;
    clauses: string[];
  };
  url?: string;
  className?: string;
}

export const PDFPreview: React.FC<PDFPreviewProps> = (props) => {
  // TODO: hook into your PDF-generation service (pdf-lib / Firebase function)
  return (
    <div
      className={`${props.className} bg-white flex items-center justify-center`}
    >
      <p className="text-gray-400">PDF Preview loading…</p>
    </div>
  );
};
