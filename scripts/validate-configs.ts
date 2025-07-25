#!/usr/bin/env node
// scripts/validate-configs.ts
// Validates all JSON configuration files against Zod schemas

import { validateDocumentConfig } from '../src/lib/config-loader/schemas';
import fs from 'node:fs/promises';
import path from 'node:path';
import glob from 'fast-glob';

async function validateAllConfigs() {
  console.log('🔍 Validating all configuration files...\n');
  
  let hasErrors = false;
  
  try {
    // Find all config.json files
    const configFiles = await glob('public/assets/**/*.json', {
      cwd: path.resolve(__dirname, '..'),
      absolute: true
    });
    
    console.log(`Found ${configFiles.length} configuration files to validate:\n`);
    
    for (const filePath of configFiles) {
      const relativePath = path.relative(process.cwd(), filePath);
      
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const rawConfig = JSON.parse(content);
        
        // Skip non-document configs (like fields.json files)
        if (!rawConfig.jurisdiction || !rawConfig.docType) {
          console.log(`⏭️  ${relativePath} (not a document config)`);
          continue;
        }
        
        // Validate against schema
        validateDocumentConfig(rawConfig);
        console.log(`✅ ${relativePath}`);
        
        // Additional checks
        if (rawConfig.overlayConfig) {
          const hasValidMapping = 
            (rawConfig.overlayConfig.fieldMapping && Object.keys(rawConfig.overlayConfig.fieldMapping).length > 0) ||
            (rawConfig.overlayConfig.coordinates && Object.keys(rawConfig.overlayConfig.coordinates).length > 0) ||
            (rawConfig.overlayConfig.fieldMappings && rawConfig.overlayConfig.fieldMappings.length > 0);
            
          if (!hasValidMapping) {
            console.log(`   ⚠️  Warning: overlayConfig has no valid mappings`);
          }
        }
        
      } catch (error) {
        hasErrors = true;
        console.error(`❌ ${relativePath}`);
        
        if (error instanceof Error) {
          const errorMessage = error.message.split('\n').map(line => `   ${line}`).join('\n');
          console.error(errorMessage);
        }
        console.error('');
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`   Total configs: ${configFiles.length}`);
    console.log(`   Status: ${hasErrors ? '❌ FAILED' : '✅ PASSED'}`);
    
    // Check for required configs
    console.log('\n🔍 Checking required configurations:');
    const requiredConfigs = [
      'public/assets/us/florida/vehicle-bill-of-sale/config.json',
      'public/assets/us/alabama/vehicle-bill-of-sale/config.json',
      'public/assets/us/colorado/power-of-attorney/config.json',
      'public/assets/us/generic/non-disclosure-agreement/config.json'
    ];
    
    for (const required of requiredConfigs) {
      const fullPath = path.resolve(__dirname, '..', required);
      try {
        await fs.access(fullPath);
        console.log(`✅ ${required}`);
      } catch {
        console.log(`❌ ${required} - MISSING!`);
        hasErrors = true;
      }
    }
    
    process.exitCode = hasErrors ? 1 : 0;
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exitCode = 1;
  }
}

// Run validation
validateAllConfigs();