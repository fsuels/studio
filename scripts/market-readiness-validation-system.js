#!/usr/bin/env node

/**
 * Market Data Pre-loading + Staged Roll-out Validation System
 * Speeds localization while gating risk with compliance scoring
 */

const fs = require('fs');
const path = require('path');

class MarketReadinessValidationSystem {
  constructor() {
    this.complianceThreshold = 0.85; // Block launch if below 85%
    this.marketRequirementsDir = path.join(__dirname, '../market-requirements');
    this.reportsDir = path.join(__dirname, '../market-validation-reports');
    this.marketRequirementsDb = new Map();
    this.validationResults = new Map();

    // Market validation categories with weights
    this.validationCategories = {
      legalCompliance: {
        weight: 0.3,
        requirements: [
          'documentLegality',
          'notarizationRules',
          'witnessRequirements',
          'recordingRequirements',
          'localCourtAcceptance',
        ],
      },
      regulatoryCompliance: {
        weight: 0.25,
        requirements: [
          'dataProtectionLaws',
          'consumerProtectionRules',
          'eSignatureLegality',
          'businessRegistration',
          'taxCompliance',
        ],
      },
      technicalReadiness: {
        weight: 0.2,
        requirements: [
          'languageLocalization',
          'currencySupport',
          'paymentMethods',
          'technicalInfrastructure',
          'mobileOptimization',
        ],
      },
      marketPreparation: {
        weight: 0.15,
        requirements: [
          'localPartners',
          'customerSupport',
          'marketingMaterials',
          'competitorAnalysis',
          'pricingStrategy',
        ],
      },
      operationalReadiness: {
        weight: 0.1,
        requirements: [
          'staffTraining',
          'processDocumentation',
          'qualityAssurance',
          'incidentResponse',
          'escalationProcedures',
        ],
      },
    };

    // Country priority matrix
    this.countryPriorities = {
      // Tier 1: High Priority Markets
      Mexico: {
        tier: 1,
        population: 130000000,
        digitalAdoption: 0.78,
        legalComplexity: 0.7,
      },
      Spain: {
        tier: 1,
        population: 47000000,
        digitalAdoption: 0.92,
        legalComplexity: 0.8,
      },
      Canada: {
        tier: 1,
        population: 39000000,
        digitalAdoption: 0.95,
        legalComplexity: 0.6,
      },
      'United Kingdom': {
        tier: 1,
        population: 67000000,
        digitalAdoption: 0.96,
        legalComplexity: 0.8,
      },

      // Tier 2: Secondary Markets
      Colombia: {
        tier: 2,
        population: 51000000,
        digitalAdoption: 0.68,
        legalComplexity: 0.75,
      },
      Argentina: {
        tier: 2,
        population: 45000000,
        digitalAdoption: 0.81,
        legalComplexity: 0.85,
      },
      Peru: {
        tier: 2,
        population: 33000000,
        digitalAdoption: 0.66,
        legalComplexity: 0.8,
      },
      Chile: {
        tier: 2,
        population: 19000000,
        digitalAdoption: 0.87,
        legalComplexity: 0.7,
      },

      // Tier 3: Future Expansion
      Ecuador: {
        tier: 3,
        population: 18000000,
        digitalAdoption: 0.65,
        legalComplexity: 0.75,
      },
      Guatemala: {
        tier: 3,
        population: 18000000,
        digitalAdoption: 0.47,
        legalComplexity: 0.8,
      },
      'Dominican Republic': {
        tier: 3,
        population: 11000000,
        digitalAdoption: 0.74,
        legalComplexity: 0.7,
      },
    };

    this.initializeSystem();
  }

