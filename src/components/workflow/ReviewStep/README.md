# ReviewStep Components

This directory contains the modular breakdown of the ReviewStep component, organized into focused, reusable components with clear separation of concerns.

## Component Structure

### 1. **ReviewStepContainer.tsx**

- **Purpose**: Main container component that manages the review step state and orchestrates other components
- **Responsibilities**:
  - Form state management (editing, saving, canceling)
  - Schema processing and field configuration
  - Toast notifications and validation
  - Focus management for editing fields

### 2. **ReviewFieldItem.tsx**

- **Purpose**: Individual field display and edit component
- **Responsibilities**:
  - Renders field label, value, and edit button
  - Handles click and keyboard interactions
  - Manages editing state for individual fields
  - Displays validation errors

### 3. **FieldEditor.tsx**

- **Purpose**: Handles the editing interface for different field types
- **Responsibilities**:
  - Renders appropriate input components based on field type
  - Handles phone/tel fields with SmartInput
  - Manages address fields with AddressField component
  - Provides Controller wrapper for form integration

### 4. **FieldValueRenderer.tsx**

- **Purpose**: Displays field values in read-only mode
- **Responsibilities**:
  - Formats values based on field type (boolean, select, date, etc.)
  - Handles missing/required field indicators
  - Provides consistent value display formatting

### 5. **useFieldConfiguration.ts**

- **Purpose**: Custom hook for processing schema and question configuration
- **Responsibilities**:
  - Combines schema and question definitions
  - Determines field types from Zod schema
  - Builds option arrays for select fields
  - Maintains field ordering from wizard flow

### 6. **types.ts**

- **Purpose**: Type definitions shared across components
- **Contains**:
  - `ReviewField` interface
  - `ZodDefExtras` interface
  - `FormValues` type

## Key Features

- **Modular Architecture**: Each component has a single responsibility
- **Type Safety**: Full TypeScript support with shared type definitions
- **Form Integration**: Seamless integration with React Hook Form
- **Accessibility**: Proper ARIA labels, keyboard navigation, and focus management
- **i18n Support**: Internationalization with react-i18next
- **Schema Processing**: Intelligent field type detection from Zod schemas

## Usage

```tsx
import ReviewStep from '@/components/workflow/ReviewStep';

// The main ReviewStep component automatically uses the modular structure
<ReviewStep doc={document} locale="en" />;
```

## Benefits of This Structure

1. **Maintainability**: Each component focuses on a single concern
2. **Testability**: Components can be tested in isolation
3. **Reusability**: Individual components can be reused in other contexts
4. **Readability**: Smaller, focused files are easier to understand
5. **Performance**: Better tree-shaking and code splitting opportunities
