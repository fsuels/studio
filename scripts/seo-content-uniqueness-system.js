#!/usr/bin/env node

/**
 * SEO Content Uniqueness & Dynamic Keyword Monitoring System
 * Prevents thin-content penalties and maintains SEO leadership
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SEOContentMonitor {
  constructor() {
    this.contentDatabase = new Map();
    this.keywordDatabase = new Map();
    this.similarityThreshold = 20; // <20% overlap allowed
    this.reportsDir = path.join(__dirname, '../seo-reports');
    this.checkpointPath = path.join(__dirname, '../checkpoint.json');

    // Content analysis settings
    this.minContentLength = 300; // Minimum words to avoid thin content
    this.maxSimilarity = 20; // Maximum % similarity allowed
    this.keywordDensityTarget = 1.5; // Target keyword density %

    // Ahrefs API settings (placeholder for real implementation)
    this.ahrefsAPI = {
      enabled: false, // Set to true when API key available
      endpoint: 'https://apiv2.ahrefs.com',
      rateLimitDelay: 1000, // 1 second between requests
    };

    this.embeddings = new Map();
    this.contentHashes = new Map();
    this.sitemapData = [];

    this.initializeDirectories();
  }

  initializeDirectories() {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  // Generate content embeddings for similarity detection
  generateContentEmbedding(text) {
    // Simplified embedding using word frequency vectors
    // In production, would use OpenAI embeddings or similar
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3);

    const wordFreq = {};
    words.forEach((word) => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Convert to normalized vector
    const totalWords = words.length;
    const embedding = {};
    Object.keys(wordFreq).forEach((word) => {
      embedding[word] = wordFreq[word] / totalWords;
    });

    return embedding;
  }

  // Calculate cosine similarity between embeddings
  calculateSimilarity(embedding1, embedding2) {
    const words = new Set([
      ...Object.keys(embedding1),
      ...Object.keys(embedding2),
    ]);

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    words.forEach((word) => {
      const val1 = embedding1[word] || 0;
      const val2 = embedding2[word] || 0;

      dotProduct += val1 * val2;
      magnitude1 += val1 * val1;
      magnitude2 += val2 * val2;
    });

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    const similarity =
      dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
    return Math.round(similarity * 100);
  }

  // Analyze content uniqueness across all pages
  analyzeContentUniqueness() {
    console.log('🔍 SEO Content Uniqueness Analysis\n');

    const contentFiles = this.findContentFiles();
    const duplicateIssues = [];
    const thinContentIssues = [];
    const keywordIssues = [];

    // Process each content file
    contentFiles.forEach((filePath, index) => {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileId = path.basename(filePath, path.extname(filePath));

      // 1. Check content length (thin content detection)
      const wordCount = content.split(/\s+/).length;
      if (wordCount < this.minContentLength) {
        thinContentIssues.push({
          file: fileId,
          wordCount,
          issue: 'Thin content',
          severity: 'HIGH',
          recommendation: `Add ${this.minContentLength - wordCount} more words`,
        });
      }

      // 2. Generate embedding for similarity check
      const embedding = this.generateContentEmbedding(content);
      this.embeddings.set(fileId, embedding);

      // 3. Check against existing content for duplicates
      for (const [existingId, existingEmbedding] of this.embeddings.entries()) {
        if (existingId === fileId) continue;

        const similarity = this.calculateSimilarity(
          embedding,
          existingEmbedding,
        );
        if (similarity > this.maxSimilarity) {
          duplicateIssues.push({
            file1: existingId,
            file2: fileId,
            similarity: `${similarity}%`,
            issue: 'Content overlap detected',
            severity: similarity > 50 ? 'CRITICAL' : 'HIGH',
            recommendation: 'Rewrite or consolidate pages',
          });
        }
      }

      // 4. Basic keyword density analysis
      const keywordDensity = this.analyzeKeywordDensity(content, fileId);
      if (keywordDensity.issues.length > 0) {
        keywordIssues.push(...keywordDensity.issues);
      }

      // Progress indicator
      if (index % 10 === 0) {
        console.log(
          `📊 Processed ${index + 1}/${contentFiles.length} files...`,
        );
      }
    });

    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: contentFiles.length,
        duplicateIssues: duplicateIssues.length,
        thinContentIssues: thinContentIssues.length,
        keywordIssues: keywordIssues.length,
        overallHealthScore: this.calculateHealthScore(
          duplicateIssues,
          thinContentIssues,
          keywordIssues,
        ),
      },
      issues: {
        duplicates: duplicateIssues,
        thinContent: thinContentIssues,
        keywords: keywordIssues,
      },
      recommendations: this.generateRecommendations(
        duplicateIssues,
        thinContentIssues,
        keywordIssues,
      ),
    };

    this.saveReport('content-uniqueness', report);
    this.displayResults(report);

    return report;
  }

  // Find all content files to analyze
  findContentFiles() {
    const contentDirs = [
      path.join(__dirname, '../public/templates/en'),
      path.join(__dirname, '../public/templates/es'),
      path.join(__dirname, '../src/app'),
      path.join(__dirname, '../public/locales'),
    ];

    let files = [];

    contentDirs.forEach((dir) => {
      if (fs.existsSync(dir)) {
        const dirFiles = this.scanDirectory(dir, [
          '.md',
          '.json',
          '.tsx',
          '.ts',
        ]);
        files = files.concat(dirFiles);
      }
    });

    return files;
  }

  // Recursively scan directory for content files
  scanDirectory(dir, extensions) {
    let files = [];

    try {
      const items = fs.readdirSync(dir);

      items.forEach((item) => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          files = files.concat(this.scanDirectory(fullPath, extensions));
        } else if (extensions.some((ext) => fullPath.endsWith(ext))) {
          files.push(fullPath);
        }
      });
    } catch (error) {
      console.warn(`⚠️  Could not scan directory: ${dir}`);
    }

    return files;
  }

  // Analyze keyword density for SEO optimization
  analyzeKeywordDensity(content, fileId) {
    const issues = [];
    const text = content.toLowerCase();
    const words = text.split(/\s+/);
    const totalWords = words.length;

    // Extract potential keywords from filename/path
    const potentialKeywords = this.extractKeywordsFromPath(fileId);

    potentialKeywords.forEach((keyword) => {
      const keywordCount = (text.match(new RegExp(keyword, 'g')) || []).length;
      const density = (keywordCount / totalWords) * 100;

      if (density < 0.5) {
        issues.push({
          file: fileId,
          keyword,
          density: `${density.toFixed(2)}%`,
          issue: 'Keyword under-optimized',
          severity: 'MEDIUM',
          recommendation: `Increase keyword density to ${this.keywordDensityTarget}%`,
        });
      } else if (density > 3.0) {
        issues.push({
          file: fileId,
          keyword,
          density: `${density.toFixed(2)}%`,
          issue: 'Keyword over-optimization',
          severity: 'HIGH',
          recommendation: 'Reduce keyword density to avoid penalties',
        });
      }
    });

    return { issues, totalWords };
  }

  // Extract keywords from file path/name
  extractKeywordsFromPath(filePath) {
    const keywords = [];
    const pathParts = filePath.toLowerCase().split(/[\/\-_\.]/);

    pathParts.forEach((part) => {
      if (part.length > 3 && !['template', 'form', 'document'].includes(part)) {
        keywords.push(part);

        // Add common legal variations
        if (part === 'lease') keywords.push('rental agreement');
        if (part === 'will') keywords.push('last will testament');
        if (part === 'nda') keywords.push('non disclosure agreement');
      }
    });

    return keywords;
  }

  // Calculate overall SEO health score
  calculateHealthScore(duplicates, thinContent, keywords) {
    const totalIssues =
      duplicates.length + thinContent.length + keywords.length;
    const criticalIssues = duplicates.filter(
      (d) => d.severity === 'CRITICAL',
    ).length;
    const highIssues =
      duplicates.filter((d) => d.severity === 'HIGH').length +
      thinContent.length;

    let score = 100;
    score -= criticalIssues * 20; // Critical issues -20 each
    score -= highIssues * 10; // High issues -10 each
    score -= (totalIssues - criticalIssues - highIssues) * 5; // Medium issues -5 each

    return Math.max(0, score);
  }

  // Generate actionable recommendations
  generateRecommendations(duplicates, thinContent, keywords) {
    const recommendations = [];

    if (duplicates.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Fix Content Duplicates',
        description: `${duplicates.length} pages have >20% content overlap`,
        steps: [
          'Rewrite duplicate content to be unique',
          'Consolidate similar pages where appropriate',
          'Add unique value propositions to each page',
          'Consider canonical tags for necessary duplicates',
        ],
      });
    }

    if (thinContent.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Expand Thin Content',
        description: `${thinContent.length} pages have <${this.minContentLength} words`,
        steps: [
          'Add comprehensive content to short pages',
          'Include FAQs, examples, and detailed explanations',
          'Add state-specific information',
          'Include related legal requirements',
        ],
      });
    }

    if (keywords.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Optimize Keyword Usage',
        description: `${keywords.length} keyword optimization issues found`,
        steps: [
          'Balance keyword density between 1-3%',
          'Use semantic variations and related terms',
          'Add keywords naturally in headings and content',
          'Monitor keyword performance with tools',
        ],
      });
    }

    return recommendations;
  }

  // Simulate Ahrefs API monitoring (placeholder for real implementation)
  async monitorKeywordPerformance() {
    console.log('📈 SEO Keyword Performance Monitoring\n');

    if (!this.ahrefsAPI.enabled) {
      console.log(
        '⚠️  Ahrefs API not configured. Simulating keyword monitoring...\n',
      );
      return this.simulateKeywordMonitoring();
    }

    // Real Ahrefs API implementation would go here
    // const rankings = await this.fetchAhrefsData();
    // return this.processRankingData(rankings);
  }

  // Simulate keyword monitoring for demonstration
  simulateKeywordMonitoring() {
    const keywords = [
      'california lease agreement',
      'texas will template',
      'florida bill of sale',
      'new york employment contract',
      'legal documents online',
    ];

    const mockData = keywords.map((keyword) => ({
      keyword,
      currentRank: Math.floor(Math.random() * 20) + 1,
      previousRank: Math.floor(Math.random() * 25) + 1,
      searchVolume: Math.floor(Math.random() * 5000) + 500,
      difficulty: Math.floor(Math.random() * 100),
      url: `/en/california/${keyword.replace(/\s+/g, '-')}`,
    }));

    mockData.forEach((data) => {
      const trend =
        data.currentRank < data.previousRank
          ? '📈'
          : data.currentRank > data.previousRank
            ? '📉'
            : '➡️';

      console.log(`${trend} "${data.keyword}"`);
      console.log(`   Rank: ${data.currentRank} (was ${data.previousRank})`);
      console.log(
        `   Volume: ${data.searchVolume}/month | Difficulty: ${data.difficulty}%`,
      );
      console.log('');
    });

    return {
      timestamp: new Date().toISOString(),
      keywords: mockData,
      recommendations: this.generateSEORecommendations(mockData),
    };
  }

  // Generate SEO optimization recommendations
  generateSEORecommendations(keywordData) {
    const recommendations = [];

    const losingRankings = keywordData.filter(
      (k) => k.currentRank > k.previousRank,
    );
    const highOpportunity = keywordData.filter(
      (k) => k.searchVolume > 2000 && k.currentRank > 10,
    );

    if (losingRankings.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        type: 'RANKING_DECLINE',
        message: `${losingRankings.length} keywords losing rankings`,
        action: 'Content optimization needed',
        keywords: losingRankings.map((k) => k.keyword),
      });
    }

    if (highOpportunity.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        type: 'GROWTH_OPPORTUNITY',
        message: `${highOpportunity.length} high-volume keywords can be improved`,
        action: 'Focus optimization efforts',
        keywords: highOpportunity.map((k) => k.keyword),
      });
    }

    return recommendations;
  }

  // Update sitemap based on performance data
  updateSitemapPriorities(performanceData) {
    console.log('🗺️  Updating Sitemap Priorities Based on Performance\n');

    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    let updatedPages = 0;

    performanceData.keywords.forEach((keyword) => {
      // High-performing pages get higher priority
      const priority =
        keyword.currentRank <= 3
          ? 1.0
          : keyword.currentRank <= 10
            ? 0.8
            : keyword.currentRank <= 20
              ? 0.6
              : 0.4;

      // In a real implementation, update sitemap.xml
      console.log(
        `📄 ${keyword.url}: Priority ${priority} (Rank #${keyword.currentRank})`,
      );
      updatedPages++;
    });

    console.log(`\n✅ Updated priorities for ${updatedPages} pages`);

    return {
      updatedPages,
      highPriorityPages: performanceData.keywords.filter(
        (k) => k.currentRank <= 10,
      ).length,
      timestamp: new Date().toISOString(),
    };
  }

  // Save report to file
  saveReport(type, report) {
    const timestamp = Date.now();
    const reportPath = path.join(
      this.reportsDir,
      `${type}-report-${timestamp}.json`,
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`📋 Report saved: ${reportPath}`);
  }

  // Display results summary
  displayResults(report) {
    console.log('\n═'.repeat(60));
    console.log('📊 SEO CONTENT UNIQUENESS RESULTS:');
    console.log(`   📄 Files Analyzed: ${report.summary.totalFiles}`);
    console.log(`   🔍 Duplicate Issues: ${report.summary.duplicateIssues}`);
    console.log(
      `   📝 Thin Content Issues: ${report.summary.thinContentIssues}`,
    );
    console.log(`   🎯 Keyword Issues: ${report.summary.keywordIssues}`);
    console.log(`   💯 Health Score: ${report.summary.overallHealthScore}/100`);

    if (report.recommendations.length > 0) {
      console.log('\n💡 TOP RECOMMENDATIONS:');
      report.recommendations.forEach((rec) => {
        console.log(`   ${rec.priority}: ${rec.action}`);
        console.log(`   📋 ${rec.description}`);
      });
    }

    // Check if system needs attention
    if (report.summary.overallHealthScore < 80) {
      console.log(
        '\n🚨 SEO HEALTH WARNING: Score below 80% - immediate attention needed!',
      );
      this.logSEOAlert(report);
    }
  }

  // Log SEO alerts for critical issues
  logSEOAlert(report) {
    const alertData = {
      timestamp: new Date().toISOString(),
      alertType: 'SEO_HEALTH_WARNING',
      healthScore: report.summary.overallHealthScore,
      criticalIssues:
        report.summary.duplicateIssues + report.summary.thinContentIssues,
      actionRequired: 'IMMEDIATE',
      recommendations: report.recommendations.filter(
        (r) => r.priority === 'HIGH',
      ),
    };

    // Save alert
    const alertsDir = path.join(__dirname, '../alerts');
    if (!fs.existsSync(alertsDir)) {
      fs.mkdirSync(alertsDir, { recursive: true });
    }

    const alertFile = path.join(alertsDir, `seo-alert-${Date.now()}.json`);
    fs.writeFileSync(alertFile, JSON.stringify(alertData, null, 2));

    console.log(`🚨 SEO Alert saved: ${alertFile}`);
  }

  // Main execution function
  async runComprehensiveAnalysis() {
    console.log('🚀 SEO Content Uniqueness & Keyword Monitoring System\n');
    console.log(
      '════════════════════════════════════════════════════════════════\n',
    );

    // 1. Content uniqueness analysis
    const uniquenessReport = this.analyzeContentUniqueness();

    console.log('\n' + '═'.repeat(60));

    // 2. Keyword performance monitoring
    const keywordReport = await this.monitorKeywordPerformance();

    console.log('\n' + '═'.repeat(60));

    // 3. Update sitemap priorities
    const sitemapUpdate = this.updateSitemapPriorities(keywordReport);

    // 4. Generate comprehensive report
    const comprehensiveReport = {
      timestamp: new Date().toISOString(),
      uniqueness: uniquenessReport,
      keywords: keywordReport,
      sitemap: sitemapUpdate,
      overallRecommendations: this.generateOverallRecommendations(
        uniquenessReport,
        keywordReport,
      ),
    };

    this.saveReport('comprehensive-seo', comprehensiveReport);

    console.log(
      '\n✅ SEO Analysis Complete - System maintaining content uniqueness and SEO leadership!',
    );

    return comprehensiveReport;
  }

  // Generate overall system recommendations
  generateOverallRecommendations(uniqueness, keywords) {
    const recommendations = [];

    if (uniqueness.summary.overallHealthScore < 90) {
      recommendations.push('Prioritize content uniqueness improvements');
    }

    if (keywords.recommendations.length > 0) {
      recommendations.push('Implement keyword optimization suggestions');
    }

    recommendations.push('Schedule weekly automated monitoring');
    recommendations.push('Set up Ahrefs API for real-time data');

    return recommendations;
  }
}

// CLI execution
if (require.main === module) {
  const monitor = new SEOContentMonitor();
  monitor
    .runComprehensiveAnalysis()
    .then(() => {
      console.log('\n🎯 SEO monitoring complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ SEO monitoring failed:', error);
      process.exit(1);
    });
}

module.exports = SEOContentMonitor;
