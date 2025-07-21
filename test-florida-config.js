// Quick test to verify Florida configuration loading
const { loadDocumentConfig, loadComplianceOnly, normalizeJurisdiction } = require('./dist/lib/config-loader/index.js');

async function testFloridaConfig() {
  console.log('🧪 Testing Florida configuration loading...');
  
  try {
    // Test jurisdiction normalization
    const jurisdiction = normalizeJurisdiction('FL');
    console.log('✅ Normalized FL to:', jurisdiction);
    
    // Test compliance loading
    const compliance = await loadComplianceOnly('vehicle-bill-of-sale', jurisdiction);
    console.log('✅ Compliance loaded:', {
      requiresNotary: compliance.requiresNotary,
      officialForm: compliance.officialForm,
      localFormPath: compliance.localFormPath
    });
    
    // Test full config loading
    const fullConfig = await loadDocumentConfig('vehicle-bill-of-sale', jurisdiction);
    console.log('✅ Full config loaded:', {
      docType: fullConfig.docType,
      jurisdiction: fullConfig.jurisdiction,
      hasOverlayConfig: !!fullConfig.overlayConfig,
      questionCount: fullConfig.questions.length
    });
    
    console.log('🎉 Florida configuration is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing Florida config:', error.message);
    console.error('Stack:', error.stack);
  }
}

testFloridaConfig();