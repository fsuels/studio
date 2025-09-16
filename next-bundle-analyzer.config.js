// Bundle Analyzer Configuration for Performance Monitoring
// Run with: npm run analyze

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

module.exports = withBundleAnalyzer;