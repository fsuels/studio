#!/usr/bin/env npx tsx
/**
 * PDF Overlay Builder
 * 
 * Generates overlay.json configuration files by analyzing PDF form fields
 * and matching them to document questions.
 * 
 * Usage:
 *   npx tsx scripts/build-overlay.ts <pdf-path> [--state <state>] [--docType <type>]
 *   
 * Example:
 *   npx tsx scripts/build-overlay.ts public/forms/vehicle-bill-of-sale/florida/HSMV-82050.pdf --state FL
 */

import { PDFDocument, PDFTextField, PDFCheckBox } from 'pdf-lib';
import { promises as fs } from 'fs';
import { join, dirname, basename } from 'path';
import { z } from 'zod';
import { OverlayConfigSchema, type OverlayConfig } from '@/lib/config-loader/schemas';
import { vehicleBillOfSaleQuestions } from '@/lib/documents/us/vehicle-bill-of-sale/questions';
import type { Question } from '@/types/documents';

interface FieldInfo {
  name: string;
  type: string;
  page?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface BuildOptions {
  pdfPath: string;
  state?: string;
  docType?: string;
}

/**
 * Extract field information from a PDF
 */
async function extractPDFFields(pdfPath: string): Promise<FieldInfo[]> {
  try {
    const pdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    const fieldInfos: FieldInfo[] = fields.map(field => {
      const fieldName = field.getName();
      const fieldType = field.constructor.name;
      
      // Try to get field position information
      let page: number | undefined;
      let x: number | undefined;
      let y: number | undefined;
      let width: number | undefined;
      let height: number | undefined;
      
      try {
        // This is a simplified approach - actual field position extraction
        // would require more complex PDF parsing
        const widgets = (field as any).acroField?.getWidgets() || [];
        if (widgets.length > 0) {
          const widget = widgets[0];
          const rect = widget.getRectangle();
          if (rect) {
            x = rect.x;
            y = rect.y;
            width = rect.width;
            height = rect.height;
          }
        }
      } catch (e) {
        // Ignore position extraction errors
      }
      
      return {
        name: fieldName,
        type: fieldType,
        page,
        x,
        y,
        width,
        height
      };
    });
    
    return fieldInfos;
  } catch (error) {
    console.error('Error extracting PDF fields:', error);
    throw error;
  }
}

/**
 * Normalize strings for comparison
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Check if a PDF field name matches a question ID
 */
function isFieldMatch(questionId: string, pdfFieldName: string): boolean {
  const normalizedQId = normalizeString(questionId);
  const normalizedField = normalizeString(pdfFieldName);
  
  // Exact match mapping for Florida HSMV-82050 and similar forms
  const exactMatches: Record<string, string[]> = {
    seller_name: ['sellersprintedname'],
    seller2_name: ['cosellersprintednamewhenapplicable'],
    buyer_name: ['purchasersprintedname'],
    buyer2_name: ['copurchasersprintednamewhenapplicable'],
    seller_address: ['sellersaddresscitystatezipcode'],
    seller2_address: ['cosellersaddresswhenapplicablecitystatezipcode'],
    buyer_address: ['addresscitystatezipcode'],
    year: ['year'],
    make: ['makemanufacturer'],
    model: ['model'],
    body_type: ['bodytype'],
    color: ['color'],
    vin: ['vehiclevesselidentificationnumber'],
    odometer: ['odometerDisclosurestatementrequiredforamotorvehicle'],
    current_title_date: ['currenttitleissuedate'],
    sale_date: ['date'],
    county: ['county', 'countyof'],
    state: ['state', 'stateof']
  };
  
  // Check exact matches first
  const exactFieldNames = exactMatches[questionId];
  if (exactFieldNames && exactFieldNames.includes(normalizedField)) {
    return true;
  }
  
  // Special pattern matching for fields not in exact matches
  const patterns: Record<string, string[]> = {
    seller_phone: ['sellerphone', 'sellerphonenumber', 'fromphone'],
    buyer_phone: ['buyerphone', 'buyerphonenumber', 'tophone'],
    seller2_phone: ['cosellerphone'],
    buyer2_phone: ['cobuyerphone', 'copurchaserphone'],
    price: ['price', 'amount', 'cost', 'saleprice', 'purchaseprice', 'total'],
    title_number: ['titlenumber', 'certificatenumber', 'titleno'],
    existing_liens: ['lien', 'lienholder'],
    as_is: ['asis', 'warranty'],
    warranty_text: ['warrantydetails', 'warrantydescription'],
    payment_method: ['paymentmethod', 'methodofpayment'],
    odo_status: ['actualMileage', 'exceedsitsmechanicallimits', 'nottheactualmileage']
  };
  
  // Check pattern-based matching
  const questionPatterns = patterns[questionId];
  if (questionPatterns) {
    return questionPatterns.some(pattern => normalizedField.includes(pattern));
  }
  
  return false;
}

/**
 * Get questions for the specified document type
 */
function getQuestions(docType: string): Question[] {
  switch (docType) {
    case 'vehicle-bill-of-sale':
      return vehicleBillOfSaleQuestions;
    default:
      throw new Error(`Unknown document type: ${docType}`);
  }
}

/**
 * Build overlay configuration
 */
async function buildOverlay(options: BuildOptions): Promise<OverlayConfig> {
  const { pdfPath, state, docType = 'vehicle-bill-of-sale' } = options;
  
  console.log(`🔍 Analyzing PDF: ${pdfPath}`);
  console.log(`📄 Document Type: ${docType}`);
  console.log(`🏛️  State: ${state || 'auto-detect'}`);
  console.log('');
  
  // Extract PDF fields
  const pdfFields = await extractPDFFields(pdfPath);
  console.log(`📝 Found ${pdfFields.length} form fields in PDF\n`);
  
  // Get questions for this document type
  const questions = getQuestions(docType);
  console.log(`❓ Loaded ${questions.length} questions for ${docType}\n`);
  
  // Build field mappings
  const fieldMapping: Record<string, { fieldName: string }> = {};
  const coordinates: Record<string, { page: number; x: number; y: number; fontSize?: number }> = {};
  const unmatchedQuestions: string[] = [];
  
  console.log('🔧 Matching questions to PDF fields:');
  console.log('─'.repeat(60));
  
  for (const question of questions) {
    // Skip button and address type questions
    if (question.type === 'button' || question.type === 'address') {
      continue;
    }
    
    let matched = false;
    
    // Try to find a matching PDF field
    for (const pdfField of pdfFields) {
      if (isFieldMatch(question.id, pdfField.name)) {
        fieldMapping[question.id] = { fieldName: pdfField.name };
        console.log(`✅ ${question.id.padEnd(20)} → "${pdfField.name}"`);
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      unmatchedQuestions.push(question.id);
      console.log(`❌ ${question.id.padEnd(20)} → (no match found)`);
    }
  }
  
  console.log('─'.repeat(60));
  console.log(`\n📊 Coverage Summary:`);
  console.log(`   Matched ${Object.keys(fieldMapping).length}/${questions.filter(q => q.type !== 'button' && q.type !== 'address').length} questions via fieldMapping`);
  console.log(`   Added ${Object.keys(coordinates).length} coordinate fallbacks`);
  console.log(`   Unmatched: ${unmatchedQuestions.length} questions`);
  
  if (unmatchedQuestions.length > 0) {
    console.log(`\n⚠️  Unmatched questions: ${unmatchedQuestions.join(', ')}`);
  }
  
  // Build the relative PDF path for runtime use
  const relativePdfPath = pdfPath.replace(process.cwd(), '').replace(/^\//, '');
  
  // Create overlay configuration
  const overlayConfig: OverlayConfig = {
    pdfPath: '/' + relativePdfPath,
    fieldMapping: Object.keys(fieldMapping).length > 0 ? fieldMapping : undefined,
    coordinates: Object.keys(coordinates).length > 0 ? coordinates : undefined
  };
  
  // Validate the configuration
  try {
    OverlayConfigSchema.parse(overlayConfig);
  } catch (error) {
    console.error('\n❌ Invalid overlay configuration:', error);
    throw error;
  }
  
  return overlayConfig;
}

/**
 * Infer state from file path
 */
function inferState(filePath: string): string | undefined {
  const pathParts = filePath.split('/');
  const pdfIndex = pathParts.findIndex(part => part.endsWith('.pdf'));
  
  if (pdfIndex > 0) {
    const possibleState = pathParts[pdfIndex - 1];
    // Convert state directory names to state codes
    const stateMap: Record<string, string> = {
      'alabama': 'AL',
      'colorado': 'CO',
      'florida': 'FL',
      'georgia': 'GA',
      'idaho': 'ID',
      'kansas': 'KS',
      'maryland': 'MD',
      'montana': 'MT',
      'north-dakota': 'ND',
      'west-virginia': 'WV'
    };
    
    return stateMap[possibleState] || possibleState.toUpperCase();
  }
  
  return undefined;
}

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log('Usage: npx tsx scripts/build-overlay.ts <pdf-path> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --state <state>     US state code (e.g., FL, CA)');
    console.log('  --docType <type>    Document type (default: vehicle-bill-of-sale)');
    console.log('');
    console.log('Example:');
    console.log('  npx tsx scripts/build-overlay.ts public/forms/vehicle-bill-of-sale/florida/HSMV-82050.pdf --state FL');
    process.exit(args[0] === '--help' ? 0 : 1);
  }
  
  const pdfPath = args[0];
  let state: string | undefined;
  let docType = 'vehicle-bill-of-sale';
  
  // Parse command line options
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--state' && i + 1 < args.length) {
      state = args[i + 1].toUpperCase();
      i++;
    } else if (args[i] === '--docType' && i + 1 < args.length) {
      docType = args[i + 1];
      i++;
    }
  }
  
  // Infer state from path if not provided
  if (!state) {
    state = inferState(pdfPath);
  }
  
  if (!state) {
    console.error('❌ Could not determine state. Please provide --state option.');
    process.exit(1);
  }
  
  // Resolve absolute path
  const absolutePath = pdfPath.startsWith('/') ? pdfPath : join(process.cwd(), pdfPath);
  
  // Check if file exists
  try {
    await fs.access(absolutePath);
  } catch (error) {
    console.error(`❌ PDF file not found: ${absolutePath}`);
    process.exit(1);
  }
  
  try {
    // Build overlay configuration
    const overlayConfig = await buildOverlay({
      pdfPath: absolutePath,
      state,
      docType
    });
    
    // Determine output path
    const outputDir = join(
      process.cwd(),
      'public',
      'assets',
      'us',
      state.toLowerCase(),
      docType
    );
    
    const outputPath = join(outputDir, 'overlay.json');
    
    // Create directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write overlay configuration
    await fs.writeFile(
      outputPath,
      JSON.stringify(overlayConfig, null, 2)
    );
    
    console.log(`\n✅ Overlay configuration saved to: ${outputPath}`);
    
    // Display first 15 lines of generated JSON
    const jsonLines = JSON.stringify(overlayConfig, null, 2).split('\n');
    console.log('\n📄 Generated overlay.json (first 15 lines):');
    console.log('─'.repeat(60));
    console.log(jsonLines.slice(0, 15).join('\n'));
    if (jsonLines.length > 15) {
      console.log('...');
    }
    console.log('─'.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error building overlay:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}