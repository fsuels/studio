# Architectural Decision Records (ADRs)

This document records key architectural decisions made for the 123LegalDoc project.

## ADR-001: Component Organization Strategy

**Status:** Accepted  
**Date:** 2024-06-16  
**Context:** Need to organize components for maintainability and scalability

### Decision
Organize components by functional category rather than technical type:
- `ui/` - Design system primitives  
- `layout/` - Layout and navigation components
- `forms/` - Form-related components with validation
- `workflow/` - Document creation workflow components
- `document/` - Document handling and display
- `shared/` - Shared utility components
- `landing/` - Marketing page components

### Rationale
- Functional organization makes finding components intuitive
- Reduces cognitive load when developing features
- Enables better code reuse within feature areas
- Supports team scalability with clear ownership boundaries

### Consequences
- Easier to locate and maintain components
- Clear separation of concerns
- Improved development velocity
- Some components may fit multiple categories (resolved by primary use case)

---

## ADR-002: Document Library Architecture

**Status:** Accepted  
**Date:** 2024-06-16  
**Context:** Need scalable architecture for legal document definitions

### Decision
Use folder-based document structure with separation of concerns:
```
src/lib/documents/[jurisdiction]/[document-name]/
├── index.ts      # Main export
├── metadata.ts   # Document metadata
├── schema.ts     # Zod validation schema
└── questions.ts  # Form questions
```

### Rationale
- Clear separation of concerns (metadata, validation, UI)
- Easier to maintain and test individual aspects
- Supports team collaboration (different developers can work on different files)
- Enables code reuse between similar documents
- Scalable to hundreds of document types

### Consequences
- More files per document (manageable with good tooling)
- Consistent structure across all documents
- Easier to validate and test document schemas
- Clear jurisdiction separation (US/CA)

---

## ADR-003: Static Generation Strategy

**Status:** Accepted  
**Date:** 2024-06-16  
**Context:** Need optimal performance and SEO while supporting dynamic content

### Decision
Implement tiered static generation strategy:
- **Marketing pages**: Static with 24h revalidation
- **Legal pages**: Static with 1-week revalidation  
- **Document templates**: Static with 1h revalidation
- **User pages**: Dynamic rendering
- **Workflow pages**: Dynamic rendering

### Rationale
- Marketing content changes infrequently, benefits from static generation
- Legal content requires stability, longer cache times appropriate
- Document templates may update for legal accuracy, shorter cache times
- User-specific content must be dynamic for personalization and security
- SEO benefits for public pages, performance benefits for private pages

### Consequences
- Optimal performance for public pages
- Reduced server load through strategic caching
- Complexity in managing different rendering strategies
- Need for careful cache invalidation for legal content updates

---

## ADR-004: Import and Export Strategy

**Status:** Accepted  
**Date:** 2024-06-16  
**Context:** Need consistent import patterns and optimal bundle sizes

### Decision
Implement barrel export system with category-based imports:
- Each component category has an `index.ts` barrel export
- Main `components/index.ts` exports from all categories
- Consistent import patterns: `import { Component } from '@/components/category'`
- Dynamic imports for large components using `lazyClient()`

### Rationale
- Cleaner import statements improve code readability
- Category-based organization makes imports predictable
- Tree-shaking optimization maintains bundle efficiency
- Lazy loading for performance-critical areas
- Consistent patterns reduce cognitive load

### Consequences
- Improved developer experience with cleaner imports
- Better code organization and discoverability
- Potential for import cycles (mitigated by clear component hierarchy)
- Need to maintain barrel exports when adding components

---

## ADR-005: Form Validation Architecture

**Status:** Accepted  
**Date:** 2024-06-16  
**Context:** Need robust, type-safe form validation for legal documents

### Decision
Use Zod for schema validation with React Hook Form integration:
- Document schemas defined in separate `schema.ts` files
- Form questions defined in separate `questions.ts` files  
- Runtime validation using Zod schemas
- Type inference for TypeScript safety
- Consistent error handling and messaging

### Rationale
- Type safety prevents runtime errors in production
- Single source of truth for validation rules
- Runtime validation catches user input errors
- Separation allows reuse of schemas for API validation
- Excellent TypeScript integration

### Consequences
- Strong type safety throughout the application
- Consistent validation behavior across all forms
- Learning curve for team members unfamiliar with Zod
- Additional build-time complexity for type inference

---

## ADR-006: Large Component Breakdown Strategy

**Status:** Accepted  
**Date:** 2024-06-16  
**Context:** Large components (>600 lines) causing maintenance issues

### Decision
Break down large components using consistent patterns:
- Create folder structure for complex components
- Separate by functional responsibility (container, presentation, business logic)
- Extract reusable sub-components
- Maintain single public API through main component
- Use consistent naming patterns (ComponentContainer, ComponentItem, etc.)

### Rationale
- Smaller components are easier to understand and maintain
- Enables better testing of individual component pieces
- Improves code reuse through extracted sub-components
- Reduces merge conflicts in team development
- Enables progressive enhancement of complex features

### Consequences
- More files to manage per complex component
- Need for consistent patterns to avoid confusion
- Improved maintainability and testability
- Better performance through more granular re-rendering

---

## ADR-007: Build and Development Tooling

**Status:** Accepted  
**Date:** 2024-06-16  
**Context:** Need efficient development workflow and production optimization

### Decision
Implement comprehensive tooling strategy:
- ESLint with custom rules for document schema consistency
- Import sorting and unused import detection
- Bundle analysis for performance monitoring
- Performance budgets to prevent bloat
- Static generation optimization for public pages

### Rationale
- Automated code quality prevents issues before production
- Performance monitoring enables proactive optimization
- Consistent code style improves team collaboration
- Early detection of bundle size issues
- Custom rules enforce architectural decisions

### Consequences
- Improved code quality and consistency
- Better performance monitoring capabilities
- Learning curve for custom ESLint rules
- Potential build time increase (offset by fewer production issues)

---

## Decision Process

### When to Create an ADR
- Architecture changes affecting multiple components
- Technology choices with long-term implications
- Patterns that should be followed consistently
- Trade-offs between competing approaches

### ADR Template
```markdown
## ADR-XXX: Decision Title

**Status:** Proposed | Accepted | Deprecated | Superseded  
**Date:** YYYY-MM-DD  
**Context:** Why this decision is needed

### Decision
What we decided to do

### Rationale  
Why we made this decision

### Consequences
What this means going forward (positive and negative)
```

### Review Process
1. Draft ADR for significant architectural decisions
2. Review with team for feedback and consensus
3. Update based on feedback
4. Mark as "Accepted" when consensus reached
5. Implement the decision
6. Reference ADR in code comments for complex implementations

---

## Current Architecture Status

As of June 2024, the 123LegalDoc architecture has been successfully modernized according to these decisions:

- ✅ Component organization standardized
- ✅ Document library architecture implemented  
- ✅ Static generation strategy optimized
- ✅ Import/export patterns established
- ✅ Form validation architecture implemented
- ✅ Large components broken down systematically
- ✅ Build and development tooling enhanced

This foundation provides a scalable, maintainable architecture ready for continued growth and team expansion.