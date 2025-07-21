#!/usr/bin/env tsx
// Setup script for immediate A/B testing implementation
// Run this script to create high-impact experiments ready for production

import {
  setupHighPriorityExperiments,
  getRecommendedExperiments,
  createExperimentFromTemplate,
  ALL_EXPERIMENT_TEMPLATES,
} from '@/lib/ab-testing/experiment-templates';
import { experimentEngine } from '@/lib/ab-testing/experiment-engine';

interface SetupOptions {
  autoStart?: boolean;
  maxExperiments?: number;
  categories?: string[];
  dryRun?: boolean;
}

class ABTestSetupManager {
  private options: SetupOptions;

  constructor(options: SetupOptions = {}) {
    this.options = {
      autoStart: false,
      maxExperiments: 3,
      categories: [],
      dryRun: false,
      ...options,
    };
  }

  async setupQuickWins(): Promise<void> {
    console.log('🚀 Setting up A/B Testing Quick Wins for 123LegalDoc\n');

    // Get the highest impact, lowest effort experiments
    const quickWins = getRecommendedExperiments({
      maxEffort: 'low',
      minImpact: 10,
    }).slice(0, this.options.maxExperiments);

    console.log('📊 Recommended Quick Win Experiments:');
    quickWins.forEach((template, index) => {
      console.log(`${index + 1}. ${template.name}`);
      console.log(
        `   Impact: ${template.estimatedImpact}% | Effort: ${template.implementationEffort}`,
      );
      console.log(`   Category: ${template.category}`);
      console.log(`   Hypothesis: ${template.hypothesis}\n`);
    });

    if (this.options.dryRun) {
      console.log('🔍 DRY RUN MODE - No experiments created');
      return;
    }

    const createdExperiments: string[] = [];

    for (const template of quickWins) {
      try {
        console.log(`Creating experiment: ${template.name}...`);
        const experimentId = await createExperimentFromTemplate(template.id, {
          targetAudience: { percentage: 50 },
          duration: template.estimatedDuration,
          owner: 'growth_team',
        });

        createdExperiments.push(experimentId);
        console.log(`✅ Created: ${experimentId}\n`);

        if (this.options.autoStart) {
          console.log(`🚀 Starting experiment: ${experimentId}...`);
          await experimentEngine.startExperiment(experimentId);
          console.log(`✅ Started: ${experimentId}\n`);
        }
      } catch (error) {
        console.error(`❌ Failed to create ${template.name}:`, error);
      }
    }

    if (createdExperiments.length > 0) {
      console.log('\n🎉 Setup Complete!');
      console.log(`Created ${createdExperiments.length} experiments:`);
      createdExperiments.forEach((id) => console.log(`  - ${id}`));

      if (!this.options.autoStart) {
        console.log('\n📋 Next steps:');
        console.log('1. Review experiments in admin dashboard');
        console.log('2. Start experiments when ready');
        console.log('3. Monitor results for statistical significance');
      }
    }
  }

  async createSingleExperiment(
    templateId: string,
    startImmediately = false,
  ): Promise<string | null> {
    const template = ALL_EXPERIMENT_TEMPLATES.find((t) => t.id === templateId);
    if (!template) {
      console.error(`❌ Template not found: ${templateId}`);
      return null;
    }

    console.log(`\n🧪 Creating experiment: ${template.name}`);
    console.log(`Expected impact: ${template.estimatedImpact}%`);
    console.log(`Implementation effort: ${template.implementationEffort}`);
    console.log(`Hypothesis: ${template.hypothesis}\n`);

    if (this.options.dryRun) {
      console.log('🔍 DRY RUN MODE - Experiment not created');
      return null;
    }

    try {
      const experimentId = await createExperimentFromTemplate(templateId);
      console.log(`✅ Created experiment: ${experimentId}`);

      if (startImmediately) {
        await experimentEngine.startExperiment(experimentId);
        console.log(`🚀 Started experiment: ${experimentId}`);
      }

      return experimentId;
    } catch (error) {
      console.error(`❌ Failed to create experiment:`, error);
      return null;
    }
  }

  listAllTemplates(): void {
    console.log('📋 Available A/B Test Templates:\n');

    const categories = [
      'cta',
      'headline',
      'trust',
      'pricing',
      'form',
      'social_proof',
    ];

    categories.forEach((category) => {
      const templates = ALL_EXPERIMENT_TEMPLATES.filter(
        (t) => t.category === category,
      );
      if (templates.length === 0) return;

      console.log(`\n📂 ${category.toUpperCase().replace('_', ' ')} TESTS:`);
      templates.forEach((template) => {
        console.log(`  🧪 ${template.name} (${template.id})`);
        console.log(
          `     Impact: ${template.estimatedImpact}% | Effort: ${template.implementationEffort} | Priority: ${template.priority}`,
        );
        console.log(`     ${template.description}`);
      });
    });
  }