  initializeSystem() {
    // Create directories
    [this.marketRequirementsDir, this.reportsDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    this.loadMarketRequirementsDatabase();
    this.seedDefaultMarketData();
  }

  // Load existing market requirements database
  loadMarketRequirementsDatabase() {
    const dbFile = path.join(
      this.marketRequirementsDir,
      'market_requirements.db.json',
    );

    if (fs.existsSync(dbFile)) {
      const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
      this.marketRequirementsDb = new Map(Object.entries(data));
      console.log(
        `📋 Loaded ${this.marketRequirementsDb.size} market requirement sets`,
      );
    }
  }

  saveMarketRequirementsDatabase() {
    const dbFile = path.join(
      this.marketRequirementsDir,
      'market_requirements.db.json',
    );
    const data = Object.fromEntries(this.marketRequirementsDb);
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
  }

  // Seed market requirements for key markets
  seedDefaultMarketData() {
    if (this.marketRequirementsDb.size > 0) return; // Already seeded

    console.log('🌱 Seeding market requirements database...');

    // Mexico Market Requirements
    this.marketRequirementsDb.set('Mexico', {
      country: 'Mexico',
      region: 'LATAM',
      lastUpdated: new Date().toISOString(),
      legalCompliance: {
        documentLegality: {
          status: 'validated',
          score: 0.9,
          requirements: [
            'RFC integration for tax documents',
            'CFDI compliance for invoices',
            'Notarial requirements vary by state',
            'Civil law system alignment',
          ],
          validatedBy: 'Mexican legal partners',
          validationDate: '2024-01-15',
        },
        notarizationRules: {
          status: 'partial',
          score: 0.7,
          requirements: [
            '32 states with different requirements',
            'Notario Público system different from US',
            'Apostille requirements for international docs',
          ],
        },
        witnessRequirements: {
          status: 'validated',
          score: 0.85,
          requirements: [
            'Testigo requirements for contracts',
            'Age and capacity restrictions',
            'Relationship restrictions',
          ],
        },
        recordingRequirements: {
          status: 'pending',
          score: 0.4,
          requirements: [
            'Registro Público requirements',
            'State-specific recording fees',
            'Document authentication needs',
          ],
        },
        localCourtAcceptance: {
          status: 'in_review',
          score: 0.6,
          requirements: [
            'Federal and state court systems',
            'Document format requirements',
            'Language requirements (Spanish)',
          ],
        },
      },
      regulatoryCompliance: {
        dataProtectionLaws: {
          status: 'validated',
          score: 0.95,
          requirements: ['LFPDPPP compliance', 'INAI registration'],
          framework: 'Ley Federal de Protección de Datos Personales',
        },
        consumerProtectionRules: {
          status: 'validated',
          score: 0.8,
          requirements: ['PROFECO compliance', 'Consumer rights disclosure'],
        },
        eSignatureLegality: {
          status: 'validated',
          score: 0.9,
          requirements: [
            'FIEL (Advanced Electronic Signature)',
            'e.firma integration',
          ],
        },
        businessRegistration: {
          status: 'pending',
          score: 0.3,
          requirements: ['RFC registration', 'Business permit requirements'],
        },
        taxCompliance: {
          status: 'pending',
          score: 0.2,
          requirements: [
            'SAT compliance',
            'CFDI integration',
            'Tax calculation',
          ],
        },
      },
      technicalReadiness: {
        languageLocalization: {
          status: 'validated',
          score: 0.95,
          requirements: [
            'Mexican Spanish localization',
            'Legal terminology validation',
          ],
        },
        currencySupport: {
          status: 'validated',
          score: 1.0,
          requirements: ['MXN currency support', 'Exchange rate integration'],
        },
        paymentMethods: {
          status: 'in_development',
          score: 0.6,
          requirements: [
            'OXXO integration',
            'SPEI transfers',
            'Credit card processing',
          ],
        },
        technicalInfrastructure: {
          status: 'validated',
          score: 0.9,
          requirements: [
            'Mexico region deployment',
            'CDN coverage',
            'Latency optimization',
          ],
        },
        mobileOptimization: {
          status: 'validated',
          score: 0.85,
          requirements: ['Mobile-first design', 'Low-bandwidth optimization'],
        },
      },
      marketPreparation: {
        localPartners: {
          status: 'in_progress',
          score: 0.7,
          requirements: [
            'Legal advisory partners',
            'Payment processor partnerships',
          ],
        },
        customerSupport: {
          status: 'pending',
          score: 0.3,
          requirements: [
            'Spanish language support',
            'Mexico timezone coverage',
          ],
        },
        marketingMaterials: {
          status: 'in_development',
          score: 0.5,
          requirements: ['Localized marketing content', 'Cultural adaptation'],
        },
        competitorAnalysis: {
          status: 'completed',
          score: 1.0,
          requirements: [
            'Market research completed',
            'Competitive positioning defined',
          ],
        },
        pricingStrategy: {
          status: 'validated',
          score: 0.8,
          requirements: ['MXN pricing strategy', 'Local market rates'],
        },
      },
      operationalReadiness: {
        staffTraining: {
          status: 'pending',
          score: 0.2,
          requirements: [
            'Mexican legal system training',
            'Cultural sensitivity training',
          ],
        },
        processDocumentation: {
          status: 'in_progress',
          score: 0.6,
          requirements: ['Mexico-specific processes', 'Escalation procedures'],
        },
        qualityAssurance: {
          status: 'validated',
          score: 0.9,
          requirements: ['Mexican legal review process', 'Quality standards'],
        },
        incidentResponse: {
          status: 'pending',
          score: 0.4,
          requirements: ['24/7 support structure', 'Emergency procedures'],
        },
        escalationProcedures: {
          status: 'pending',
          score: 0.3,
          requirements: [
            'Management escalation paths',
            'Legal escalation procedures',
          ],
        },
      },
    });

    // Spain Market Requirements
    this.marketRequirementsDb.set('Spain', {
      country: 'Spain',
      region: 'EU',
      lastUpdated: new Date().toISOString(),
      legalCompliance: {
        documentLegality: {
          status: 'validated',
          score: 0.95,
          requirements: [
            'Civil law system compliance',
            'Autonomous community variations',
            'EU directive alignment',
          ],
          validatedBy: 'Spanish legal counsel',
          validationDate: '2024-02-01',
        },
        notarizationRules: {
          status: 'validated',
          score: 0.9,
          requirements: [
            'Notario system requirements',
            'Apostille for international use',
            'Electronic notarization rules',
          ],
        },
        witnessRequirements: {
          status: 'validated',
          score: 0.88,
          requirements: [
            'Testigo requirements per document type',
            'Capacity and relationship rules',
            'Regional variations',
          ],
        },
        recordingRequirements: {
          status: 'validated',
          score: 0.85,
          requirements: [
            'Registro requirements',
            'Property registry integration',
            'Commercial registry rules',
          ],
        },
        localCourtAcceptance: {
          status: 'validated',
          score: 0.92,
          requirements: [
            'Court system compatibility',
            'Document format standards',
            'Language requirements',
          ],
        },
      },
      regulatoryCompliance: {
        dataProtectionLaws: {
          status: 'validated',
          score: 1.0,
          requirements: [
            'GDPR compliance',
            'AEPD registration',
            'Data residency',
          ],
          framework: 'GDPR + Spanish data protection law',
        },
        consumerProtectionRules: {
          status: 'validated',
          score: 0.95,
          requirements: ['Consumer rights directive', 'Cooling-off periods'],
        },
        eSignatureLegality: {
          status: 'validated',
          score: 0.98,
          requirements: ['eIDAS compliance', 'Qualified signatures'],
        },
        businessRegistration: {
          status: 'validated',
          score: 0.9,
          requirements: ['CIF registration', 'Commercial registry'],
        },
        taxCompliance: {
          status: 'in_progress',
          score: 0.7,
          requirements: [
            'VAT compliance',
            'Tax calculation',
            'AEAT integration',
          ],
        },
      },
      technicalReadiness: {
        languageLocalization: {
          status: 'validated',
          score: 0.98,
          requirements: [
            'Peninsular Spanish',
            'Legal terminology',
            'Regional variations',
          ],
        },
        currencySupport: {
          status: 'validated',
          score: 1.0,
          requirements: ['EUR currency support', 'EU payment regulations'],
        },
        paymentMethods: {
          status: 'validated',
          score: 0.95,
          requirements: [
            'SEPA payments',
            'Spanish banking integration',
            'Card processing',
          ],
        },
        technicalInfrastructure: {
          status: 'validated',
          score: 0.9,
          requirements: [
            'EU-West region',
            'GDPR infrastructure',
            'Data residency',
          ],
        },
        mobileOptimization: {
          status: 'validated',
          score: 0.92,
          requirements: ['Mobile optimization', 'Progressive web app'],
        },
      },
      marketPreparation: {
        localPartners: {
          status: 'validated',
          score: 0.8,
          requirements: ['Legal partners established', 'Payment partnerships'],
        },
        customerSupport: {
          status: 'in_progress',
          score: 0.6,
          requirements: ['Spanish support team', 'EU timezone coverage'],
        },
        marketingMaterials: {
          status: 'validated',
          score: 0.8,
          requirements: ['Localized content', 'Cultural adaptation'],
        },
        competitorAnalysis: {
          status: 'completed',
          score: 1.0,
          requirements: ['EU market analysis', 'Competitive positioning'],
        },
        pricingStrategy: {
          status: 'validated',
          score: 0.85,
          requirements: ['EUR pricing', 'EU market rates', 'VAT inclusion'],
        },
      },
      operationalReadiness: {
        staffTraining: {
          status: 'in_progress',
          score: 0.7,
          requirements: ['Spanish legal training', 'EU compliance training'],
        },
        processDocumentation: {
          status: 'validated',
          score: 0.8,
          requirements: [
            'Spain-specific processes',
            'EU compliance procedures',
          ],
        },
        qualityAssurance: {
          status: 'validated',
          score: 0.95,
          requirements: ['Spanish legal review', 'EU quality standards'],
        },
        incidentResponse: {
          status: 'validated',
          score: 0.8,
          requirements: ['EU support structure', 'Escalation procedures'],
        },
        escalationProcedures: {
          status: 'validated',
          score: 0.85,
          requirements: [
            'Management escalation',
            'Legal escalation',
            'Regulatory escalation',
          ],
        },
      },
    });

    this.saveMarketRequirementsDatabase();
    console.log(
      `✅ Seeded market requirements for ${this.marketRequirementsDb.size} markets`,
    );
  }

  // Calculate comprehensive compliance score for a market
  calculateComplianceScore(marketData) {
    if (!marketData) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(this.validationCategories).forEach(
      ([categoryName, categoryInfo]) => {
        const categoryData = marketData[categoryName];
        if (!categoryData) return;

        let categoryScore = 0;
        const requirements = categoryData;
        const requirementCount = Object.keys(requirements).length;

        if (requirementCount > 0) {
          Object.values(requirements).forEach((requirement) => {
            if (requirement && typeof requirement.score === 'number') {
              categoryScore += requirement.score;
            }
          });

          categoryScore = categoryScore / requirementCount;
          totalScore += categoryScore * categoryInfo.weight;
          totalWeight += categoryInfo.weight;
        }
      },
    );

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  // Validate market readiness with detailed scoring
  async validateMarketReadiness(country) {
    console.log(`🔍 Validating market readiness for ${country}...`);

    const marketData = this.marketRequirementsDb.get(country);
    if (!marketData) {
      throw new Error(`No market requirements found for ${country}`);
    }

    const complianceScore = this.calculateComplianceScore(marketData);
    const countryInfo = this.countryPriorities[country] || {};

    // Risk adjustment based on legal complexity
    const riskAdjustment = 1 - (countryInfo.legalComplexity || 0.5) * 0.1;
    const adjustedScore = complianceScore * riskAdjustment;

    const validation = {
      country,
      validationDate: new Date().toISOString(),
      complianceScore: Math.round(complianceScore * 1000) / 1000,
      adjustedScore: Math.round(adjustedScore * 1000) / 1000,
      riskAdjustment,
      threshold: this.complianceThreshold,
      launchApproved: adjustedScore >= this.complianceThreshold,
      marketInfo: countryInfo,
      categoryBreakdown: this.generateCategoryBreakdown(marketData),
      blockers: this.identifyBlockers(marketData),
      recommendations: this.generateRecommendations(marketData, adjustedScore),
    };

    this.validationResults.set(country, validation);
    this.saveValidationReport(country, validation);

    return validation;
  }

  generateCategoryBreakdown(marketData) {
    const breakdown = {};

    Object.entries(this.validationCategories).forEach(
      ([categoryName, categoryInfo]) => {
        const categoryData = marketData[categoryName];
        if (!categoryData) {
          breakdown[categoryName] = {
            score: 0,
            weight: categoryInfo.weight,
            status: 'missing',
          };
          return;
        }

        let categoryScore = 0;
        const requirements = categoryData;
        const requirementCount = Object.keys(requirements).length;
        const statuses = {};

        Object.entries(requirements).forEach(([reqName, requirement]) => {
          if (requirement && typeof requirement.score === 'number') {
            categoryScore += requirement.score;
            statuses[reqName] = {
              score: requirement.score,
              status: requirement.status || 'unknown',
            };
          }
        });

        breakdown[categoryName] = {
          score:
            requirementCount > 0
              ? Math.round((categoryScore / requirementCount) * 1000) / 1000
              : 0,
          weight: categoryInfo.weight,
          requirementCount,
          statuses,
          weightedContribution:
            Math.round(
              (categoryScore / requirementCount) * categoryInfo.weight * 1000,
            ) / 1000,
        };
      },
    );

    return breakdown;
  }

  identifyBlockers(marketData) {
    const blockers = [];
    const criticalThreshold = 0.5;

    Object.entries(this.validationCategories).forEach(
      ([categoryName, categoryInfo]) => {
        const categoryData = marketData[categoryName];
        if (!categoryData) {
          blockers.push({
            category: categoryName,
            severity: 'critical',
            issue: 'Category completely missing',
            impact: `${categoryInfo.weight * 100}% of total score`,
          });
          return;
        }

        Object.entries(categoryData).forEach(([reqName, requirement]) => {
          if (!requirement || requirement.score < criticalThreshold) {
            blockers.push({
              category: categoryName,
              requirement: reqName,
              severity:
                requirement && requirement.score < criticalThreshold
                  ? 'high'
                  : 'critical',
              score: requirement ? requirement.score : 0,
              status: requirement ? requirement.status : 'missing',
              issue: requirement
                ? 'Below critical threshold'
                : 'Requirement missing',
            });
          }
        });
      },
    );

    return blockers.sort((a, b) => {
      const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  generateRecommendations(marketData, adjustedScore) {
    const recommendations = [];

    if (adjustedScore < this.complianceThreshold) {
      recommendations.push({
        priority: 'critical',
        action: 'Block market launch',
        reason: `Compliance score ${adjustedScore.toFixed(3)} below threshold ${this.complianceThreshold}`,
        timeline: 'Immediate',
      });
    }

    // Category-specific recommendations
    Object.entries(this.validationCategories).forEach(
      ([categoryName, categoryInfo]) => {
        const categoryData = marketData[categoryName];
        if (!categoryData) return;

        let categoryScore = 0;
        const requirementCount = Object.keys(categoryData).length;

        Object.values(categoryData).forEach((requirement) => {
          if (requirement && typeof requirement.score === 'number') {
            categoryScore += requirement.score;
          }
        });

        const avgCategoryScore =
          requirementCount > 0 ? categoryScore / requirementCount : 0;

        if (avgCategoryScore < 0.7) {
          recommendations.push({
            priority: avgCategoryScore < 0.5 ? 'high' : 'medium',
            category: categoryName,
            action: `Improve ${categoryName} compliance`,
            currentScore: Math.round(avgCategoryScore * 1000) / 1000,
            targetScore: 0.85,
            impact: `${categoryInfo.weight * 100}% of total score`,
            timeline: avgCategoryScore < 0.5 ? '2-4 weeks' : '1-2 weeks',
          });
        }
      },
    );

    return recommendations;
  }

  saveValidationReport(country, validation) {
    const reportFile = path.join(
      this.reportsDir,
      `${country}-validation-${this.getDateString()}.json`,
    );
    fs.writeFileSync(reportFile, JSON.stringify(validation, null, 2));
  }

  // Staged rollout validation - check multiple markets in sequence
  async validateStagedRollout(countries) {
    console.log('🚀 Validating staged rollout for multiple markets...');
    console.log(
      '════════════════════════════════════════════════════════════════\n',
    );

    const results = {
      validationDate: new Date().toISOString(),
      threshold: this.complianceThreshold,
      countries: {},
      summary: {
        total: countries.length,
        approved: 0,
        blocked: 0,
        averageScore: 0,
      },
      rolloutSequence: [],
      blockedMarkets: [],
      recommendations: [],
    };

    let totalScore = 0;

    for (const country of countries) {
      try {
        const validation = await this.validateMarketReadiness(country);
        results.countries[country] = validation;
        totalScore += validation.adjustedScore;

        if (validation.launchApproved) {
          results.summary.approved++;
          results.rolloutSequence.push({
            country,
            score: validation.adjustedScore,
            tier: this.countryPriorities[country]?.tier || 999,
            estimatedLaunchDate: this.calculateLaunchDate(validation),
          });
        } else {
          results.summary.blocked++;
          results.blockedMarkets.push({
            country,
            score: validation.adjustedScore,
            blockers: validation.blockers.filter(
              (b) => b.severity === 'critical',
            ).length,
            estimatedReadyDate: this.estimateReadyDate(validation),
          });
        }
      } catch (error) {
        console.error(`❌ Error validating ${country}:`, error.message);
        results.countries[country] = {
          error: error.message,
          launchApproved: false,
        };
        results.summary.blocked++;
      }
    }

    results.summary.averageScore =
      Math.round((totalScore / countries.length) * 1000) / 1000;

    // Sort rollout sequence by tier and score
    results.rolloutSequence.sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return b.score - a.score;
    });

    this.generateStagedRolloutReport(results);
    return results;
  }

  calculateLaunchDate(validation) {
    const baseDate = new Date();
    const tier = this.countryPriorities[validation.country]?.tier || 3;

    // Lower tier = earlier launch (Tier 1 = immediate, Tier 2 = +2 weeks, Tier 3 = +4 weeks)
    const weeksToAdd = (tier - 1) * 2;
    baseDate.setDate(baseDate.getDate() + weeksToAdd * 7);

    return baseDate.toISOString().split('T')[0];
  }

  estimateReadyDate(validation) {
    const criticalBlockers = validation.blockers.filter(
      (b) => b.severity === 'critical',
    ).length;
    const highBlockers = validation.blockers.filter(
      (b) => b.severity === 'high',
    ).length;

    // Estimate based on blocker complexity
    const weeksNeeded = criticalBlockers * 4 + highBlockers * 2;

    const readyDate = new Date();
    readyDate.setDate(readyDate.getDate() + weeksNeeded * 7);

    return readyDate.toISOString().split('T')[0];
  }

  generateStagedRolloutReport(results) {
    const reportFile = path.join(
      this.reportsDir,
      `staged-rollout-validation-${this.getDateString()}.json`,
    );
    fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));

    console.log('📊 Staged Rollout Validation Results:');
    console.log(`   Total Markets: ${results.summary.total}`);
    console.log(`   ✅ Approved: ${results.summary.approved}`);
    console.log(`   🚫 Blocked: ${results.summary.blocked}`);
    console.log(`   📊 Average Score: ${results.summary.averageScore}`);
    console.log(`   🎯 Threshold: ${this.complianceThreshold}\n`);

    if (results.rolloutSequence.length > 0) {
      console.log('🚀 Approved Launch Sequence:');
      results.rolloutSequence.forEach((market, index) => {
        console.log(
          `   ${index + 1}. ${market.country} (Score: ${market.score}, Tier ${market.tier}, Launch: ${market.estimatedLaunchDate})`,
        );
      });
      console.log('');
    }

    if (results.blockedMarkets.length > 0) {
      console.log('🚫 Blocked Markets:');
      results.blockedMarkets.forEach((market) => {
        console.log(
          `   • ${market.country} (Score: ${market.score}, ${market.blockers} critical blockers, Ready: ${market.estimatedReadyDate})`,
        );
      });
      console.log('');
    }

    console.log(`📋 Full report saved: ${reportFile}`);
  }

  // Utility methods
  getDateString() {
    return new Date().toISOString().split('T')[0];
  }

  // Add new market requirements
  addMarketRequirements(country, requirements) {
    requirements.lastUpdated = new Date().toISOString();
    this.marketRequirementsDb.set(country, requirements);
    this.saveMarketRequirementsDatabase();
    console.log(`✅ Added market requirements for ${country}`);
  }

  // Update specific requirement
  updateRequirement(country, category, requirement, data) {
    const marketData = this.marketRequirementsDb.get(country);
    if (!marketData) {
      throw new Error(`No market data found for ${country}`);
    }

    if (!marketData[category]) {
      marketData[category] = {};
    }

    marketData[category][requirement] = {
      ...marketData[category][requirement],
      ...data,
      lastUpdated: new Date().toISOString(),
    };

    marketData.lastUpdated = new Date().toISOString();
    this.marketRequirementsDb.set(country, marketData);
    this.saveMarketRequirementsDatabase();

    console.log(`✅ Updated ${category}.${requirement} for ${country}`);
  }

  // Get validation status
  getValidationStatus(country) {
    return this.validationResults.get(country);
  }

  // List all markets and their compliance scores
  getAllMarketScores() {
    const scores = {};

    this.marketRequirementsDb.forEach((marketData, country) => {
      const score = this.calculateComplianceScore(marketData);
      const countryInfo = this.countryPriorities[country] || {};
      const riskAdjustment = 1 - (countryInfo.legalComplexity || 0.5) * 0.1;
      const adjustedScore = score * riskAdjustment;

      scores[country] = {
        complianceScore: Math.round(score * 1000) / 1000,
        adjustedScore: Math.round(adjustedScore * 1000) / 1000,
        launchApproved: adjustedScore >= this.complianceThreshold,
        tier: countryInfo.tier || 999,
        population: countryInfo.population || 0,
      };
    });

    return scores;
  }
}

// CLI execution
if (require.main === module) {
  const validator = new MarketReadinessValidationSystem();

  const command = process.argv[2];
  const country = process.argv[3];

  switch (command) {
    case 'validate':
      if (!country) {
        console.error(
          '❌ Please specify a country: npm run market-validate validate Mexico',
        );
        process.exit(1);
      }

      validator
        .validateMarketReadiness(country)
        .then((result) => {
          console.log(`\n🎯 Market validation complete for ${country}!`);
          console.log(`   Compliance Score: ${result.complianceScore}`);
          console.log(`   Adjusted Score: ${result.adjustedScore}`);
          console.log(
            `   Launch Approved: ${result.launchApproved ? '✅ YES' : '🚫 NO'}`,
          );

          if (!result.launchApproved) {
            console.log(
              `   Critical Blockers: ${result.blockers.filter((b) => b.severity === 'critical').length}`,
            );
          }

          process.exit(0);
        })
        .catch((error) => {
          console.error('❌ Validation failed:', error.message);
          process.exit(1);
        });
      break;

    case 'staged':
      const countries = process.argv.slice(3);
      if (countries.length === 0) {
        countries.push('Mexico', 'Spain', 'Colombia', 'Argentina');
      }

      validator
        .validateStagedRollout(countries)
        .then((results) => {
          console.log('\n🎯 Staged rollout validation complete!');
          process.exit(0);
        })
        .catch((error) => {
          console.error('❌ Staged validation failed:', error.message);
          process.exit(1);
        });
      break;

    case 'scores':
      const scores = validator.getAllMarketScores();
      console.log('📊 Market Compliance Scores:');

      Object.entries(scores)
        .sort((a, b) => b[1].adjustedScore - a[1].adjustedScore)
        .forEach(([country, data]) => {
          const status = data.launchApproved ? '✅' : '🚫';
          console.log(
            `   ${status} ${country}: ${data.adjustedScore} (Tier ${data.tier})`,
          );
        });
      break;

    default:
      console.log('🌍 Market Readiness Validation System');
      console.log('Available commands:');
      console.log(
        '  npm run market-validate validate <country>  # Validate specific market',
      );
      console.log(
        '  npm run market-validate staged [countries]  # Validate staged rollout',
      );
      console.log(
        '  npm run market-validate scores              # Show all market scores',
      );
      console.log('');
      console.log('Examples:');
      console.log('  npm run market-validate validate Mexico');
      console.log('  npm run market-validate staged Mexico Spain Colombia');
  }
}

module.exports = MarketReadinessValidationSystem;
