/**
 * PDF Generation Constants
 *
 * Standardized footer and disclaimer constants for legal document PDFs
 */

// Standard footer for all legal documents
export const FOOTER_NOTE =
  '© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms';

// Spanish version of footer
export const FOOTER_NOTE_ES =
  '© 2025 123LegalDoc · Formulario DIY · No es asesoramiento legal · Términos: 123LegalDoc.com/terms';

// Footer styling configuration
export const FOOTER_STYLE = {
  fontSize: 8, // 8-pt font size
  color: '#6B7280', // light-gray color
  align: 'center' as const, // center alignment
  margin: {
    bottom: 10, // bottom margin
    left: 10,
    right: 10,
  },
};

// Footer positioning configuration
export const FOOTER_CONFIG = {
  // Push notary seal up if footer clashes on final page
  notarySealOffset: 0.5, // 0.5 inch offset

  // Page positioning
  position: 'bottom' as const,

  // Auto-scale settings
  autoScale: true,

  // Minimum distance from content
  minContentGap: 20, // 20 pixels minimum gap
};

// Template disclaimer text (for markdown templates)
export const TEMPLATE_DISCLAIMER_EN =
  '---\n© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms';
export const TEMPLATE_DISCLAIMER_ES =
  '---\n© 2025 123LegalDoc · Formulario DIY · No es asesoramiento legal · Términos: 123LegalDoc.com/terms';

/**
 * UPL (Unauthorized Practice of Law) Protection
 *
 * Why Every Page Footer Wins:
 * - Severability: Courts treat detached pages as separate documents;
 *   missing disclaimer resurrects UPL claims
 * - Copy/Scan Resilience: Photocopies often omit last page;
 *   per-page footer survives
 * - Invisible to UX: At 8-pt gray, users focus on content, not fine print
 */

export const UPL_PROTECTION = {
  everyPageRequired: true,
  severabilityProtection: true,
  copyScanResilience: true,
  minimalUxImpact: true,
} as const;
