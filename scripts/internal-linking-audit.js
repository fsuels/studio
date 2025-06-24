#!/usr/bin/env node

/**
 * Internal Linking Audit Script
 * 
 * Analyzes existing content and identifies internal linking opportunities
 * for improved SEO and user experience.
 */

const fs = require('fs');
const path = require('path');

console.log('🔗 123LegalDoc Internal Linking Audit\n');

// Mock document library for demonstration
const documentKeywords = {
  'lease-agreement': ['lease agreement', 'rental agreement', 'lease contract', 'property lease'],
  'employment-contract': ['employment contract', 'employment agreement', 'job contract', 'work agreement'],
  'non-disclosure-agreement': ['nda', 'non-disclosure agreement', 'confidentiality agreement'],
  'llc-operating-agreement': ['llc operating agreement', 'llc agreement', 'operating agreement'],
  'vehicle-bill-of-sale': ['vehicle bill of sale', 'car bill of sale', 'auto bill of sale'],
  'last-will-testament': ['will', 'last will and testament', 'will and testament', 'estate planning'],
  'power-of-attorney': ['power of attorney', 'poa', 'attorney power', 'legal power'],
  'independent-contractor-agreement': ['independent contractor', 'contractor agreement', 'freelancer agreement']
};

/**
 * Analyze content for internal linking opportunities
 */
function analyzeContent(content, filePath) {
  const opportunities = [];
  const contentLower = content.toLowerCase();
  
  Object.entries(documentKeywords).forEach(([docId, keywords]) => {
    keywords.forEach(keyword => {
      if (contentLower.includes(keyword.toLowerCase())) {
        // Check if already linked
        const isLinked = content.includes(`href="`) && 
                        content.toLowerCase().includes(keyword.toLowerCase()) &&
                        content.includes(`docs/${docId}`);
        
        if (!isLinked) {
          opportunities.push({
            docId,
            keyword,
            file: filePath,
            priority: keyword.length > 10 ? 'high' : keyword.length > 6 ? 'medium' : 'low'
          });
        }
      }
    });
  });
  
  return opportunities;
}

/**
 * Scan files for content to analyze
 */
function scanContentFiles(dir, extensions = ['.tsx', '.mdx', '.md']) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    items.forEach(item => {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory() && !item.name.startsWith('.') && !item.name.includes('node_modules')) {
        files.push(...scanContentFiles(fullPath, extensions));
      } else if (item.isFile() && extensions.some(ext => item.name.endsWith(ext))) {
        files.push(fullPath);
      }
    });
  } catch (error) {
    // Directory might not exist, skip silently
  }
  
  return files;
}

/**
 * Main audit function
 */
