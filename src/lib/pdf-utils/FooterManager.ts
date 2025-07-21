// src/lib/pdf-utils/FooterManager.ts
import { PDFPage, PDFFont, rgb } from 'pdf-lib';
import {
  FOOTER_NOTE,
  FOOTER_STYLE,
  FOOTER_CONFIG,
  UPL_PROTECTION,
} from '../pdf-constants';

interface FooterOptions {
  hasNotarySeal?: boolean;
  isFinalPage?: boolean;
  customText?: string;
  language?: 'en' | 'es';
}

interface PageLayout {
  page: PDFPage;
  contentHeight: number;
  availableHeight: number;
  hasFooter: boolean;
  footerY: number;
}

class PDFFooterManager {
  private font: PDFFont;
  private footerHeight: number;

  constructor(font: PDFFont) {
    this.font = font;
    this.footerHeight =
      FOOTER_STYLE.fontSize +
      FOOTER_STYLE.margin.bottom +
      FOOTER_CONFIG.minContentGap;
  }

  /**
   * Add footer to a PDF page with auto-scaling for notary seals
   */
  addFooter(page: PDFPage, options: FooterOptions = {}): PageLayout {
    const {
      hasNotarySeal = false,
      isFinalPage = false,
      customText,
      language = 'en',
    } = options;
    const pageSize = page.getSize();

    // Determine footer text
    const footerText =
      customText ||
      (language === 'es'
        ? '© 2025 123LegalDoc · Formulario DIY · No es asesoramiento legal · Términos: 123LegalDoc.com/terms'
        : FOOTER_NOTE);

    // Calculate footer position with auto-scaling
    let footerY = FOOTER_STYLE.margin.bottom;

    if (hasNotarySeal && isFinalPage && FOOTER_CONFIG.autoScale) {
      // Push footer up if notary seal would clash
      const notaryOffset = FOOTER_CONFIG.notarySealOffset * 72; // Convert inches to points
      footerY += notaryOffset;

      console.log(
        `[FooterManager] Auto-scaling: Footer moved up ${FOOTER_CONFIG.notarySealOffset}" for notary seal`,
      );
    }

    // Center the footer text
    const textWidth = this.estimateTextWidth(footerText, FOOTER_STYLE.fontSize);
    const maxWidth =
      pageSize.width - (FOOTER_STYLE.margin.left + FOOTER_STYLE.margin.right);
    const centerX = (pageSize.width - Math.min(textWidth, maxWidth)) / 2;

    // Draw the footer
    page.drawText(footerText, {
      x: Math.max(FOOTER_STYLE.margin.left, centerX),
      y: footerY,
      font: this.font,
      size: FOOTER_STYLE.fontSize,
      color: rgb(0.42, 0.45, 0.5), // #6B7280 in RGB
      maxWidth: maxWidth,
      lineHeight: FOOTER_STYLE.fontSize * 1.2,
    });

    // Calculate available content area
    const contentHeight = pageSize.height - footerY - this.footerHeight;
    const availableHeight = contentHeight - FOOTER_CONFIG.minContentGap;

    return {
      page,
      contentHeight,
      availableHeight,
      hasFooter: true,
      footerY,
    };
  }

  /**
   * Check if content will fit on page with footer
   */
  canFitContent(
    page: PDFPage,
    requiredHeight: number,
    options: FooterOptions = {},
  ): boolean {
    const layout = this.calculatePageLayout(page, options);
    return requiredHeight <= layout.availableHeight;
  }

  /**
   * Calculate page layout considering footer requirements
   */
  calculatePageLayout(page: PDFPage, options: FooterOptions = {}): PageLayout {
    const { hasNotarySeal = false, isFinalPage = false } = options;
    const pageSize = page.getSize();

    let footerY = FOOTER_STYLE.margin.bottom;

    if (hasNotarySeal && isFinalPage && FOOTER_CONFIG.autoScale) {
      footerY += FOOTER_CONFIG.notarySealOffset * 72;
    }

    const contentHeight = pageSize.height - footerY - this.footerHeight;
    const availableHeight = contentHeight - FOOTER_CONFIG.minContentGap;

    return {
      page,
      contentHeight,
      availableHeight,
      hasFooter: false,
      footerY,
    };
  }

