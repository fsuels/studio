// Unified PDF Service Layer - Dynamic imports for optimal bundle splitting
// Consolidates all PDF operations using pdf-lib with lazy loading

import type { PDFDocument, PDFPage, PDFForm, PDFField } from 'pdf-lib';
import {
  logDocumentGenerationError,
  logDocumentGenerationStart,
  logDocumentGenerationSuccess,
} from '../logging/document-generation-logger';

export interface PDFServiceConfig {
  enableFontEmbedding?: boolean;
  compressionLevel?: 'none' | 'low' | 'medium' | 'high';
  preserveFormFields?: boolean;
}

export interface PDFProcessingResult {
  document: PDFDocument;
  pages: PDFPage[];
  form?: PDFForm;
  fields?: PDFField[];
  size: number;
}

// Lazy-loaded PDF-lib modules
let pdfLibPromise: Promise<typeof import('pdf-lib')> | null = null;
let fontkitPromise: Promise<typeof import('@pdf-lib/fontkit')> | null = null;

/**
 * Dynamic PDF-lib loader with caching
 */
async function loadPDFLib() {
  if (!pdfLibPromise) {
    pdfLibPromise = import('pdf-lib');
  }
  return pdfLibPromise;
}

/**
 * Dynamic fontkit loader for font embedding
 */
async function loadFontkit() {
  if (!fontkitPromise) {
    fontkitPromise = import('@pdf-lib/fontkit');
  }
  return fontkitPromise;
}

/**
 * High-level PDF Service Class
 */
export class PDFService {
  private static instance: PDFService;
  private pdfLib: typeof import('pdf-lib') | null = null;
  private fontkit: typeof import('@pdf-lib/fontkit') | null = null;

  static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  /**
   * Initialize PDF service with required modules
   */
  async initialize(config: PDFServiceConfig = {}): Promise<void> {
    if (!this.pdfLib) {
      this.pdfLib = await loadPDFLib();
    }

    if (config.enableFontEmbedding && !this.fontkit) {
      this.fontkit = await loadFontkit();
    }
  }

  /**
   * Create a new PDF document
   */
  async createDocument(config?: PDFServiceConfig): Promise<PDFDocument> {
    const context = {
      enableFontEmbedding: Boolean(config?.enableFontEmbedding),
      compressionLevel: config?.compressionLevel,
      preserveFormFields: Boolean(config?.preserveFormFields),
    };
    const start = logDocumentGenerationStart('pdf.createDocument', context);

    try {
      await this.initialize(config);
      const doc = await this.pdfLib!.PDFDocument.create();

      if (config?.enableFontEmbedding && this.fontkit) {
        doc.registerFontkit(this.fontkit.default);
      }

      logDocumentGenerationSuccess('pdf.createDocument', start, context, {
        pageCount: doc.getPages().length,
      });

      return doc;
    } catch (error) {
      logDocumentGenerationError('pdf.createDocument', start, context, error);
      throw error;
    }
  }

  /**
   * Load PDF from bytes with form detection
   */
  async loadDocument(
    pdfBytes: Uint8Array | ArrayBuffer,
    config?: PDFServiceConfig
  ): Promise<PDFProcessingResult> {
    const context = {
      sourceType:
        pdfBytes instanceof Uint8Array
          ? 'uint8array'
          : pdfBytes instanceof ArrayBuffer
            ? 'arraybuffer'
            : typeof pdfBytes,
      enableFontEmbedding: Boolean(config?.enableFontEmbedding),
      preserveFormFields: Boolean(config?.preserveFormFields),
      compressionLevel: config?.compressionLevel,
    };
    const start = logDocumentGenerationStart('pdf.loadDocument', context);

    try {
      await this.initialize(config);

      const document = await this.pdfLib!.PDFDocument.load(pdfBytes);
      const pages = document.getPages();

      // Try to get form if it exists
      let form: PDFForm | undefined;
      let fields: PDFField[] = [];

      try {
        form = document.getForm();
        fields = form.getFields();
      } catch {
        // No form found, that's okay
      }

      if (config?.enableFontEmbedding && this.fontkit) {
        document.registerFontkit(this.fontkit.default);
      }

      // Save once to compute output size without shadowing input param
      const outputBytes = await document.save();

      logDocumentGenerationSuccess('pdf.loadDocument', start, context, {
        pageCount: pages.length,
        hasForm: Boolean(form),
        fieldCount: fields.length,
        sizeBytes: outputBytes.length,
      });

      return {
        document,
        pages,
        form,
        fields,
        size: outputBytes.length,
      };
    } catch (error) {
      logDocumentGenerationError('pdf.loadDocument', start, context, error);
      throw error;
    }
  }

