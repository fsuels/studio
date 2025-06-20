// src/lib/pdf-utils/EnhancedPdfGenerator.ts
import { PDFDocument, StandardFonts, rgb, PDFPage } from 'pdf-lib';
import PDFFooterManager from './FooterManager';
import { FOOTER_NOTE, FOOTER_STYLE, FOOTER_CONFIG } from '../pdf-constants';

interface DocumentGenerationOptions {
  documentType: string;
  content: Record<string, any>;
  language?: 'en' | 'es';
  includeNotarySection?: boolean;
  customFooterText?: string;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
  };
}

interface GenerationResult {
  pdfBytes: Uint8Array;
  pageCount: number;
  compliance: {
    uplCompliant: boolean;
    issues: string[];
    recommendations: string[];
  };
  metadata: {
    footersAdded: number;
    notarySealAdjusted: boolean;
    processingTime: number;
  };
}

class EnhancedPdfGenerator {
  private footerManager?: PDFFooterManager;

  /**
   * Generate a PDF document with comprehensive footer management
   */
  async generateDocument(options: DocumentGenerationOptions): Promise<GenerationResult> {
    const startTime = Date.now();
    
    try {
      // Create PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Set document metadata
      if (options.metadata) {
        pdfDoc.setTitle(options.metadata.title || options.documentType);
        pdfDoc.setAuthor(options.metadata.author || '123LegalDoc');
        pdfDoc.setSubject(options.metadata.subject || 'Legal Document');
        pdfDoc.setCreator(options.metadata.creator || '123LegalDoc Platform');
        pdfDoc.setCreationDate(new Date());
        pdfDoc.setModificationDate(new Date());
      }

      // Embed fonts
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Initialize footer manager
      this.footerManager = new PDFFooterManager(helvetica);

      // Determine document characteristics
      const config = PDFFooterManager.getFooterConfigForDocumentType(options.documentType);
      const pages: PDFPage[] = [];

      // Create first page
      const firstPage = pdfDoc.addPage();
      pages.push(firstPage);

      // Generate document content
      const contentResult = await this.generateDocumentContent(
        pdfDoc,
        pages,
        options,
        helvetica,
        helveticaBold,
        config
      );

      // Add footers to all pages with UPL protection
      const footerLayouts = this.footerManager.addFooterToAllPages(pages, {
        notaryDocumentType: config.requiresNotarySection,
        language: options.language || 'en',
        customText: options.customFooterText
      });

      // Validate UPL compliance
      const compliance = this.footerManager.validateUPLCompliance(pages);

      // Generate final PDF
      const pdfBytes = await pdfDoc.save();
      
      const processingTime = Date.now() - startTime;

      return {
        pdfBytes,
        pageCount: pages.length,
        compliance,
        metadata: {
          footersAdded: footerLayouts.length,
          notarySealAdjusted: config.requiresNotarySection,
          processingTime
        }
      };

    } catch (error) {
      console.error('[EnhancedPdfGenerator] Generation failed:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate document content with proper pagination
   */
  private async generateDocumentContent(
    pdfDoc: PDFDocument,
    pages: PDFPage[],
    options: DocumentGenerationOptions,
    font: any,
    boldFont: any,
    config: any
  ) {
    const margin = 50;
    const lineHeight = 14;
    let currentPage = pages[0];
    let currentY = currentPage.getSize().height - margin;

    // Add document title
    const titleText = options.documentType.toUpperCase();
    currentPage.drawText(titleText, {
      x: margin,
      y: currentY,
      font: boldFont,
      size: 18,
      color: rgb(0, 0, 0)
    });
    currentY -= 30;

    // Add content sections
    for (const [key, value] of Object.entries(options.content)) {
      const sectionTitle = this.formatSectionTitle(key);
      const sectionContent = this.formatSectionContent(value);
      
      // Check if section fits on current page
      const sectionHeight = this.estimateSectionHeight(sectionTitle, sectionContent, lineHeight);
      
      if (!this.footerManager?.canFitContent(currentPage, sectionHeight)) {
        // Create new page
        const newPage = pdfDoc.addPage();
        pages.push(newPage);
        currentPage = newPage;
        currentY = currentPage.getSize().height - margin;
      }

      // Add section title
      currentPage.drawText(sectionTitle, {
        x: margin,
        y: currentY,
        font: boldFont,
        size: 12,
        color: rgb(0, 0, 0)
      });
      currentY -= lineHeight + 5;

      // Add section content
      const contentLines = this.wrapText(sectionContent, currentPage.getSize().width - 2 * margin, font, 11);
      
      for (const line of contentLines) {
        if (!this.footerManager?.canFitContent(currentPage, lineHeight)) {
          const newPage = pdfDoc.addPage();
          pages.push(newPage);
          currentPage = newPage;
          currentY = currentPage.getSize().height - margin;
        }

        currentPage.drawText(line, {
          x: margin,
          y: currentY,
          font: font,
          size: 11,
          color: rgb(0, 0, 0)
        });
        currentY -= lineHeight;
      }

      currentY -= 10; // Space between sections
    }

    // Add signature section
    if (this.needsSignatureSection(options.documentType)) {
      await this.addSignatureSection(currentPage, pages, pdfDoc, font, boldFont, currentY, margin, config);
    }

    return { pages, finalY: currentY };
  }

  /**
   * Add signature section with notary support
   */
  private async addSignatureSection(
    currentPage: PDFPage,
    pages: PDFPage[],
    pdfDoc: PDFDocument,
    font: any,
    boldFont: any,
    currentY: number,
    margin: number,
    config: any
  ) {
    const signatureHeight = config.requiresNotarySection ? 150 : 80;
    
    // Check if signature section fits
    if (!this.footerManager?.canFitContent(currentPage, signatureHeight)) {
      const newPage = pdfDoc.addPage();
      pages.push(newPage);
      currentPage = newPage;
      currentY = currentPage.getSize().height - margin;
    }

    currentY -= 30;

    // Signature line
    currentPage.drawLine({
      start: { x: margin, y: currentY },
      end: { x: margin + 250, y: currentY },
      thickness: 1,
      color: rgb(0, 0, 0)
    });

    currentPage.drawText('Signature', {
      x: margin,
      y: currentY - 15,
      font: font,
      size: 10,
      color: rgb(0.5, 0.5, 0.5)
    });

    currentPage.drawText('Date: _______________', {
      x: margin + 300,
      y: currentY,
      font: font,
      size: 10,
      color: rgb(0, 0, 0)
    });

    // Add notary section if required
    if (config.requiresNotarySection) {
      currentY -= 50;
      
      currentPage.drawText('NOTARY ACKNOWLEDGMENT', {
        x: margin,
        y: currentY,
        font: boldFont,
        size: 12,
        color: rgb(0, 0, 0)
      });

      currentY -= 25;
      
      // Notary signature line
      currentPage.drawLine({
        start: { x: margin, y: currentY },
        end: { x: margin + 200, y: currentY },
        thickness: 1,
        color: rgb(0, 0, 0)
      });

      currentPage.drawText('Notary Public Signature', {
        x: margin,
        y: currentY - 15,
        font: font,
        size: 9,
        color: rgb(0.5, 0.5, 0.5)
      });

      // Notary seal - positioned to avoid footer clash
      const defaultSealPosition = { x: margin + 300, y: currentY - 10 };
      const adjustedSealPosition = this.footerManager?.calculateNotarySealPosition(
        currentPage,
        defaultSealPosition.x,
        defaultSealPosition.y
      ) || defaultSealPosition;

      currentPage.drawRectangle({
        x: adjustedSealPosition.x,
        y: adjustedSealPosition.y,
        width: 100,
        height: 50,
        borderColor: rgb(0.6, 0.6, 0.6),
        borderWidth: 1
      });

      currentPage.drawText('NOTARY SEAL', {
        x: adjustedSealPosition.x + 20,
        y: adjustedSealPosition.y + 20,
        font: font,
        size: 8,
        color: rgb(0.5, 0.5, 0.5)
      });

      // Commission expiry
      currentPage.drawText('My Commission Expires: _______________', {
        x: margin,
        y: currentY - 40,
        font: font,
        size: 9,
        color: rgb(0, 0, 0)
      });
    }
  }

  /**
   * Helper methods
   */
  private formatSectionTitle(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim() + ':';
  }

  private formatSectionContent(value: any): string {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value || 'Not specified');
  }

  private estimateSectionHeight(title: string, content: string, lineHeight: number): number {
    const titleHeight = lineHeight + 5;
    const contentLines = Math.ceil(content.length / 80); // Rough estimate
    return titleHeight + (contentLines * lineHeight) + 10;
  }

  private wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
    // Simple text wrapping - in production, use more sophisticated algorithm
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const estimatedWidth = testLine.length * fontSize * 0.6; // Rough estimate
      
      if (estimatedWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  private needsSignatureSection(documentType: string): boolean {
    const type = documentType.toLowerCase();
    return ![
      'receipt',
      'invoice',
      'report',
      'certificate'
    ].some(keyword => type.includes(keyword));
  }
}

export default EnhancedPdfGenerator;