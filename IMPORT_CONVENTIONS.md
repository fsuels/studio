# Import Conventions

This document outlines the standardized import patterns and barrel export system for the 123LegalDoc project.

## Barrel Export System

All component groups have barrel exports through `index.ts` files, allowing for clean and organized imports.

### Available Component Categories

#### Core UI Components

```typescript
import { Button, Input, Card } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
```

#### Layout Components

```typescript
import { Header, Footer, Layout } from '@/components/layout';
```

#### Form Components

```typescript
import {
  FieldRenderer,
  DynamicFormRenderer,
  WizardForm,
} from '@/components/forms';
```

#### Workflow Components

```typescript
import {
  Step1DocumentSelector,
  ReviewStep,
  DisclaimerStep,
} from '@/components/workflow';
```

#### Document Components

```typescript
import {
  PDFPreview,
  DocumentDetail,
  DocumentPreview,
} from '@/components/document';
```

#### Shared Utilities

```typescript
import { EmptyState, ProgressBar, SearchBar } from '@/components/shared';
```

## Import Patterns

### 1. Preferred: Category-based Imports

Use barrel exports for organized imports:

```typescript
// ✅ Good - Category-based barrel import
import { Button, Input } from '@/components/ui';
import { Header, Footer } from '@/components/layout';
import { FieldRenderer } from '@/components/forms';
```

### 2. Alternative: Direct Component Import

For single components or when tree-shaking is critical:

```typescript
// ✅ Acceptable - Direct import
import Button from '@/components/ui/button';
import Header from '@/components/layout/Header';
```

### 3. Avoid: Deep Imports

Avoid importing from internal implementation details:

```typescript
// ❌ Avoid - Deep internal imports
import WizardAuth from '@/components/forms/WizardForm/WizardAuth';
import ReviewFieldItem from '@/components/workflow/ReviewStep/ReviewFieldItem';
```

## Dynamic Import Strategy

For large components or lazy loading, use consistent dynamic import patterns:

### Client-side Dynamic Imports

```typescript
import { lazyClient } from '@/lib/lazy-client';

// ✅ Good - Consistent lazy loading
const LazyComponent = lazyClient(() => import('@/components/forms/WizardForm'));
```

### Server-side Dynamic Imports

```typescript
import dynamic from 'next/dynamic';

// ✅ Good - Server-side dynamic import
const DynamicChart = dynamic(() => import('@/components/ui/chart'), {
  ssr: false,
  loading: () => <div>Loading chart...</div>
});
```

## Type Imports

Always use `import type` for TypeScript types:

```typescript
// ✅ Good - Type-only imports
import type { LegalDocument } from '@/types/documents';
import type { ComponentProps } from 'react';

// ✅ Good - Mixed imports
import React, { type ComponentProps } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
```

## Re-exports

When creating wrapper components, use consistent re-export patterns:

```typescript
// ✅ Good - Clean re-export
export { Button as PrimaryButton } from '@/components/ui/button';
export type { ButtonProps as PrimaryButtonProps } from '@/components/ui/button';
```

## Best Practices

### 1. Import Organization

Organize imports in this order:

1. React and core libraries
2. Third-party libraries
3. Internal utilities and lib
4. Internal components (using barrel exports)
5. Types (always with `import type`)

```typescript
// ✅ Good - Organized imports
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { track } from '@/lib/analytics';
import { Button, Input } from '@/components/ui';
import { FieldRenderer } from '@/components/forms';
import type { LegalDocument } from '@/types/documents';
```

### 2. Avoid Circular Dependencies

- Never import from parent directories in child components
- Use dependency injection or context when needed
- Keep component hierarchies clean

### 3. Tree Shaking Optimization

- Barrel exports are configured for optimal tree shaking
- Avoid wildcard exports where possible
- Use named exports consistently

## ESLint Configuration

The project includes automated import sorting and unused import detection:

- Import order is enforced automatically
- Unused imports are flagged as errors
- Alphabetical sorting within groups

## Migration Guide

When updating imports to use the new barrel export system:

1. Replace deep imports with category imports
2. Update any existing wildcard imports
3. Use the component category that best fits the component's purpose
4. Test that tree shaking still works effectively

This system provides better developer experience while maintaining optimal bundle sizes and clear component organization.
