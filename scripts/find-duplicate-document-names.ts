#!/usr/bin/env ts-node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

interface DocumentInfo {
  id: string;
  path: string;
  names: {
    en?: string;
    es?: string;
    fr?: string;
  };
}

function findMetadataFiles(dir: string): string[] {
  const files: string[] = [];
  
  function scan(currentDir: string) {
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.')) {
        scan(fullPath);
      } else if (item === 'metadata.ts' || item === 'metadata.tsx') {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

function extractDocumentInfo(filePath: string): DocumentInfo | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Extract ID
    const idMatch = content.match(/id:\s*['"`]([^'"`]+)['"`]/);
    if (!idMatch) return null;
    
    const id = idMatch[1];
    
    // Extract translations
    const names: DocumentInfo['names'] = {};
    
    // Look for English name
    const enNameMatch = content.match(/translations:\s*{[\s\S]*?en:\s*{[\s\S]*?name:\s*['"`]([^'"`]+)['"`]/);
    if (enNameMatch) {
      names.en = enNameMatch[1];
    }
    
    // Look for Spanish name
    const esNameMatch = content.match(/translations:\s*{[\s\S]*?es:\s*{[\s\S]*?name:\s*['"`]([^'"`]+)['"`]/);
    if (esNameMatch) {
      names.es = esNameMatch[1];
    }
    
    // Look for French name
    const frNameMatch = content.match(/translations:\s*{[\s\S]*?fr:\s*{[\s\S]*?name:\s*['"`]([^'"`]+)['"`]/);
    if (frNameMatch) {
      names.fr = frNameMatch[1];
    }
    
    return {
      id,
      path: filePath,
      names
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

function findDuplicates() {
  const documentsDir = join(__dirname, '../src/lib/documents');
  const metadataFiles = findMetadataFiles(documentsDir);
  
  console.log(`Found ${metadataFiles.length} metadata files\n`);
  
  const documents: DocumentInfo[] = [];
  
  // Extract info from all files
  for (const file of metadataFiles) {
    const info = extractDocumentInfo(file);
    if (info) {
      documents.push(info);
    }
  }
  
  // Group by name (case insensitive)
  const nameGroups: Map<string, DocumentInfo[]> = new Map();
  
  for (const doc of documents) {
    for (const [lang, name] of Object.entries(doc.names)) {
      if (name) {
        const normalizedName = name.toLowerCase().trim();
        if (!nameGroups.has(normalizedName)) {
          nameGroups.set(normalizedName, []);
        }
        nameGroups.get(normalizedName)!.push(doc);
      }
    }
  }
  
  // Find duplicates
  console.log('=== DUPLICATE DOCUMENT NAMES ===\n');
  
  let duplicatesFound = false;
  
  for (const [name, docs] of nameGroups.entries()) {
    if (docs.length > 1) {
      duplicatesFound = true;
      console.log(`Name: "${name}"`);
      console.log('Found in:');
      
      // Remove duplicates from same document
      const uniqueDocs = Array.from(new Set(docs.map(d => d.id)))
        .map(id => docs.find(d => d.id === id)!);
      
      for (const doc of uniqueDocs) {
        const relativePath = doc.path.replace(documentsDir, '').replace(/^\//, '');
        console.log(`  - ${doc.id} (${relativePath})`);
        
        // Show all language variants
        for (const [lang, langName] of Object.entries(doc.names)) {
          if (langName && langName.toLowerCase().trim() === name) {
            console.log(`    ${lang}: ${langName}`);
          }
        }
      }
      console.log();
    }
  }
  
  if (!duplicatesFound) {
    console.log('No duplicate document names found!');
  }
  
  // Also check for similar names (might be unintentional duplicates)
  console.log('\n=== SIMILAR DOCUMENT NAMES ===\n');
  
  const allNames = Array.from(nameGroups.keys());
  let similarFound = false;
  
  for (let i = 0; i < allNames.length; i++) {
    for (let j = i + 1; j < allNames.length; j++) {
      const name1 = allNames[i];
      const name2 = allNames[j];
      
      // Check if names are similar but not identical
      if (areSimilar(name1, name2)) {
        similarFound = true;
        console.log(`Similar names detected:`);
        console.log(`  "${name1}" vs "${name2}"`);
        
        const docs1 = nameGroups.get(name1)!;
        const docs2 = nameGroups.get(name2)!;
        
        console.log('  Documents:');
        for (const doc of [...new Set([...docs1, ...docs2])]) {
          console.log(`    - ${doc.id}`);
        }
        console.log();
      }
    }
  }
  
  if (!similarFound) {
    console.log('No similar document names found!');
  }
}

function areSimilar(str1: string, str2: string): boolean {
  // Remove common variations
  const normalize = (s: string) => s
    .replace(/\s+/g, ' ')
    .replace(/[()]/g, '')
    .replace(/\bagreement\b/gi, '')
    .replace(/\bletter\b/gi, '')
    .replace(/\bform\b/gi, '')
    .trim();
  
  const n1 = normalize(str1);
  const n2 = normalize(str2);
  
  // Check if one contains the other
  if (n1.includes(n2) || n2.includes(n1)) {
    return true;
  }
  
  // Check Levenshtein distance for very similar strings
  const distance = levenshteinDistance(n1, n2);
  const maxLength = Math.max(n1.length, n2.length);
  const similarity = 1 - (distance / maxLength);
  
  return similarity > 0.8; // 80% similar
}

function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }
  
  return dp[m][n];
}

// Run the script
findDuplicates();