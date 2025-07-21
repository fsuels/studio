# 123LegalDoc Overview

123LegalDoc is a Next.js application for generating legal documents. It integrates AI-powered flows for document inference and uses Firebase for storage and authentication.

## Architecture

- **Next.js app (`src/`)** – Implements the user interface and routes for the document workflow. Internationalized pages live under `src/app/[locale]`.
- **Legal document engine (`src/lib/documents/`)** – Provides schemas and question sets for each supported document type. Jurisdictional variations are organized under subfolders such as `us/`.
- **AI flows (`src/ai`)** – Uses Genkit and Google AI to infer document types and assist with dynamic questionnaires.
- **Cloud Functions (`functions/`)** – Placeholder for serverless logic. Not all functions are included in this repo but the directory is reserved for Firebase Functions.
- **Scripts (`scripts/`)** – Utility scripts for tasks like generating previews or seeding reviews.

## Development Workflow

1. Install dependencies with `yarn` or `npm install`.
2. Copy your Firebase service account key to `serviceAccountKey.json` and export it as an environment variable as shown in the README.
3. Run the development server with `npm run dev`.
4. Validate your changes before committing:
   ```bash
   npm run lint
   npm run test
   npm run e2e
   npm run build
   ```

## Directory Structure

```text
src/            # Application code
  app/          # Next.js routes
  components/   # Shared UI components
  lib/documents/ # Document definitions and schemas
  ai/           # AI flow definitions
public/         # Static assets
scripts/        # Command line utilities
```

## Additional Notes

- Use React Server Components by default; only add `"use client"` when necessary.
- Replace `<img>` tags with `<AutoImage />` from `src/components`.
- Review `docs/blueprint.md` for design guidelines such as color palette and UI style.
