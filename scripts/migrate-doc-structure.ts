
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const ROOT_DIR = process.cwd();
const SRC_LIB_DOCUMENTS_DIR = path.join(ROOT_DIR, 'src', 'lib', 'documents');

interface DocumentToMigrate {
  docId: string;
  oldPathRoot?: string; // Base path where old files might be (e.g., 'src/lib/documents')
  oldFiles?: { // More specific paths if not simply {oldPathRoot}/{fileType}
    metadata?: string;
    questions?: string;
    schema?: string;
    index?: string; // Barrel file for the doc
  };
  targetCountry: string;
}

// --- Configuration: Define documents to migrate/verify ---
// For existing documents already in the new structure, this script will effectively verify them.
// For documents in older/flatter structures, specify their old paths.
const DOCUMENTS_TO_PROCESS: DocumentToMigrate[] = [
  {
    docId: 'bill-of-sale-vehicle',
    oldPathRoot: path.join(SRC_LIB_DOCUMENTS_DIR, 'us', 'vehicle-bill-of-sale'), // Current location
    targetCountry: 'us',
  },
  {
    docId: 'promissory-note',
    oldPathRoot: path.join(SRC_LIB_DOCUMENTS_DIR, 'us', 'promissory-note'), // Current location
    targetCountry: 'us',
  },
  {
    docId: 'lease-agreement', // Example: if it was at src/lib/documents/lease-agreement.ts
    oldFiles: {
      metadata: path.join(SRC_LIB_DOCUMENTS_DIR, 'lease-agreement.ts'), // Assuming metadata was the main file
    },
    targetCountry: 'us',
  },
  {
    docId: 'invoice', // Example: if it was at src/lib/documents/invoice.ts
    oldFiles: {
      metadata: path.join(SRC_LIB_DOCUMENTS_DIR, 'invoice.ts'), // Assuming metadata was the main file
    },
    targetCountry: 'us',
  },
  {
    docId: 'promissory-note-ca', // Canadian promissory note
    oldPathRoot: path.join(SRC_LIB_DOCUMENTS_DIR, 'ca', 'promissory-note'), // Current location
    targetCountry: 'ca',
  }
  // Add other documents here
];

const FILE_TYPES_TO_PROCESS = ['metadata.ts', 'questions.ts', 'schema.ts', 'index.ts'];

function calculateHash(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

async function migrateDocuments() {
  console.log('Starting document structure migration...\n');

  for (const doc of DOCUMENTS_TO_PROCESS) {
    console.log(`Processing document: ${doc.docId} for country: ${doc.targetCountry}`);
    const newDocDir = path.join(SRC_LIB_DOCUMENTS_DIR, doc.targetCountry, doc.docId);

    if (!fs.existsSync(newDocDir)) {
      fs.mkdirSync(newDocDir, { recursive: true });
      console.log(`  Created directory: ${newDocDir}`);
    } else {
      console.log(`  Directory already exists: ${newDocDir}`);
    }

    for (const fileType of FILE_TYPES_TO_PROCESS) {
      const newFilePath = path.join(newDocDir, fileType);
      let oldFilePath: string | undefined = undefined;
      let oldFileSourceDescription: string = '';

      if (doc.oldFiles && doc.oldFiles[fileType.replace('.ts', '') as keyof DocumentToMigrate['oldFiles']]) {
        oldFilePath = doc.oldFiles[fileType.replace('.ts', '') as keyof DocumentToMigrate['oldFiles']];
        oldFileSourceDescription = `specified old path ${oldFilePath}`;
      } else if (doc.oldPathRoot) {
        // Try direct file in oldPathRoot (e.g. oldPathRoot/metadata.ts for lease-agreement.ts)
        // Or, try docId-suffixed name if that was the old pattern (e.g. oldPathRoot/invoice-metadata.ts)
        // Or, try within a docId subfolder of oldPathRoot (e.g. oldPathRoot/invoice/metadata.ts)
        const potentialOldPaths = [
          path.join(doc.oldPathRoot, fileType), // e.g., src/lib/documents/us/vehicle-bill-of-sale/metadata.ts
          path.join(doc.oldPathRoot, `${doc.docId}-${fileType}`), // Less likely given current structure
        ];
        if (doc.oldPathRoot.endsWith(doc.docId)) { // Handles cases like oldPathRoot = '.../us/vehicle-bill-of-sale'
           potentialOldPaths.unshift(path.join(doc.oldPathRoot, fileType));
        } else { // Handles cases like oldPathRoot = 'src/lib/documents' for a file named 'lease-agreement.ts'
          if (fileType === 'metadata.ts') { // Assume the main file IS the metadata
            potentialOldPaths.unshift(doc.oldPathRoot.endsWith('.ts') ? doc.oldPathRoot : `${doc.oldPathRoot}.ts`);
          }
        }


        oldFilePath = potentialOldPaths.find(p => fs.existsSync(p));
        if (oldFilePath) {
          oldFileSourceDescription = `detected old path ${oldFilePath}`;
        } else {
           oldFileSourceDescription = `various potential old paths (none found)`;
        }
      }


      if (oldFilePath && fs.existsSync(oldFilePath) && oldFilePath !== newFilePath) {
        const oldHash = calculateHash(oldFilePath);
        console.log(`  Attempting to move ${oldFilePath} to ${newFilePath}`);
        ensureDirectoryExistence(newFilePath); // Ensure parent directory of newFilePath exists
        try {
          fs.renameSync(oldFilePath, newFilePath);
          const newHash = calculateHash(newFilePath);
          if (oldHash === newHash) {
            console.log(`    ✅ Moved ${fileType}. Old SHA256: ${oldHash ? oldHash.substring(0,7) : 'N/A'}. New SHA256: ${newHash ? newHash.substring(0,7) : 'N/A'}.`);
          } else {
            console.error(`    ❌ ERROR: Hash mismatch for ${fileType} after moving. Aborting for this file.`);
            // Optionally, move back: fs.renameSync(newFilePath, oldFilePath);
          }
        } catch (moveError) {
          console.error(`    ❌ ERROR: Could not move ${oldFilePath} to ${newFilePath}:`, moveError);
        }
      } else if (fs.existsSync(newFilePath)) {
        const hash = calculateHash(newFilePath);
        console.log(`    ℹ️ ${fileType} already exists at ${newFilePath}. SHA256: ${hash ? hash.substring(0,7) : 'N/A'}.`);
      } else {
        fs.writeFileSync(newFilePath, `// TODO: Implement ${doc.docId}/${fileType}\n// Source: Could not find at ${oldFileSourceDescription}\n\nexport {};\n`);
        console.log(`    📝 Created stub for ${fileType} at ${newFilePath} (source not found at ${oldFileSourceDescription}).`);
      }
    }
    console.log(`  Finished processing ${doc.docId}.\n`);
  }
  console.log('Document structure migration/verification complete.');
}

migrateDocuments().catch(console.error);