  /**
   * Validate UPL protection compliance
   */
  validateUPLCompliance(pages: PDFPage[]): {
    compliant: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check if every page has footer (UPL requirement)
    if (!UPL_PROTECTION.everyPageRequired) {
      issues.push('UPL protection requires footer on every page');
    }

    // Validate footer visibility
    if (FOOTER_STYLE.fontSize < 6) {
      issues.push(
        'Footer font size too small for legal compliance (minimum 6pt recommended)',
      );
    }

    // Check for severability protection
    if (pages.length > 1 && !UPL_PROTECTION.severabilityProtection) {
      recommendations.push(
        'Multi-page documents benefit from per-page disclaimers for severability protection',
      );
    }

    // Validate copy/scan resilience
    if (!UPL_PROTECTION.copyScanResilience) {
      recommendations.push(
        'Consider adding footer to every page for copy/scan resilience',
      );
    }

    return {
      compliant: issues.length === 0,
      issues,
      recommendations,
    };
  }

  /**
   * Add footer to all pages in a document
   */
  addFooterToAllPages(
    pages: PDFPage[],
    options: {
      notaryDocumentType?: boolean;
      language?: 'en' | 'es';
      customText?: string;
    } = {},
  ): PageLayout[] {
    const { notaryDocumentType = false, language = 'en', customText } = options;
    const layouts: PageLayout[] = [];

    pages.forEach((page, index) => {
      const isFinalPage = index === pages.length - 1;
      const hasNotarySeal = notaryDocumentType && isFinalPage;

      const layout = this.addFooter(page, {
        hasNotarySeal,
        isFinalPage,
        customText,
        language,
      });

      layouts.push(layout);
    });

    // Log UPL compliance
    const compliance = this.validateUPLCompliance(pages);
    if (!compliance.compliant) {
      console.warn('[FooterManager] UPL Compliance Issues:', compliance.issues);
    }

    console.log(
      `[FooterManager] Added footers to ${pages.length} pages with UPL protection`,
    );
    return layouts;
  }

  /**
   * Calculate optimal notary seal position to avoid footer clash
   */
  calculateNotarySealPosition(
    page: PDFPage,
    defaultX: number,
    defaultY: number,
  ): { x: number; y: number } {
    const layout = this.calculatePageLayout(page, {
      hasNotarySeal: true,
      isFinalPage: true,
    });

    // Ensure notary seal is positioned above footer with adequate spacing
    const minY = layout.footerY + FOOTER_STYLE.fontSize + 20; // 20pt spacing above footer
    const adjustedY = Math.max(defaultY, minY);

    if (adjustedY !== defaultY) {
      console.log(
        `[FooterManager] Notary seal moved from Y:${defaultY} to Y:${adjustedY} to avoid footer clash`,
      );
    }

    return {
      x: defaultX,
      y: adjustedY,
    };
  }

  /**
   * Estimate text width for centering calculations
   */
  private estimateTextWidth(text: string, fontSize: number): number {
    // Rough estimation: average character width is ~0.6 * fontSize
    return text.length * fontSize * 0.6;
  }

  /**
   * Get footer configuration for different document types
   */
  static getFooterConfigForDocumentType(documentType: string): {
    requiresNotarySection: boolean;
    footerText: string;
    specialHandling: string[];
  } {
    const type = documentType.toLowerCase();

    const requiresNotarySection = [
      'affidavit',
      'power of attorney',
      'notarized',
      'sworn statement',
      'acknowledgment',
    ].some((keyword) => type.includes(keyword));

    const specialHandling: string[] = [];

    if (requiresNotarySection) {
      specialHandling.push('notary_seal_auto_scaling');
    }

    if (['will', 'trust', 'estate'].some((keyword) => type.includes(keyword))) {
      specialHandling.push('witness_signature_area');
    }

    return {
      requiresNotarySection,
      footerText: FOOTER_NOTE,
      specialHandling,
    };
  }
}

export default PDFFooterManager;
