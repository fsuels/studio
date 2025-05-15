// src/lib/documents/index.ts
// This is the main barrel file for all document configurations.
// It should re-export from jurisdictional barrels (like ./us) and any non-jurisdictional common documents.

export * from './us'; // Exports all US documents
// export * from './ca'; // Example for Canadian documents, if added later

// If you had any truly non-jurisdictional documents that lived directly in src/lib/documents/,
// they would be exported here. However, the current trend is to place them under a jurisdiction (even if 'all' states).
// For example, if 'invoice' was generic:
// export { invoice } from './invoice-generic'; // Assuming a renamed or restructured generic invoice
// But since 'invoice' is listed under 'us/index.ts', it's treated as US-specific for now.
