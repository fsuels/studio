# Claude Memory for 123LegalDoc Project

## Project Overview
123LegalDoc is a legal document generation platform that creates state-specific compliant legal forms. The platform focuses on ensuring 100% legal compliance while providing an excellent user experience.

## Current Document Types
- Vehicle Bill of Sale (fully implemented with state compliance)
- Various other legal documents (templates exist, compliance implementation needed)

## Key Technologies
- **Frontend**: Next.js 15 with TypeScript
- **UI**: Tailwind CSS with shadcn/ui components
- **PDF Processing**: pdf-lib for form overlays and manipulation
- **Forms**: React Hook Form for document wizard
- **State Management**: React Context and hooks
- **Internationalization**: i18next (English and Spanish)

## State-Based Compliance System

### Critical Context: Complete System Recreation (June 2025)
**USER REQUEST**: "I have to go back to a previous commit that does not have other problems. Please add everything again we did in this chat. Sorry"

The user lost all work when trying to push to GitHub and explicitly requested recreation of the ENTIRE system from the previous chat conversation.

### Implementation Status: Vehicle Bill of Sale
✅ **FULLY RECREATED & IMPLEMENTED** (June 2025) including:
- ✅ Complete compliance rules for all 50 US states with TypeScript interfaces (RECREATED)
- ✅ Smart PDF overlay system with automatic form field detection (RECREATED)
- ✅ Live preview switching between generic and official state forms (RECREATED)
- ✅ State selection as first question in document wizard (RECREATED)
- ✅ Visual compliance badges and user guidance (RECREATED)
- ✅ StatePDFPreview component with download functionality (RECREATED)
- ✅ SimplePDFViewer component with form data overlay (RECREATED)
- ✅ Enhanced PreviewPane with intelligent state detection (RECREATED)
- ✅ ALL overlay configuration files in correct `/forms/[state]/overlay.ts` structure (CREATED)
- ✅ ALL PDF placeholder files in correct `/public/forms/vehicle-bill-of-sale/[state]/` structure (CREATED)
- ✅ Comprehensive documentation (REMEMBER.md) (RECREATED)
- ⚠️ .gitkeep files need manual deletion (user must remove manually)

### RECREATED: Official State Forms (10 states with mandatory forms)
**ALL FILES CREATED IN THIS SESSION:**
1. **Alabama**: MVT-32-13B.pdf (requires notary) - ✅ CREATED `/public/forms/vehicle-bill-of-sale/alabama/MVT-32-13B.pdf`
2. **Colorado**: DR-2116.pdf (requires notary) - ✅ CREATED `/public/forms/vehicle-bill-of-sale/colorado/DR-2116.pdf`
3. **Florida**: HSMV-82050.pdf (requires notary) - ✅ CREATED `/public/forms/vehicle-bill-of-sale/florida/HSMV-82050.pdf`
4. **Georgia**: T-7.pdf (requires notary) - ✅ CREATED `/public/forms/vehicle-bill-of-sale/georgia/T-7.pdf`
5. **Idaho**: ITD-3738.pdf (requires notary) - ✅ CREATED `/public/forms/vehicle-bill-of-sale/idaho/ITD-3738.pdf`
6. **Kansas**: TR-312.pdf (requires notary) - ✅ CREATED `/public/forms/vehicle-bill-of-sale/kansas/TR-312.pdf`
7. **Maryland**: VR-181.pdf (requires notary) - ✅ CREATED `/public/forms/vehicle-bill-of-sale/maryland/VR-181.pdf`
8. **Montana**: MV-24.pdf (requires notary) - ✅ CREATED `/public/forms/vehicle-bill-of-sale/montana/MV-24.pdf`
9. **North Dakota**: SFN-2888.pdf (requires notary) - ✅ CREATED `/public/forms/vehicle-bill-of-sale/north-dakota/SFN-2888.pdf`
10. **West Virginia**: DMV-7-TR.pdf (requires notary) - ✅ CREATED `/public/forms/vehicle-bill-of-sale/west-virginia/DMV-7-TR.pdf`

**NOTE**: These are placeholder PDFs. Replace with actual official forms from state DMV websites.

## File Structure & Organization

### Compliance Implementation Files
```
/src/lib/documents/us/vehicle-bill-of-sale/
├── compliance.ts              # State rules for all 50 states
├── questions.ts              # Document questions (state first)
└── forms/                    # Overlay configurations only
    ├── alabama/overlay.ts
    ├── colorado/overlay.ts
    ├── florida/overlay.ts
    ├── georgia/overlay.ts
    ├── idaho/overlay.ts
    ├── kansas/overlay.ts
    ├── maryland/overlay.ts
    ├── montana/overlay.ts
    ├── north-dakota/overlay.ts
    └── west-virginia/overlay.ts
```