  /**
   * Fill PDF form fields with data
   */
  async fillForm(
    pdfBytes: Uint8Array | ArrayBuffer,
    formData: Record<string, string | number | boolean>,
    config?: PDFServiceConfig
  ): Promise<Uint8Array> {
    const context = {
      requestedFieldCount: Object.keys(formData).length,
      preserveFormFields: Boolean(config?.preserveFormFields),
    };
    const start = logDocumentGenerationStart('pdf.fillForm', context);

    try {
      const result = await this.loadDocument(pdfBytes, config);

      if (!result.form) {
        throw new Error('PDF does not contain a fillable form');
      }

      const { form, document } = result;

      // Fill form fields
      Object.entries(formData).forEach(([fieldName, value]) => {
        try {
          const field = form.getField(fieldName);

          if (field.constructor.name === 'PDFTextField') {
            (field as any).setText(String(value));
          } else if (field.constructor.name === 'PDFCheckBox') {
            if (value) (field as any).check();
            else (field as any).uncheck();
          } else if (field.constructor.name === 'PDFRadioGroup') {
            (field as any).select(String(value));
          } else if (field.constructor.name === 'PDFDropdown') {
            (field as any).select(String(value));
          }
        } catch (error) {
          console.warn(`Failed to fill field "${fieldName}":`, error);
        }
      });

      // Flatten form if not preserving fields
      if (!config?.preserveFormFields) {
        form.flatten();
      }

      const filledBytes = await document.save();

      logDocumentGenerationSuccess('pdf.fillForm', start, context, {
        appliedFieldCount: Object.keys(formData).length,
        flattened: !config?.preserveFormFields,
        sizeBytes: filledBytes.length,
      });

      return filledBytes;
    } catch (error) {
      logDocumentGenerationError('pdf.fillForm', start, context, error);
      throw error;
    }
  }

  /**
   * Merge multiple PDFs
   */
  async mergePDFs(pdfBytesArray: (Uint8Array | ArrayBuffer)[]): Promise<Uint8Array> {
    const context = {
      documentCount: pdfBytesArray.length,
    };
    const start = logDocumentGenerationStart('pdf.merge', context);

    try {
      await this.initialize();

      const mergedDoc = await this.pdfLib!.PDFDocument.create();

      for (const pdfBytes of pdfBytesArray) {
        const doc = await this.pdfLib!.PDFDocument.load(pdfBytes);
        const pages = await mergedDoc.copyPages(doc, doc.getPageIndices());
        pages.forEach(page => mergedDoc.addPage(page));
      }

      const mergedBytes = await mergedDoc.save();

      logDocumentGenerationSuccess('pdf.merge', start, context, {
        sizeBytes: mergedBytes.length,
        resultingPageCount: mergedDoc.getPages().length,
      });

      return mergedBytes;
    } catch (error) {
      logDocumentGenerationError('pdf.merge', start, context, error);
      throw error;
    }
  }

  /**
   * Extract form field information
   */
  async extractFormFields(pdfBytes: Uint8Array | ArrayBuffer): Promise<Array<{
    name: string;
    type: string;
    value?: any;
    options?: string[];
  }>> {
    const context = {
      operation: 'extract',
    };
    const start = logDocumentGenerationStart('pdf.extractFormFields', context);

    try {
      const result = await this.loadDocument(pdfBytes);

      if (!result.form || !result.fields) {
        logDocumentGenerationSuccess('pdf.extractFormFields', start, context, {
          fieldCount: 0,
          hasForm: false,
        });
        return [];
      }

      const fieldsInfo = result.fields.map(field => {
        const fieldInfo: any = {
          name: field.getName(),
          type: field.constructor.name,
        };

        try {
          // Get current value
          if (field.constructor.name === 'PDFTextField') {
            fieldInfo.value = (field as any).getText();
          } else if (field.constructor.name === 'PDFCheckBox') {
            fieldInfo.value = (field as any).isChecked();
          } else if (field.constructor.name === 'PDFRadioGroup') {
            fieldInfo.value = (field as any).getSelected();
            fieldInfo.options = (field as any).getOptions();
          } else if (field.constructor.name === 'PDFDropdown') {
            fieldInfo.value = (field as any).getSelected();
            fieldInfo.options = (field as any).getOptions();
          }
        } catch (error) {
          console.warn(`Failed to read field "${field.getName()}":`, error);
        }

        return fieldInfo;
      });

      logDocumentGenerationSuccess('pdf.extractFormFields', start, context, {
        fieldCount: fieldsInfo.length,
        hasForm: Boolean(result.form),
      });

      return fieldsInfo;
    } catch (error) {
      logDocumentGenerationError('pdf.extractFormFields', start, context, error);
      throw error;
    }
  }

