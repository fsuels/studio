# PDF Library Consolidation Plan

## Current State Analysis

### PDF Libraries Found
1. **pdf-lib@1.17.1** (Production) ✅ KEEP
   - Primary PDF manipulation library
   - Used throughout codebase for PDF generation and form filling
   - ~152KB gzipped
   - Provides all necessary functionality

2. **@pdf-lib/fontkit@1.1.1** (Production) ✅ KEEP
   - Required for pdf-lib font handling
   - ~45KB gzipped

3. **pdfjs-dist@5.3.31** (Dev Dependency) ❌ REMOVE
   - ~2.8MB uncompressed
   - Only used in `/scripts/manual-map.ts` development tool
   - Can be replaced with pdf-lib functionality

4. **react-pdf@10.0.1** (Dev Dependency) ❌ REMOVE
   - ~600KB + dependencies
   - NOT USED anywhere in the codebase
   - Complete dead dependency

## Bundle Impact

### Current Waste
- **pdfjs-dist**: 2.8MB of unused code
- **react-pdf**: 600KB of unused code
- **Total savings**: ~3.4MB

### Current Efficiency
- pdf-lib already properly chunked in webpack config
- Dynamic imports implemented correctly
- No overlapping functionality

## Migration Steps

### Step 1: Remove Unused Dependencies
```bash
npm uninstall pdfjs-dist react-pdf
```

### Step 2: Update Bundle Configuration
Update `next.config.mjs` line 84:
```javascript
// FROM:
test: /[\\/]node_modules[\\/](pdf-lib|@react-pdf|jspdf)[\\/]/,

// TO:
test: /[\\/]node_modules[\\/](pdf-lib|@pdf-lib)[\\/]/,
```

### Step 3: Fix Manual Mapping Script
Replace pdfjs-dist usage in `/scripts/manual-map.ts` with pdf-lib-based approach:

```typescript
// Replace pdfjs-dist functionality with pdf-lib
import { PDFDocument } from 'pdf-lib';

// Function to get PDF page count and dimensions using pdf-lib
async function getPDFInfo(pdfBytes: ArrayBuffer) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  return {
    numPages: pages.length,
    pages: pages.map(page => ({
      width: page.getWidth(),
      height: page.getHeight()
    }))
  };
}
```

### Step 4: Create Unified PDF Service Layer

Create `/src/lib/pdf/unified-pdf-service.ts`:
```typescript
export class UnifiedPDFService {
  // Centralize all PDF operations
  static async loadPDF(source: ArrayBuffer | string) { /* ... */ }
  static async fillForm(pdfBytes: ArrayBuffer, data: Record<string, any>) { /* ... */ }
  static async overlayText(pdfBytes: ArrayBuffer, overlays: any[]) { /* ... */ }
  static async generateFromTemplate(template: string, data: any) { /* ... */ }
}
```

## Files Requiring Updates

### Direct Updates Needed:
1. `/scripts/manual-map.ts` - Replace pdfjs-dist with pdf-lib
2. `/next.config.mjs` - Update bundle chunk configuration
3. `package.json` - Remove unused dependencies

### No Changes Needed:
- All production code already uses pdf-lib correctly
- Dynamic imports are properly implemented
- Bundle splitting is already optimized
- Component structure is efficient

## Verification Steps

### After Migration:
1. Run `npm run build` to verify bundle optimization
2. Run `npm run analyze` to confirm chunk sizes
3. Test PDF generation functionality
4. Test state form filling
5. Verify manual mapping script still works

### Expected Results:
- **Bundle size reduction**: ~3.4MB less in node_modules
- **No functionality loss**: All features work identically
- **Cleaner dependencies**: Only necessary PDF libraries remain
- **Improved build times**: Fewer dependencies to process

## Risks & Mitigation

### Low Risk Migration:
- Only removing unused dependencies
- No changes to production code paths
- pdf-lib already handles all required functionality

### Rollback Plan:
If issues arise, simply reinstall dependencies:
```bash
npm install pdfjs-dist@5.3.31 react-pdf@10.0.1 --save-dev
```

## Conclusion

Your PDF library usage is already well-optimized. The main opportunity is removing ~3.4MB of unused dependencies (pdfjs-dist and react-pdf) with minimal code changes. The consolidation will:

1. **Reduce bundle bloat** by 3.4MB
2. **Simplify dependencies** to just pdf-lib ecosystem
3. **Maintain all functionality** without breaking changes
4. **Improve build performance** with fewer dependencies to process

This is a low-risk, high-value optimization that aligns with your already excellent PDF architecture.