### PDF Storage (Public Access)
```
/public/forms/vehicle-bill-of-sale/
├── alabama/MVT-32-13B.pdf
├── colorado/DR-2116.pdf
├── florida/HSMV-82050.pdf
├── georgia/T-7.pdf
├── idaho/ITD-3738.pdf
├── kansas/TR-312.pdf
├── maryland/VR-181.pdf
├── montana/MV-24.pdf
├── north-dakota/SFN-2888.pdf
└── west-virginia/DMV-7-TR.pdf
```

### Core System Files
- `/src/lib/compliance-helper.ts` - Helper functions for compliance checking
- `/src/lib/pdf/state-form-manager.ts` - PDF path management and form detection
- `/src/lib/pdf/pdf-overlay-service.ts` - Smart PDF overlay with form field detection
- `/src/components/document/StatePDFPreview.tsx` - State-specific PDF preview
- `/src/components/document/SimplePDFViewer.tsx` - PDF viewer with overlay support
- `/src/components/document/PreviewPane.tsx` - Main preview with state detection

## Naming Conventions
- **Document directories**: kebab-case (e.g., `vehicle-bill-of-sale`, `power-of-attorney`)
- **State directories**: kebab-case (e.g., `north-dakota`, `west-virginia`)
- **PDF files**: FORM-NAME.pdf with dashes (e.g., `HSMV-82050.pdf`, `DMV-7-TR.pdf`)
- **TypeScript files**: kebab-case.ts (e.g., `compliance.ts`, `overlay.ts`)

## Implementation Process for New Documents

### Phase 1: Legal Research (MANDATORY FIRST STEP)
1. **Visit official state government websites** for all 50 states
2. **Research specific requirements** for the document type:
   - Is the document mandatory or optional?
   - Does it require notarization? (Always, conditional, or never)
   - Is there an official state form that MUST be used?
   - Are there special requirements (witnesses, specific language, etc.)?
   - What are the legal consequences of not following state rules?

### Phase 2: Implementation
1. **Create compliance configuration** with all 50 state rules
2. **Download official forms** from government websites  
3. **Update document questions** (state selection first)
4. **Create overlay configurations** for PDF form filling
5. **Implement preview system** with state-specific forms
6. **Add compliance helpers** and user guidance
7. **Create visual indicators** for requirements
8. **Test user experience** for 100% clarity

## User Experience Priorities
- **State selection first** → immediate compliance checking
- **Clear visual indicators** → users know exactly what's required  
- **Automatic form switching** → official state forms when mandatory
- **Live preview** → users see exactly what they're creating
- **Error prevention** → impossible to miss critical requirements
- **Zero legal mistakes** → platform ensures compliance automatically

## Technical Features

### Smart PDF Overlay System
- **Automatic form field detection** for fillable PDFs
- **Intelligent field name matching** (seller_name → "seller", "sellerName", "from", etc.)
- **Live preview updates** as user types
- **Fallback coordinate-based overlay** if no form fields exist
- **CSP-safe implementation** for browser compatibility

### State Compliance Display
- **Visual badges** for requirements (Notary Required, Official Form, etc.)
- **Clear messaging** ("✅ No notarization required", "⚠️ Notarization required")
- **Special notes** for state-specific rules
- **Download functionality** for completed forms

## Configuration Examples

### Compliance Rule Structure
```typescript
interface VehicleBillOfSaleRule {
  requiresNotary: boolean | "conditional";
  officialForm?: string;
  billOfSaleMandatory: boolean;
  odometerIntegrated: boolean;
  specialNotes?: string;
  localFormPath?: string;
}
```

### Helper Functions Pattern
```typescript
- getVehicleBillOfSaleCompliance(state)
- requiresNotaryForVehicleBillOfSale(state)  
- hasOfficialForm(state)
- isBillOfSaleMandatory(state)
```

## Next.js Configuration
- **CSP disabled** for development to allow PDF display
- **Bundle optimization** with code splitting by document type
- **Static export ready** with image optimization disabled
- **Performance budgets** configured for optimal loading

## Key Learnings
1. **Always start with legal research** from official state websites
2. **User compliance is non-negotiable** - legal mistakes have serious consequences
3. **State as first question is crucial** for compliance checking
4. **Visual clarity prevents errors** - users must understand requirements instantly
5. **Official state forms are mandatory** when required - never substitute
6. **Separation of concerns**: PDFs in `/public/`, configs in `/src/`
7. **Consistent naming prevents import issues**
8. **Smart form detection beats manual coordinate mapping**

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

## Documentation
- **REMEMBER.md** - Complete implementation guide for scaling to other documents
- **CLAUDE.md** - This memory file for context retention

## Goals
- **100% Legal Compliance** - Users never make legal mistakes
- **100% Customer Satisfaction** - Effortless and error-proof process
- **Maximum Ease of Use** - Clear guidance and automated compliance
- **Official Form Integration** - Use mandatory state forms when required
- **Complete Transparency** - Show all requirements clearly to users