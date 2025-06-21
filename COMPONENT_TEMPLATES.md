# Component Creation Templates

This document provides standardized templates for creating new components in the 123LegalDoc project.

## Basic Component Template

```typescript
// src/components/[category]/ComponentName.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  className?: string;
  children?: React.ReactNode;
}

export default function ComponentName({
  className,
  children,
  ...props
}: ComponentNameProps) {
  return (
    <div className={cn('component-name', className)} {...props}>
      {children}
    </div>
  );
}

// Named export for barrel export compatibility
export { ComponentName };
```

## Form Component Template

```typescript
// src/components/forms/FormComponentName.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  // Define your form fields here
  name: z.string().min(1, 'Name is required'),
});

type FormData = z.infer<typeof formSchema>;

interface FormComponentNameProps {
  onSubmit: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
  className?: string;
}

export default function FormComponentName({
  onSubmit,
  defaultValues,
  className
}: FormComponentNameProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Client Component Template

```typescript
// src/components/[category]/ClientComponentName.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ClientComponentNameProps {
  // Define props
}

export default function ClientComponentName(props: ClientComponentNameProps) {
  const { t } = useTranslation();
  const [state, setState] = useState();

  useEffect(() => {
    // Client-side effects
  }, []);

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

## Page Component Template

```typescript
// src/app/[locale]/page-name/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import PageClientContent from './page-client-content';

// Static generation configuration
export const dynamic = 'force-static'; // or 'force-dynamic'
export const revalidate = 3600; // if using ISR

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export const metadata: Metadata = {
  title: 'Page Title | 123LegalDoc',
  description: 'Page description for SEO',
};

interface PageProps {
  params: {
    locale: 'en' | 'es';
  };
}

export default function Page({ params }: PageProps) {
  return <PageClientContent locale={params.locale} />;
}
```

## Document Definition Template

```typescript
// src/lib/documents/[jurisdiction]/document-name/index.ts
import type { LegalDocument } from '@/types/documents';
import { documentNameMetadata } from './metadata';
import { documentNameQuestions } from './questions';
import { documentNameSchema } from './schema';

export const documentName: LegalDocument = {
  id: 'document-name', // Always kebab-case
  ...documentNameMetadata,
  schema: documentNameSchema,
  questions: documentNameQuestions,
};

// src/lib/documents/[jurisdiction]/document-name/metadata.ts
import type { LegalDocumentMetadata } from '@/types/documents';

export const documentNameMetadata: LegalDocumentMetadata = {
  jurisdiction: 'US', // or 'CA'
  category: 'Business', // Finance, Personal, Real Estate, Family
  languageSupport: ['en', 'es'],
  basePrice: 5,
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  states: 'all', // or specific states array
  templatePaths: {
    en: '/templates/en/document-name.md',
    es: '/templates/es/document-name.md',
  },
  translations: {
    en: {
      name: 'Document Display Name',
      description: 'Document description for users',
      aliases: ['search', 'terms', 'keywords'],
    },
    es: {
      name: 'Nombre del Documento',
      description: 'Descripción del documento',
      aliases: ['términos', 'de', 'búsqueda'],
    },
  },
  upsellClauses: [],
};

// src/lib/documents/[jurisdiction]/document-name/schema.ts
import { z } from 'zod';

export const documentNameSchema = z.object({
  // Define your document fields
  requiredField: z.string().min(1, 'Field is required'),
  optionalField: z.string().optional(),
});

// src/lib/documents/[jurisdiction]/document-name/questions.ts
import type { Question } from '@/types/documents';

export const documentNameQuestions: Question[] = [
  {
    id: 'requiredField',
    label: 'Field Label',
    type: 'text',
    required: true,
    placeholder: 'Enter value...',
  },
];
```

## Component File Organization

### Directory Structure

```
src/components/[category]/ComponentName/
├── index.tsx              # Main component
├── ComponentName.test.tsx # Tests
├── types.ts              # TypeScript types
├── constants.ts          # Component constants
├── utils.ts              # Component utilities
└── README.md             # Component documentation
```

### Barrel Export Pattern

```typescript
// src/components/[category]/index.ts
export { default as ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

## Naming Conventions

- **Components**: PascalCase (`ComponentName.tsx`)
- **Files**: PascalCase for components, kebab-case for pages
- **Props**: PascalCase with `Props` suffix (`ComponentNameProps`)
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Document IDs**: kebab-case (`document-name`)

## Testing Template

```typescript
// src/components/[category]/ComponentName.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('handles props correctly', () => {
    render(<ComponentName prop="value" />);
    // Test prop handling
  });
});
```

## Best Practices

1. **Always use TypeScript** - Define proper interfaces for props
2. **Use Barrel Exports** - Export from category index files
3. **Follow Naming Conventions** - Consistent naming across the project
4. **Add JSDoc Comments** - Document complex components
5. **Use Zod for Validation** - Form schemas and data validation
6. **Implement Proper Error Handling** - Try-catch blocks and error boundaries
7. **Optimize Performance** - Use React.memo, useMemo, useCallback when needed
8. **Follow Accessibility Guidelines** - Proper ARIA labels and keyboard navigation
9. **Write Tests** - Unit tests for component logic
10. **Document Complex Logic** - README files for complex components

## VS Code Snippets

Add these to your VS Code snippets for faster component creation:

```json
{
  "React Component": {
    "prefix": "rcomp",
    "body": [
      "import React from 'react';",
      "import { cn } from '@/lib/utils';",
      "",
      "interface ${1:ComponentName}Props {",
      "  className?: string;",
      "  children?: React.ReactNode;",
      "}",
      "",
      "export default function ${1:ComponentName}({ className, children }: ${1:ComponentName}Props) {",
      "  return (",
      "    <div className={cn('${2:component-name}', className)}>",
      "      {children}",
      "    </div>",
      "  );",
      "}",
      "",
      "export { ${1:ComponentName} };"
    ],
    "description": "Create a React component with TypeScript"
  }
}
```
