export type AnalyzerLocale = 'en' | 'es';

export interface DocumentEntities {
  parties: Array<{ id?: string } | string>;
  amounts: Array<{ value?: number } | string>;
  dates: Array<{ iso?: string } | string>;
}

export interface DocumentMetadata {
  wordCount: number;
  tags: string[];
  [key: string]: unknown;
}

export interface DocumentAnalysis {
  metadata: DocumentMetadata;
  entities: DocumentEntities;
  [key: string]: unknown;
}

export interface ProcessDocumentBatchResult {
  successful: string[];
  failed: Array<{ docId: string; error: string }>;
}

export interface DocumentAnalyzer {
  getAllDocumentIds(locale: AnalyzerLocale): Promise<string[]>;
  processDocumentBatch(
    docIds: string[],
    locale: AnalyzerLocale,
    batchSize: number,
  ): Promise<ProcessDocumentBatchResult>;
  needsReprocessing(docId: string, locale: AnalyzerLocale): Promise<boolean>;
  analyzeDocument(docId: string, locale: AnalyzerLocale): Promise<DocumentAnalysis>;
  indexDocumentAnalysis(analysis: DocumentAnalysis): Promise<void>;
}

export const documentAnalyzer: DocumentAnalyzer;
