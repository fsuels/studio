#!/usr/bin/env npx tsx
/**
 * PDF Field Dumper
 * 
 * This utility script extracts all AcroForm field names from a PDF file
 * to help with creating accurate overlay mappings.
 * 
 * Usage:
 *   npx tsx scripts/dump-fields.ts path/to/document.pdf
 *   npx tsx scripts/dump-fields.ts public/forms/vehicle-bill-of-sale/florida/HSMV-82050.pdf
 */

import { PDFDocument } from 'pdf-lib';
import { promises as fs } from 'fs';
import { join } from 'path';

async function dumpPDFFields(pdfPath: string) {
  try {
    console.log(`🔍 Analyzing PDF: ${pdfPath}`);
    
    // Read the PDF file
    const pdfBytes = await fs.readFile(pdfPath);
    console.log(`📄 PDF size: ${(pdfBytes.length / 1024).toFixed(2)} KB`);
    
    // Load the PDF document (ignore encryption for read-only analysis)
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    console.log(`📖 Number of pages: ${pdfDoc.getPageCount()}`);
    
    // Get the form (if it exists)
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    console.log(`📝 Found ${fields.length} form fields:\n`);
    
    if (fields.length === 0) {
      console.log('⚠️  No form fields found in this PDF.');
      console.log('   This PDF may not have interactive form fields.');
      console.log('   You\'ll need to use coordinate-based overlay mapping.');
      return;
    }
    
    // Analyze each field
    const fieldAnalysis = fields.map((field, index) => {
      const fieldName = field.getName();
      const fieldType = field.constructor.name;
      
      // Try to get more detailed field information
      let additionalInfo = '';
      try {
        if ('getText' in field && typeof field.getText === 'function') {
          const currentValue = (field as any).getText();
          if (currentValue) {
            additionalInfo = ` (current: "${currentValue}")`;
          }
        }
      } catch (e) {
        // Ignore errors when getting current value
      }
      
      return {
        index: index + 1,
        name: fieldName,
        type: fieldType,
        info: additionalInfo
      };
    });
    
    // Display field information
    fieldAnalysis.forEach(field => {
      console.log(`${field.index.toString().padStart(2, ' ')}. "${field.name}"`);
      console.log(`    Type: ${field.type}${field.info}`);
      console.log('');
    });
    
    // Generate suggested overlay mapping
    console.log('🔧 Suggested overlay mapping for common fields:');
    console.log('{');
    
    const commonMappings = [
      { field: 'seller_name', patterns: ['seller', 'from', 'grantor', 'name'] },
      { field: 'buyer_name', patterns: ['buyer', 'to', 'grantee', 'purchaser'] },
      { field: 'vehicle_year', patterns: ['year', 'yr'] },
      { field: 'vehicle_make', patterns: ['make', 'manufacturer'] },
      { field: 'vehicle_model', patterns: ['model'] },
      { field: 'vin', patterns: ['vin', 'serial', 'identification'] },
      { field: 'price', patterns: ['price', 'amount', 'cost'] },
      { field: 'date', patterns: ['date'] }
    ];
    
    commonMappings.forEach(mapping => {
      const matchingFields = fieldAnalysis.filter(field => 
        mapping.patterns.some(pattern => 
          field.name.toLowerCase().includes(pattern.toLowerCase())
        )
      );
      
      if (matchingFields.length > 0) {
        const exactMatches = matchingFields.map(f => f.name);
        console.log(`  "${mapping.field}": {`);
        console.log(`    "exact": [${exactMatches.map(m => `"${m}"`).join(', ')}]`);
        console.log(`  },`);
      }
    });
    
    console.log('}');
    
    // Export results to JSON file
    const outputPath = pdfPath.replace('.pdf', '-fields.json');
    const fieldData = {
      pdfPath,
      analyzedAt: new Date().toISOString(),
      pageCount: pdfDoc.getPageCount(),
      fieldCount: fields.length,
      fields: fieldAnalysis,
      suggestedMappings: {}
    };
    
    // Build suggested mappings
    commonMappings.forEach(mapping => {
      const matchingFields = fieldAnalysis.filter(field => 
        mapping.patterns.some(pattern => 
          field.name.toLowerCase().includes(pattern.toLowerCase())
        )
      );
      
      if (matchingFields.length > 0) {
        (fieldData.suggestedMappings as any)[mapping.field] = {
          exact: matchingFields.map(f => f.name)
        };
      }
    });
    
    await fs.writeFile(outputPath, JSON.stringify(fieldData, null, 2));
    console.log(`\n💾 Field analysis saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error analyzing PDF:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Failed to parse')) {
        console.error('   The PDF file appears to be corrupted or invalid.');
      } else if (error.message.includes('ENOENT')) {
        console.error('   The PDF file was not found. Please check the path.');
      }
    }
    
    process.exit(1);
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 1) {
    console.error('Usage: npx tsx scripts/dump-fields.ts <pdf-file-path>');
    console.error('');
    console.error('Examples:');
    console.error('  npx tsx scripts/dump-fields.ts public/forms/vehicle-bill-of-sale/florida/HSMV-82050.pdf');
    console.error('  npx tsx scripts/dump-fields.ts ~/Downloads/contract.pdf');
    process.exit(1);
  }
  
  const pdfPath = args[0];
  
  // Resolve relative paths
  const absolutePath = pdfPath.startsWith('/') ? pdfPath : join(process.cwd(), pdfPath);
  
  // Check if file exists
  try {
    await fs.access(absolutePath);
  } catch (error) {
    console.error(`❌ PDF file not found: ${absolutePath}`);
    process.exit(1);
  }
  
  await dumpPDFFields(absolutePath);
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { dumpPDFFields };