#!/usr/bin/env ts-node
// src/scripts/evalSearch.ts
// Search evaluation script for finding optimal ranking weights

/// <reference types="node" />

// Import shared search utilities (using require for Node.js compatibility)
const { sanitize, tokenize, expand, recordMetric } = require('../services/searchUtils');

// Sample interface for evaluation
interface Sample {
  query: string;
  expectedIDs: string[];
  relevance: number[]; // Relevance scores for expectedIDs (1-5, higher is better)
}

// Evaluation samples with multilingual support
const samples: Sample[] = [
  // English samples
  {
    query: 'employment contract california',
    expectedIDs: ['employment-contract', 'ca-employment-contract', 'employment-agreement'],
    relevance: [5, 5, 4]
  },
  {
    query: 'LLC operating agreement',
    expectedIDs: ['llc-operating-agreement', 'llc-formation', 'partnership-agreement'],
    relevance: [5, 4, 3]
  },
  {
    query: 'non disclosure agreement template',
    expectedIDs: ['non-disclosure-agreement', 'confidentiality-agreement', 'nda-template'],
    relevance: [5, 5, 5]
  },
  {
    query: 'lease agreement residential',
    expectedIDs: ['lease-agreement', 'residential-lease', 'rental-agreement'],
    relevance: [5, 5, 4]
  },
  {
    query: 'power of attorney medical',
    expectedIDs: ['medical-power-of-attorney', 'healthcare-poa', 'advance-directive'],
    relevance: [5, 5, 3]
  },
  {
    query: 'bill of sale vehicle',
    expectedIDs: ['vehicle-bill-of-sale', 'auto-bill-of-sale', 'car-sale-agreement'],
    relevance: [5, 5, 4]
  },
  {
    query: 'independent contractor agreement',
    expectedIDs: ['independent-contractor-agreement', 'contractor-agreement', 'freelance-contract'],
    relevance: [5, 4, 4]
  },
  
  // Spanish samples
  {
    query: 'contrato de trabajo',
    expectedIDs: ['employment-contract', 'es-employment-contract', 'contrato-trabajo'],
    relevance: [5, 5, 5]
  },
  {
    query: 'acuerdo de confidencialidad',
    expectedIDs: ['non-disclosure-agreement', 'es-nda', 'confidentiality-agreement'],
    relevance: [5, 5, 4]
  },
  {
    query: 'contrato de arrendamiento',
    expectedIDs: ['lease-agreement', 'es-lease-agreement', 'rental-agreement'],
    relevance: [5, 5, 4]
  },
  
  // Mixed language / common terms
  {
    query: 'LLC',
    expectedIDs: ['llc-operating-agreement', 'llc-formation', 'llc-articles'],
    relevance: [4, 5, 4]
  },
  {
    query: 'NDA',
    expectedIDs: ['non-disclosure-agreement', 'nda-template', 'confidentiality-agreement'],
    relevance: [5, 5, 4]
  }
];

// Weight combinations to test
interface WeightCombination {
  original: number;
  synonym: number;
  semantic: number;
  keyword: number;
}

const weightCombinations: WeightCombination[] = [
  // Current default
  { original: 2.0, synonym: 1.0, semantic: 0.7, keyword: 0.3 },
  
  // Favor exact matches more
  { original: 3.0, synonym: 1.0, semantic: 0.5, keyword: 0.2 },
  { original: 4.0, synonym: 1.5, semantic: 0.3, keyword: 0.1 },
  
  // Balance keyword and semantic
  { original: 2.0, synonym: 1.0, semantic: 1.0, keyword: 0.5 },
  { original: 2.5, synonym: 1.2, semantic: 0.8, keyword: 0.4 },
  
  // Favor semantic search
  { original: 1.5, synonym: 0.8, semantic: 1.2, keyword: 0.6 },
  { original: 1.0, synonym: 0.5, semantic: 1.5, keyword: 0.8 },
  
  // Very balanced
  { original: 1.0, synonym: 1.0, semantic: 1.0, keyword: 1.0 },
  
  // Keyword-heavy
  { original: 2.0, synonym: 1.5, semantic: 0.3, keyword: 1.0 },
  { original: 2.5, synonym: 2.0, semantic: 0.2, keyword: 0.8 }
];

// Calculate Precision@k
function precisionAtK(retrievedIDs: string[], expectedIDs: string[], k: number): number {
  const topK = retrievedIDs.slice(0, k);
  const relevant = topK.filter(id => expectedIDs.includes(id)).length;
  return relevant / k;
}

