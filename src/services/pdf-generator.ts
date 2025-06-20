// src/services/pdf-generator.ts
'use server'; // Mark as server-only if intended for server-side use (e.g., Firebase Functions)

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit'; // Ensure fontkit is installed
import { FOOTER_NOTE, FOOTER_STYLE, FOOTER_CONFIG } from '../lib/pdf-constants';

interface PdfGenerationOptions {
  documentType: string;
  answers: Record<string, unknown>;
}

/**
 * Generates a PDF document based on the provided type and answers.
 * This is a basic example and would need significant expansion for real documents.
 *
 * @param options - The options for PDF generation.
 * @returns A Promise resolving to the PDF bytes as a Uint8Array.
 */
export async function generatePdfDocument(
  options: PdfGenerationOptions,
): Promise<Uint8Array> {
  console.log(
    '[pdf-generator] Starting PDF generation for type:',
    options.documentType,
  );
  console.log('[pdf-generator] With answers:', options.answers);

  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit); // Register fontkit

    // Embed a standard font (or load a custom one)
    // Using Helvetica as an example
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold,
    );

    const page = pdfDoc.addPage(); // Default page size (Letter)
    const { width, height } = page.getSize();
    const fontSize = 12;
    const titleFontSize = 18;
    const margin = 50;
    let y = height - margin - titleFontSize;

    // 1. Add Title
    page.drawText(options.documentType, {
      x: margin,
      y: y,
      font: helveticaBoldFont,
      size: titleFontSize,
      color: rgb(0, 0, 0), // Black
    });
    y -= titleFontSize + 20; // Move down after title

    // 2. Add standardized footer disclaimer to every page
    const addFooter = (currentPage: any, hasNotarySeal = false) => {
      const pageSize = currentPage.getSize();
      let footerY = FOOTER_STYLE.margin.bottom;
      
      // Auto-scale: if footer clashes with notary seal on final page, push seal up
      if (hasNotarySeal && FOOTER_CONFIG.autoScale) {
        footerY += FOOTER_CONFIG.notarySealOffset * 72; // Convert 0.5 inch to points (72 points per inch)
      }

      // Center the footer text
      const textWidth = FOOTER_NOTE.length * (FOOTER_STYLE.fontSize * 0.6); // Approximate text width
      const centerX = (pageSize.width - textWidth) / 2;

      currentPage.drawText(FOOTER_NOTE, {
        x: Math.max(FOOTER_STYLE.margin.left, centerX),
        y: footerY,
        font: helveticaFont,
        size: FOOTER_STYLE.fontSize,
        color: rgb(0.42, 0.45, 0.5), // #6B7280 in RGB
        maxWidth: pageSize.width - FOOTER_STYLE.margin.left - FOOTER_STYLE.margin.right,
      });
    };

    // Track pages and notary seal requirements
    const pages = [page];
    const isNotaryDocument = options.documentType.toLowerCase().includes('notary') || 
                            options.documentType.toLowerCase().includes('affidavit') ||
                            options.documentType.toLowerCase().includes('power of attorney');

    // Add footer to current page
    addFooter(page);

    // 3. Add Content based on Answers
    page.drawText('Details Provided:', {
      x: margin,
      y: y,
      font: helveticaBoldFont,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    y -= fontSize + 10;

    for (const [key, value] of Object.entries(options.answers)) {
      // Basic formatting - improve as needed
      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase()); // Format key to label
      const text = `${label}: ${value || 'N/A'}`; // Handle empty values

      // Check if text will fit on the current page (accounting for footer space)
      const textHeight = fontSize * 1.2; // Approximate height
      const footerSpace = FOOTER_STYLE.margin.bottom + FOOTER_STYLE.fontSize + FOOTER_CONFIG.minContentGap;
      if (y - textHeight < margin + footerSpace) {
        // Add a new page if content doesn't fit
        const newPage = pdfDoc.addPage();
        pages.push(newPage);
        y = newPage.getSize().height - margin; // Reset y to top margin
        // Add footer to new page (UPL protection - every page requirement)
        addFooter(newPage);
      }

      page.drawText(text, {
        x: margin,
        y: y,
        font: helveticaFont,
        size: fontSize,
        color: rgb(0, 0, 0),
        maxWidth: width - 2 * margin,
        lineHeight: fontSize * 1.2,
      });
      y -= textHeight + 5; // Move down for next line
    }

    // 4. Add Placeholder Signature Line and Notary Section (if applicable)
    y -= 40; // Space before signature
    const footerSpace = FOOTER_STYLE.margin.bottom + FOOTER_STYLE.fontSize + FOOTER_CONFIG.minContentGap;
    const signatureAreaHeight = isNotaryDocument ? 120 : 50; // Extra space for notary seal
    
    if (y < margin + footerSpace + signatureAreaHeight) {
      // Check if enough space for signature/notary area on this page
      const newPage = pdfDoc.addPage();
      pages.push(newPage);
      y = newPage.getSize().height - margin;
      page = newPage; // Update current page reference
    }

    // Determine if this is the final page (for notary seal auto-scaling)
    const isFinalPage = page === pages[pages.length - 1];
    
    // Re-add footer to final page with notary seal consideration
    if (isFinalPage && isNotaryDocument) {
      // Remove existing footer and re-add with notary seal offset
      addFooter(page, true); // hasNotarySeal = true
    } else {
      addFooter(page);
    }

    // Add signature line
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: margin + 200, y: y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    y -= 15;
    page.drawText('Signature', {
      x: margin,
      y: y,
      font: helveticaFont,
      size: 10,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Add notary section if applicable
    if (isNotaryDocument) {
      y -= 30;
      page.drawText('Notary Public:', {
        x: margin,
        y: y,
        font: helveticaBoldFont,
        size: 10,
        color: rgb(0, 0, 0),
      });
      y -= 20;
      
      // Notary signature line
      page.drawLine({
        start: { x: margin, y: y },
        end: { x: margin + 200, y: y },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      y -= 15;
      page.drawText('Notary Signature', {
        x: margin,
        y: y,
        font: helveticaFont,
        size: 9,
        color: rgb(0.5, 0.5, 0.5),
      });

      // Notary seal placeholder (positioned to avoid footer clash)
      const sealX = margin + 250;
      const sealY = y + 10;
      const adjustedSealY = isFinalPage ? 
        Math.max(sealY, FOOTER_STYLE.margin.bottom + FOOTER_STYLE.fontSize + FOOTER_CONFIG.notarySealOffset * 72 + 30) : 
        sealY;
      
      page.drawRectangle({
        x: sealX,
        y: adjustedSealY,
        width: 80,
        height: 40,
        borderColor: rgb(0.7, 0.7, 0.7),
        borderWidth: 1,
      });
      page.drawText('NOTARY SEAL', {
        x: sealX + 10,
        y: adjustedSealY + 15,
        font: helveticaFont,
        size: 8,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    // 5. Serialize the PDF document to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    console.log(
      '[pdf-generator] PDF generation successful. Size:',
      pdfBytes.length,
      'bytes',
    );
    return pdfBytes;
  } catch (error) {
    console.error('[pdf-generator] Error generating PDF:', error);
    // Depending on the context, re-throw or return an error indicator
    // For now, re-throwing to let the caller handle it
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