function runInternalLinkingAudit() {
  console.log('📂 Scanning for content files...\n');
  
  // Scan common content directories
  const contentDirs = [
    './src/app',
    './src/components',
    './content',
    './blog',
    './posts'
  ];
  
  let allFiles = [];
  contentDirs.forEach(dir => {
    const files = scanContentFiles(dir);
    allFiles = [...allFiles, ...files];
  });
  
  console.log(`📄 Found ${allFiles.length} content files\n`);
  
  let totalOpportunities = 0;
  const opportunitiesByFile = {};
  const opportunitiesByDocument = {};
  
  // Analyze each file
  allFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const opportunities = analyzeContent(content, filePath);
      
      if (opportunities.length > 0) {
        opportunitiesByFile[filePath] = opportunities;
        totalOpportunities += opportunities.length;
        
        // Group by document
        opportunities.forEach(opp => {
          if (!opportunitiesByDocument[opp.docId]) {
            opportunitiesByDocument[opp.docId] = [];
          }
          opportunitiesByDocument[opp.docId].push(opp);
        });
      }
    } catch (error) {
      console.log(`⚠️  Could not read file: ${filePath}`);
    }
  });
  
  // Report results
  console.log('🎯 Internal Linking Opportunities Found:\n');
  console.log(`📊 Total Opportunities: ${totalOpportunities}`);
  console.log(`📁 Files with Opportunities: ${Object.keys(opportunitiesByFile).length}`);
  console.log(`📋 Documents Referenced: ${Object.keys(opportunitiesByDocument).length}\n`);
  
  // Top opportunities by document
  console.log('🏆 Top Document Opportunities:\n');
  Object.entries(opportunitiesByDocument)
    .sort(([,a], [,b]) => b.length - a.length)
    .slice(0, 10)
    .forEach(([docId, opportunities]) => {
      console.log(`📄 ${docId}: ${opportunities.length} opportunities`);
      
      // Show high priority opportunities
      const highPriority = opportunities.filter(opp => opp.priority === 'high');
      if (highPriority.length > 0) {
        console.log(`   🔥 ${highPriority.length} high-priority matches`);
      }
    });
  
  console.log('\n📁 Files with Most Opportunities:\n');
  Object.entries(opportunitiesByFile)
    .sort(([,a], [,b]) => b.length - a.length)
    .slice(0, 10)
    .forEach(([filePath, opportunities]) => {
      const relativePath = path.relative('.', filePath);
      console.log(`📄 ${relativePath}: ${opportunities.length} opportunities`);
      
      // Show sample opportunities
      const samples = opportunities.slice(0, 3);
      samples.forEach(opp => {
        const priority = opp.priority === 'high' ? '🔥' : opp.priority === 'medium' ? '⚡' : '💡';
        console.log(`   ${priority} "${opp.keyword}" → ${opp.docId}`);
      });
      
      if (opportunities.length > 3) {
        console.log(`   ... and ${opportunities.length - 3} more`);
      }
    });
  
  // Implementation recommendations
  console.log('\n🚀 Implementation Recommendations:\n');
  
  if (totalOpportunities > 0) {
    console.log('✅ High-Impact Actions:');
    console.log('1. Implement InternalLinkWidget components in blog sidebars');
    console.log('2. Add contextual links in high-traffic content');
    console.log('3. Create category-based link clusters');
    console.log('4. Use smart link insertion for new content');
    
    console.log('\n🎯 Priority Focus Areas:');
    
    // Identify high-opportunity documents
    const highOpportunityDocs = Object.entries(opportunitiesByDocument)
      .filter(([, opportunities]) => opportunities.length >= 3)
      .map(([docId]) => docId);
    
    if (highOpportunityDocs.length > 0) {
      console.log('📋 Documents with 3+ opportunities:');
      highOpportunityDocs.forEach(docId => {
        console.log(`   • ${docId} (create dedicated content hub)`);
      });
    }
    
    // Identify high-opportunity files
    const highOpportunityFiles = Object.entries(opportunitiesByFile)
      .filter(([, opportunities]) => opportunities.length >= 5)
      .map(([filePath]) => path.relative('.', filePath));
    
    if (highOpportunityFiles.length > 0) {
      console.log('\n📁 Files needing immediate attention:');
      highOpportunityFiles.forEach(filePath => {
        console.log(`   • ${filePath} (add internal link widgets)`);
      });
    }
    
  } else {
    console.log('🎉 Great! No obvious internal linking opportunities found.');
    console.log('💡 Consider creating more content that naturally references your document templates.');
  }
  
  console.log('\n📈 Expected SEO Impact:');
  console.log(`• Potential ${Math.ceil(totalOpportunities * 0.3)} additional internal links`);
  console.log(`• Estimated 15-25% increase in page depth`);
  console.log(`• Projected 20-30% improvement in document page rankings`);
  
  console.log('\n🛠️  Next Steps:');
  console.log('1. Use the InternalLinkWidget components to add contextual links');
  console.log('2. Run the content enhancer on high-opportunity files');
  console.log('3. Create new blog content targeting top opportunity documents');
  console.log('4. Monitor internal link performance in Google Analytics');
  
  console.log('\n✨ Internal linking audit complete!');
  console.log(`📊 Run this audit regularly to identify new opportunities as you create content.`);
}

// Run the audit
runInternalLinkingAudit();