  generateImplementationGuide(): void {
    console.log('\n📚 IMPLEMENTATION GUIDE\n');

    console.log('1. IMMEDIATE SETUP (Next 15 minutes):');
    console.log('   - Run this script with --start flag');
    console.log('   - Add ExperimentComponents to your pages');
    console.log('   - Replace existing buttons/headers with A/B versions\n');

    console.log('2. COMPONENT INTEGRATION:');
    console.log('   Replace your existing components with these A/B versions:');
    console.log('   - Homepage CTA: <HeroCTAButton />');
    console.log('   - Headlines: <HeroHeadlines />');
    console.log('   - Checkout: <CheckoutButton />');
    console.log('   - Pricing: <DocumentPricing />');
    console.log('   - Trust signals: <CheckoutTrustSignals />\n');

    console.log('3. TRACKING SETUP:');
    console.log('   - Components automatically track conversions');
    console.log('   - Revenue tracking: useFunnelTrackingWithAuth()');
    console.log('   - Custom events: useExperimentWithAuth()\n');

    console.log('4. MONITORING & RESULTS:');
    console.log('   - Visit /admin/experiments dashboard');
    console.log('   - Wait for statistical significance (95% confidence)');
    console.log('   - Implement winning variants permanently\n');

    console.log('5. EXPECTED RESULTS:');
    ALL_EXPERIMENT_TEMPLATES.filter((t) => t.priority === 'high').forEach(
      (template) => {
        console.log(
          `   - ${template.name}: +${template.estimatedImpact}% conversion lift`,
        );
      },
    );

    const totalImpact = ALL_EXPERIMENT_TEMPLATES.filter(
      (t) => t.priority === 'high',
    ).reduce((sum, t) => sum + t.estimatedImpact, 0);

    console.log(
      `\n🎯 TOTAL EXPECTED IMPACT: +${Math.round(totalImpact / 3)}% average conversion improvement\n`,
    );
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const setupManager = new ABTestSetupManager({
    autoStart: args.includes('--start'),
    maxExperiments: parseInt(
      args.find((arg) => arg.startsWith('--max='))?.split('=')[1] || '3',
    ),
    dryRun: args.includes('--dry-run'),
  });

  switch (command) {
    case 'setup':
      await setupManager.setupQuickWins();
      break;

    case 'create':
      const templateId = args[1];
      if (!templateId) {
        console.error(
          '❌ Template ID required. Use: npm run ab-test create <template_id>',
        );
        return;
      }
      await setupManager.createSingleExperiment(
        templateId,
        args.includes('--start'),
      );
      break;

    case 'list':
      setupManager.listAllTemplates();
      break;

    case 'guide':
      setupManager.generateImplementationGuide();
      break;

    case 'quick-start':
      console.log('🚀 123LegalDoc A/B Testing Quick Start\n');
      console.log('This will set up 3 high-impact experiments in 5 minutes:\n');

      console.log('1. Homepage CTA Button Color & Text');
      console.log('   Expected: +8% click-through rate');
      console.log('2. Checkout Button Urgency Language');
      console.log('   Expected: +12% checkout conversion');
      console.log('3. Trust Signals on Checkout Page');
      console.log('   Expected: +18% checkout completion\n');

      console.log('💰 BUSINESS IMPACT:');
      console.log(
        '   Current: 1000 visitors/day → 50 conversions → $1,500/day',
      );
      console.log(
        '   With A/B tests: 1000 visitors/day → 69 conversions → $2,070/day',
      );
      console.log('   Additional revenue: $570/day = $208,050/year\n');

      console.log('📋 SETUP COMMANDS:');
      console.log(
        '   npm run ab-test setup --start    # Create and start experiments',
      );
      console.log(
        '   npm run ab-test list             # View all available tests',
      );
      console.log(
        '   npm run ab-test guide            # Implementation guide\n',
      );

      break;

    default:
      console.log('🧪 123LegalDoc A/B Testing Setup\n');
      console.log('Available commands:');
      console.log('  setup           - Create high-priority experiments');
      console.log('  create <id>     - Create specific experiment');
      console.log('  list            - List all available templates');
      console.log('  guide           - Show implementation guide');
      console.log('  quick-start     - Show quick start overview\n');
      console.log('Flags:');
      console.log('  --start         - Start experiments immediately');
      console.log('  --dry-run       - Show what would be created');
      console.log('  --max=N         - Maximum experiments to create\n');
      console.log('Examples:');
      console.log('  npm run ab-test quick-start');
      console.log('  npm run ab-test setup --start');
      console.log('  npm run ab-test create checkout_button_urgency --start');
      break;
  }
}

// Export for use in other scripts
export {
  ABTestSetupManager,
  setupHighPriorityExperiments,
  getRecommendedExperiments,
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