// Calculate NDCG@k (Normalized Discounted Cumulative Gain)
function ndcgAtK(retrievedIDs: string[], expectedIDs: string[], relevance: number[], k: number): number {
  // Create relevance map
  const relevanceMap = new Map<string, number>();
  expectedIDs.forEach((id, index) => {
    relevanceMap.set(id, relevance[index]);
  });
  
  // Calculate DCG@k
  let dcg = 0;
  const topK = retrievedIDs.slice(0, k);
  topK.forEach((id, index) => {
    const rel = relevanceMap.get(id) || 0;
    dcg += rel / Math.log2(index + 2); // +2 because index starts at 0
  });
  
  // Calculate ideal DCG@k (perfect ranking)
  const idealRanking = [...relevance].sort((a, b) => b - a);
  let idcg = 0;
  idealRanking.slice(0, k).forEach((rel, index) => {
    idcg += rel / Math.log2(index + 2);
  });
  
  // NDCG = DCG / IDCG
  return idcg === 0 ? 0 : dcg / idcg;
}

// Note: Using shared search utilities from ../services/searchUtils.ts
// This ensures consistency between evaluation and production code

// Simplified template interface for evaluation
interface SimpleTemplate {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

// Mock template data for evaluation
const mockTemplates: SimpleTemplate[] = [
  {
    id: 'employment-contract',
    name: 'Employment Contract',
    description: 'Standard employment agreement for full-time employees',
    keywords: ['employment', 'contract', 'agreement', 'job', 'work', 'employee', 'employer']
  },
  {
    id: 'ca-employment-contract',
    name: 'California Employment Contract',
    description: 'Employment agreement compliant with California state law',
    keywords: ['employment', 'contract', 'california', 'ca', 'state', 'agreement']
  },
  {
    id: 'employment-agreement',
    name: 'Employment Agreement',
    description: 'Comprehensive employment agreement with customizable terms',
    keywords: ['employment', 'agreement', 'contract', 'terms', 'conditions']
  },
  {
    id: 'llc-operating-agreement',
    name: 'LLC Operating Agreement',
    description: 'Operating agreement for Limited Liability Companies',
    keywords: ['llc', 'operating', 'agreement', 'limited', 'liability', 'company', 'business']
  },
  {
    id: 'non-disclosure-agreement',
    name: 'Non-Disclosure Agreement',
    description: 'Protect confidential information with this NDA template',
    keywords: ['nda', 'non-disclosure', 'confidentiality', 'agreement', 'privacy', 'secret']
  },
  {
    id: 'lease-agreement',
    name: 'Residential Lease Agreement',
    description: 'Standard residential lease for rental properties',
    keywords: ['lease', 'rental', 'agreement', 'residential', 'property', 'tenant', 'landlord']
  },
  {
    id: 'vehicle-bill-of-sale',
    name: 'Vehicle Bill of Sale',
    description: 'Bill of sale for cars, trucks, and other motor vehicles',
    keywords: ['vehicle', 'car', 'auto', 'bill', 'sale', 'purchase', 'title', 'transfer']
  },
  {
    id: 'medical-power-of-attorney',
    name: 'Medical Power of Attorney',
    description: 'Healthcare decisions power of attorney',
    keywords: ['medical', 'healthcare', 'power', 'attorney', 'health', 'decisions', 'advance-directive']
  },
  {
    id: 'independent-contractor-agreement',
    name: 'Independent Contractor Agreement',
    description: 'Agreement for freelance and contractor services',
    keywords: ['independent', 'contractor', 'freelance', 'agreement', 'services', 'consultant']
  }
];

// Simple template ranking function (uses shared utilities)
function rankTemplates(
  templates: SimpleTemplate[],
  query: string,
  weights: WeightCombination
): string[] {
  const startTime = performance.now();
  
  // Use shared utilities for consistent processing
  const cleanQuery = sanitize(query);
  const queryTokens = tokenize(cleanQuery);
  const expandedTokens = expand(queryTokens);
  const synonymTokens = expandedTokens.filter((t: string) => !queryTokens.includes(t));
  
  // Record evaluation metrics
  recordMetric('eval_ranking_operations_total', 1);
  recordMetric('eval_template_count', templates.length);
  
  interface ScoredTemplate {
    id: string;
    score: number;
  }
  
  const scored: ScoredTemplate[] = templates.map(template => {
    let score = 0;
    const keywords = template.keywords || [];
    const name = (template.name || '').toLowerCase();
    const description = (template.description || '').toLowerCase();
    
    // Original token matches
    queryTokens.forEach((token: string) => {
      if (keywords.some((k: string) => k.toLowerCase().includes(token))) {
        score += weights.original * 2;
      }
      if (name.includes(token)) {
        score += weights.original * 3;
      }
      if (description.includes(token)) {
        score += weights.original;
      }
    });
    
    // Synonym matches
    synonymTokens.forEach((token: string) => {
      if (keywords.some((k: string) => k.toLowerCase().includes(token))) {
        score += weights.synonym * 2;
      }
      if (name.includes(token)) {
        score += weights.synonym * 3;
      }
      if (description.includes(token)) {
        score += weights.synonym;
      }
    });
    
    // Keyword overlap scoring
    const keywordOverlap = keywords.filter((k: string) => 
      expandedTokens.some((t: string) => k.toLowerCase().includes(t))
    ).length;
    score += weights.keyword * keywordOverlap;
    
    return {
      id: template.id,
      score
    };
  });
  
  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  
  const duration = performance.now() - startTime;
  recordMetric('eval_ranking_duration_ms', duration);
  recordMetric('eval_scored_templates', scored.length);
  
  return scored.map(s => s.id);
}

// Parse command line arguments
const args = process.argv.slice(2);
const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;

// Main evaluation function
async function evaluateSearchWeights() {
  const evaluationStartTime = performance.now();
  console.log('🔍 Starting search weight evaluation...\n');
  
  // Record evaluation start
  recordMetric('eval_session_start', Date.now());
  recordMetric('eval_weight_combinations', weightCombinations.length);
  recordMetric('eval_test_samples', samples.length);
  
  const results: Array<{
    weights: WeightCombination;
    avgPrecision: number;
    avgNDCG: number;
    score: number;
  }> = [];
  
  // Test each weight combination
  for (const weights of weightCombinations) {
    console.log(`Testing weights: original=${weights.original}, synonym=${weights.synonym}, semantic=${weights.semantic}, keyword=${weights.keyword}`);
    
    let totalPrecision = 0;
    let totalNDCG = 0;
    let sampleCount = 0;
    
    // Evaluate each sample
    for (const sample of samples) {
      const rankedIDs = rankTemplates(mockTemplates, sample.query, weights);
      
      const precision = precisionAtK(rankedIDs, sample.expectedIDs, 10);
      const ndcg = ndcgAtK(rankedIDs, sample.expectedIDs, sample.relevance, 10);
      
      totalPrecision += precision;
      totalNDCG += ndcg;
      sampleCount++;
    }
    
    const avgPrecision = totalPrecision / sampleCount;
    const avgNDCG = totalNDCG / sampleCount;
    const combinedScore = (avgPrecision + avgNDCG) / 2;
    
    results.push({
      weights,
      avgPrecision,
      avgNDCG,
      score: combinedScore
    });
    
    console.log(`  Avg Precision@10: ${avgPrecision.toFixed(3)}`);
    console.log(`  Avg NDCG@10: ${avgNDCG.toFixed(3)}`);
    console.log(`  Combined Score: ${combinedScore.toFixed(3)}\n`);
  }
  
  // Find best combination
  const best = results.reduce((prev, current) => 
    current.score > prev.score ? current : prev
  );
  
  const evaluationDuration = performance.now() - evaluationStartTime;
  
  // Record final evaluation metrics
  recordMetric('eval_session_duration_ms', evaluationDuration);
  recordMetric('eval_session_complete', 1);
  recordMetric('eval_best_ndcg', best.avgNDCG);
  recordMetric('eval_best_precision', best.avgPrecision);
  recordMetric('eval_best_score', best.score);
  
  console.log('✅ Evaluation complete!\n');
  console.log('🏆 Best weight combination:');
  console.log(`  Original: ${best.weights.original}`);
  console.log(`  Synonym: ${best.weights.synonym}`);
  console.log(`  Semantic: ${best.weights.semantic}`);
  console.log(`  Keyword: ${best.weights.keyword}`);
  console.log(`  Avg Precision@10: ${best.avgPrecision.toFixed(3)}`);
  console.log(`  Avg NDCG@10: ${best.avgNDCG.toFixed(3)}`);
  console.log(`  Combined Score: ${best.score.toFixed(3)}`);
  console.log(`  Evaluation Duration: ${(evaluationDuration / 1000).toFixed(2)}s\n`);
  
  // Output JSON result
  const jsonResult = {
    best: {
      semantic: best.weights.semantic,
      keyword: best.weights.keyword,
      ndcg: best.avgNDCG
    }
  };
  
  console.log('📊 JSON Output:');
  console.log(JSON.stringify(jsonResult, null, 2));
  
  // Write to output file if specified
  if (outputFile) {
    const fs = require('fs');
    try {
      fs.writeFileSync(outputFile, JSON.stringify(jsonResult, null, 2));
      console.log(`\n✅ Results written to ${outputFile}`);
    } catch (error) {
      console.error(`\n❌ Failed to write to ${outputFile}:`, error);
      process.exit(1);
    }
  }
  
  // Exit with JSON result as exit code message
  process.exit(0);
}

// Run evaluation
evaluateSearchWeights().catch(error => {
  console.error('❌ Evaluation failed:', error);
  process.exit(1);
});