  /**
   * Add text overlay to PDF (for non-form PDFs)
   */
  async addTextOverlay(
    pdfBytes: Uint8Array | ArrayBuffer,
    overlays: Array<{
      text: string;
      x: number;
      y: number;
      page?: number;
      fontSize?: number;
      color?: string;
    }>
  ): Promise<Uint8Array> {
    const context = {
      overlayCount: overlays.length,
    };
    const start = logDocumentGenerationStart('pdf.addTextOverlay', context);

    try {
      const result = await this.loadDocument(pdfBytes, { enableFontEmbedding: true });
      const { document, pages } = result;

      for (const overlay of overlays) {
        const pageIndex = overlay.page || 0;
        const page = pages[pageIndex];

        if (!page) continue;

        page.drawText(overlay.text, {
          x: overlay.x,
          y: overlay.y,
          size: overlay.fontSize || 12,
          color: this.pdfLib!.rgb(0, 0, 0), // Default to black
        });
      }

      const overlaidBytes = await document.save();

      logDocumentGenerationSuccess('pdf.addTextOverlay', start, context, {
        sizeBytes: overlaidBytes.length,
      });

      return overlaidBytes;
    } catch (error) {
      logDocumentGenerationError('pdf.addTextOverlay', start, context, error);
      throw error;
    }
  }

  /**
   * Optimize PDF for web delivery
   */
  async optimizePDF(
    pdfBytes: Uint8Array | ArrayBuffer,
    options: {
      compress?: boolean;
      removeMetadata?: boolean;
      flattenForms?: boolean;
    } = {}
  ): Promise<Uint8Array> {
    const context = {
      compress: options.compress !== false,
      removeMetadata: Boolean(options.removeMetadata),
      flattenForms: Boolean(options.flattenForms),
    };
    const start = logDocumentGenerationStart('pdf.optimize', context);

    try {
      const result = await this.loadDocument(pdfBytes);
      const { document } = result;

      if (options.flattenForms && result.form) {
        result.form.flatten();
      }

      // Save with optimization
      const optimizedBytes = await document.save({
        useObjectStreams: options.compress !== false,
        addDefaultPage: false,
      });

      logDocumentGenerationSuccess('pdf.optimize', start, context, {
        sizeBytes: optimizedBytes.length,
        initialFieldCount: result.fields?.length,
      });

      return optimizedBytes;
    } catch (error) {
      logDocumentGenerationError('pdf.optimize', start, context, error);
      throw error;
    }
  }
}

// Convenience functions for common operations
export const pdfService = PDFService.getInstance();

/**
 * Quick PDF form filler
 */
export async function fillPDFForm(
  pdfBytes: Uint8Array | ArrayBuffer,
  formData: Record<string, any>
): Promise<Uint8Array> {
  return pdfService.fillForm(pdfBytes, formData, { preserveFormFields: false });
}

/**
 * Quick PDF form field extractor
 */
export async function extractPDFFields(pdfBytes: Uint8Array | ArrayBuffer) {
  return pdfService.extractFormFields(pdfBytes);
}

/**
 * Quick PDF text overlay
 */
export async function addPDFTextOverlay(
  pdfBytes: Uint8Array | ArrayBuffer,
  overlays: Array<{ text: string; x: number; y: number; page?: number }>
): Promise<Uint8Array> {
  return pdfService.addTextOverlay(pdfBytes, overlays);
}

/**
 * Quick PDF optimization
 */
export async function optimizePDF(pdfBytes: Uint8Array | ArrayBuffer): Promise<Uint8Array> {
  return pdfService.optimizePDF(pdfBytes, {
    compress: true,
    removeMetadata: true,
    flattenForms: false,
  });
}

export default pdfService;
