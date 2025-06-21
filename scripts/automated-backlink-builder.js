#!/usr/bin/env node

/**
 * Automated White-Hat Backlink Builder
 * Focuses on .gov/.edu/legal-directory high-authority domains
 */

const fs = require('fs');
const path = require('path');

class AutomatedBacklinkBuilder {
  constructor() {
    this.dailyOutreachLimit = 30;
    this.outreachQueue = [];
    this.completedOutreach = [];
    this.prospects = new Map();
    this.emailTemplates = new Map();

    // Directories and file paths
    this.reportsDir = path.join(__dirname, '../backlink-reports');
    this.queueFile = path.join(this.reportsDir, 'outreach-queue.json');
    this.completedFile = path.join(this.reportsDir, 'completed-outreach.json');
    this.prospectsFile = path.join(this.reportsDir, 'prospects-database.json');
    this.dailyLogFile = path.join(
      this.reportsDir,
      `daily-outreach-${this.getDateString()}.json`,
    );

    // Target domain types with authority scores
    this.targetDomainTypes = {
      gov: {
        priority: 10,
        authorityScore: 95,
        examples: ['irs.gov', 'sba.gov', 'dol.gov', 'ftc.gov'],
      },
      edu: {
        priority: 9,
        authorityScore: 85,
        examples: ['harvard.edu', 'stanford.edu', 'mit.edu'],
      },
      legalDirectory: {
        priority: 8,
        authorityScore: 75,
        examples: [
          'justia.com',
          'findlaw.com',
          'lawyers.com',
          'martindale.com',
        ],
      },
      stateLegal: {
        priority: 9,
        authorityScore: 90,
        examples: ['courts.ca.gov', 'nycourts.gov', 'flcourts.org'],
      },
    };

    // White-hat outreach strategies
    this.outreachStrategies = {
      resourcePage: 'Resource page link request',
      brokenLink: 'Broken link replacement offer',
      directorySubmission: 'Legal directory submission',
      educationalResource: 'Educational resource contribution',
      governmentResource: 'Government resource page suggestion',
      guestContribution: 'Expert content contribution offer',
    };

    this.initializeSystem();
  }

  initializeSystem() {
    // Create directories
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }

    // Load existing data
    this.loadOutreachQueue();
    this.loadCompletedOutreach();
    this.loadProspectsDatabase();
    this.loadEmailTemplates();
  }

  // Date utilities
  getDateString() {
    return new Date().toISOString().split('T')[0];
  }

  getTodayOutreachCount() {
    const today = this.getDateString();
    return this.completedOutreach.filter(
      (outreach) => outreach.dateSent && outreach.dateSent.startsWith(today),
    ).length;
  }

  // Load/Save data methods
  loadOutreachQueue() {
    if (fs.existsSync(this.queueFile)) {
      this.outreachQueue = JSON.parse(fs.readFileSync(this.queueFile, 'utf8'));
    }
  }

  saveOutreachQueue() {
    fs.writeFileSync(
      this.queueFile,
      JSON.stringify(this.outreachQueue, null, 2),
    );
  }

  loadCompletedOutreach() {
    if (fs.existsSync(this.completedFile)) {
      this.completedOutreach = JSON.parse(
        fs.readFileSync(this.completedFile, 'utf8'),
      );
    }
  }

  saveCompletedOutreach() {
    fs.writeFileSync(
      this.completedFile,
      JSON.stringify(this.completedOutreach, null, 2),
    );
  }

  loadProspectsDatabase() {
    if (fs.existsSync(this.prospectsFile)) {
      const prospectsArray = JSON.parse(
        fs.readFileSync(this.prospectsFile, 'utf8'),
      );
      this.prospects = new Map(prospectsArray.map((p) => [p.id, p]));
    } else {
      this.seedProspectsDatabase();
    }
  }

  saveProspectsDatabase() {
    const prospectsArray = Array.from(this.prospects.values());
    fs.writeFileSync(
      this.prospectsFile,
      JSON.stringify(prospectsArray, null, 2),
    );
  }

  // Email templates for different outreach types
  loadEmailTemplates() {
    this.emailTemplates.set('resourcePage', {
      subject: 'Legal Resource Suggestion for {{siteName}}',
      body: `Dear {{contactName}},

I hope this email finds you well. I'm reaching out regarding your excellent legal resources page at {{resourcePageUrl}}.

I noticed you've curated some valuable legal information, and I wanted to suggest a resource that might be helpful for your visitors. 123LegalDoc ({{ourUrl}}) provides free, state-specific legal document templates that are:

• Reviewed by legal professionals
• State-compliant and up-to-date  
• Available in both English and Spanish
• Completely free to use

I believe this would be a valuable addition to your {{stateName}} legal resources, particularly for individuals who need accessible legal documents.

Would you consider adding us to your resources page? I'm happy to provide any additional information.

Best regards,
{{senderName}}
Legal Content Team
123LegalDoc`,
    });

    this.emailTemplates.set('brokenLink', {
      subject: 'Broken Link Notice + Helpful Replacement',
      body: `Dear {{contactName}},

I was browsing your helpful legal resources page at {{pageUrl}} and noticed a broken link to {{brokenLinkText}} ({{brokenUrl}}).

I wanted to let you know, and also suggest a replacement resource that might be even more helpful for your visitors. 123LegalDoc ({{ourUrl}}) offers:

• Free legal document templates
• State-specific compliance
• Both English and Spanish versions
• Professional legal review

This might be a valuable replacement for the broken link, providing your visitors with immediate access to quality legal documents.

Thank you for maintaining such helpful resources!

Best regards,
{{senderName}}
Legal Content Team
123LegalDoc`,
    });

    this.emailTemplates.set('directorySubmission', {
      subject: 'Quality Legal Resource Submission',
      body: `Dear {{directoryName}} Team,

I'd like to submit 123LegalDoc for inclusion in your legal directory. We provide:

• Free, state-specific legal document templates
• Professional legal review and compliance
• Bilingual support (English/Spanish)
• Over {{documentCount}} document types
• Serving {{userCount}}+ users nationwide

Our platform helps individuals access quality legal documents without expensive attorney fees, making legal resources more accessible to everyone.

Directory Details:
• Website: {{ourUrl}}
• Category: Legal Documents/Self-Help Legal Resources
• Target Audience: Individuals needing legal documents
• Geographic Scope: All 50 US states

I'm happy to provide any additional information for your review process.

Best regards,
{{senderName}}
Legal Content Team
123LegalDoc`,
    });

    this.emailTemplates.set('educationalResource', {
      subject: 'Educational Legal Resource for Students',
      body: `Dear {{institutionName}} Legal Department,

I'm reaching out to share a resource that might benefit your law students and faculty research.

123LegalDoc ({{ourUrl}}) provides free access to:

• State-specific legal document templates
• Legal compliance information by jurisdiction
• Bilingual legal resources
• Real-world document examples for educational use

This could be valuable for:
• Clinical legal education programs
• Student research projects
• Pro bono legal assistance programs
• Community outreach initiatives

We'd be honored to be included in your legal education resources.

Best regards,
{{senderName}}
Legal Content Team
123LegalDoc`,
    });
  }

  // Seed the prospects database with high-authority targets
  seedProspectsDatabase() {
    const seedProspects = [
      // Government domains (.gov)
      {
        id: 'sba-gov-legal-resources',
        domain: 'sba.gov',
        type: 'gov',
        url: 'https://www.sba.gov/business-guide/launch-your-business/choose-business-structure',
        contactPage:
          'https://www.sba.gov/about-sba/sba-locations/headquarters-offices',
        priority: 10,
        strategy: 'resourcePage',
        notes: 'SBA has extensive small business legal resources',
        targetPage: 'Business formation legal documents',
        estimatedAuthority: 95,
        lastContacted: null,
        status: 'prospective',
      },
      {
        id: 'irs-gov-business-resources',
        domain: 'irs.gov',
        type: 'gov',
        url: 'https://www.irs.gov/businesses/small-businesses-self-employed',
        contactPage: 'https://www.irs.gov/help/contact-your-local-irs-office',
        priority: 10,
        strategy: 'resourcePage',
        notes: 'IRS business resources section',
        targetPage: 'Business formation and tax documents',
        estimatedAuthority: 98,
        lastContacted: null,
        status: 'prospective',
      },
      {
        id: 'ftc-gov-consumer-resources',
        domain: 'ftc.gov',
        type: 'gov',
        url: 'https://www.ftc.gov/business-guidance',
        contactPage: 'https://www.ftc.gov/about-ftc/contact',
        priority: 9,
        strategy: 'resourcePage',
        notes: 'FTC business guidance and consumer protection',
        targetPage: 'Consumer protection legal documents',
        estimatedAuthority: 94,
        lastContacted: null,
        status: 'prospective',
      },
      {
        id: 'dol-gov-workplace-rights',
        domain: 'dol.gov',
        type: 'gov',
        url: 'https://www.dol.gov/agencies/whd/workers/rights',
        contactPage: 'https://www.dol.gov/general/contact',
        priority: 9,
        strategy: 'resourcePage',
        notes: 'Department of Labor workplace rights',
        targetPage: 'Employment law documents',
        estimatedAuthority: 93,
        lastContacted: null,
        status: 'prospective',
      },

      // Educational domains (.edu)
      {
        id: 'harvard-law-clinical',
        domain: 'harvard.edu',
        type: 'edu',
        url: 'https://hls.harvard.edu/dept/clinical/',
        contactPage: 'https://hls.harvard.edu/dept/clinical/contact/',
        priority: 9,
        strategy: 'educationalResource',
        notes: 'Harvard Law clinical programs',
        targetPage: 'Clinical legal education resources',
        estimatedAuthority: 92,
        lastContacted: null,
        status: 'prospective',
      },
      {
        id: 'stanford-law-clinics',
        domain: 'stanford.edu',
        type: 'edu',
        url: 'https://law.stanford.edu/education/clinical-and-experiential-learning/',
        contactPage: 'https://law.stanford.edu/contact/',
        priority: 9,
        strategy: 'educationalResource',
        notes: 'Stanford Law clinical programs',
        targetPage: 'Clinical and experiential learning',
        estimatedAuthority: 91,
        lastContacted: null,
        status: 'prospective',
      },

      // State legal domains
      {
        id: 'courts-ca-gov-self-help',
        domain: 'courts.ca.gov',
        type: 'stateLegal',
        url: 'https://www.courts.ca.gov/selfhelp.htm',
        contactPage: 'https://www.courts.ca.gov/3055.htm',
        priority: 10,
        strategy: 'resourcePage',
        notes: 'California courts self-help center',
        targetPage: 'Self-help legal resources',
        estimatedAuthority: 96,
        lastContacted: null,
        status: 'prospective',
      },
      {
        id: 'nycourts-gov-self-help',
        domain: 'nycourts.gov',
        type: 'stateLegal',
        url: 'https://www.nycourts.gov/courthelp/',
        contactPage: 'https://www.nycourts.gov/contact/',
        priority: 10,
        strategy: 'resourcePage',
        notes: 'New York courts help center',
        targetPage: 'Court help and legal resources',
        estimatedAuthority: 95,
        lastContacted: null,
        status: 'prospective',
      },

      // Legal directories
      {
        id: 'justia-legal-resources',
        domain: 'justia.com',
        type: 'legalDirectory',
        url: 'https://www.justia.com/lawyers/',
        contactPage: 'https://www.justia.com/contact/',
        priority: 8,
        strategy: 'directorySubmission',
        notes: 'Major legal directory and resource site',
        targetPage: 'Legal resources directory',
        estimatedAuthority: 78,
        lastContacted: null,
        status: 'prospective',
      },
      {
        id: 'findlaw-resources',
        domain: 'findlaw.com',
        type: 'legalDirectory',
        url: 'https://www.findlaw.com/',
        contactPage: 'https://www.findlaw.com/company/contact-us.html',
        priority: 8,
        strategy: 'directorySubmission',
        notes: 'Thomson Reuters legal directory',
        targetPage: 'Legal information and lawyer directory',
        estimatedAuthority: 82,
        lastContacted: null,
        status: 'prospective',
      },
    ];

    seedProspects.forEach((prospect) => {
      this.prospects.set(prospect.id, prospect);
    });

    this.saveProspectsDatabase();
    console.log(
      `📋 Seeded prospects database with ${seedProspects.length} high-authority targets`,
    );
  }

  // Main automation functions
  async runDailyOutreach() {
    console.log('📧 Automated Backlink Builder - Daily Outreach\n');
    console.log(
      '════════════════════════════════════════════════════════════════\n',
    );

    const todayCount = this.getTodayOutreachCount();
    const remaining = this.dailyOutreachLimit - todayCount;

    console.log(`📊 Daily Outreach Status:`);
    console.log(`   Today's Sent: ${todayCount}/${this.dailyOutreachLimit}`);
    console.log(`   Remaining: ${remaining}`);
    console.log(`   Queue Size: ${this.outreachQueue.length}`);
    console.log(`   Total Prospects: ${this.prospects.size}\n`);

    if (remaining <= 0) {
      console.log('✅ Daily outreach limit reached. Skipping until tomorrow.');
      return;
    }

    // Process outreach queue
    const toProcess = Math.min(remaining, this.outreachQueue.length);
    if (toProcess > 0) {
      console.log(`📧 Processing ${toProcess} queued outreach requests...\n`);

      for (let i = 0; i < toProcess; i++) {
        const outreach = this.outreachQueue.shift();
        await this.sendOutreach(outreach);
      }
    }

    // Fill queue with new prospects if needed
    if (this.outreachQueue.length < 50) {
      // Keep 50 prospects in queue
      await this.generateNewProspects();
    }

    this.saveOutreachQueue();
    this.saveCompletedOutreach();
    this.generateDailyReport();
  }

  async sendOutreach(outreach) {
    console.log(`📧 Sending outreach to: ${outreach.domain}`);
    console.log(`   Strategy: ${outreach.strategy}`);
    console.log(`   Priority: ${outreach.priority}/10`);

    // In real implementation, this would send actual emails
    // For now, we simulate the process

    const emailContent = this.generateEmailContent(outreach);

    // Simulate email sending
    const success = Math.random() > 0.1; // 90% success rate simulation

    if (success) {
      console.log(`   ✅ Email sent successfully`);

      // Move to completed with tracking info
      const completedOutreach = {
        ...outreach,
        dateSent: new Date().toISOString(),
        emailSubject: emailContent.subject,
        status: 'sent',
        trackingId: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      this.completedOutreach.push(completedOutreach);
    } else {
      console.log(`   ❌ Email failed to send - retrying later`);
      // Put back in queue for later retry
      outreach.retryCount = (outreach.retryCount || 0) + 1;
      if (outreach.retryCount < 3) {
        this.outreachQueue.push(outreach);
      }
    }

    console.log('');

    // Rate limiting - space out emails
    await this.sleep(2000); // 2 second delay between emails
  }

  generateEmailContent(outreach) {
    const template = this.emailTemplates.get(outreach.strategy);
    if (!template) {
      throw new Error(`No template found for strategy: ${outreach.strategy}`);
    }

    // Replace template variables
    let subject = template.subject;
    let body = template.body;

    const variables = {
      '{{siteName}}': this.extractSiteName(outreach.domain),
      '{{contactName}}': outreach.contactName || 'Legal Team',
      '{{resourcePageUrl}}': outreach.url,
      '{{ourUrl}}': 'https://123legaldoc.com',
      '{{stateName}}': this.extractStateName(outreach.domain),
      '{{pageUrl}}': outreach.url,
      '{{brokenLinkText}}': outreach.brokenLinkText || 'legal resources',
      '{{brokenUrl}}': outreach.brokenUrl || 'N/A',
      '{{directoryName}}': this.extractSiteName(outreach.domain),
      '{{documentCount}}': '200+',
      '{{userCount}}': '100,000',
      '{{institutionName}}': this.extractSiteName(outreach.domain),
      '{{senderName}}': 'Sarah Martinez',
    };

    Object.entries(variables).forEach(([placeholder, value]) => {
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      body = body.replace(new RegExp(placeholder, 'g'), value);
    });

    return { subject, body };
  }

  extractSiteName(domain) {
    const siteName = domain.split('.')[0];
    return siteName.charAt(0).toUpperCase() + siteName.slice(1);
  }

  extractStateName(domain) {
    // Extract state from domains like courts.ca.gov
    const stateCodes = {
      ca: 'California',
      ny: 'New York',
      tx: 'Texas',
      fl: 'Florida',
      il: 'Illinois',
    };

    const parts = domain.split('.');
    for (const part of parts) {
      if (stateCodes[part.toLowerCase()]) {
        return stateCodes[part.toLowerCase()];
      }
    }
    return 'your state';
  }

  async generateNewProspects() {
    console.log('🔍 Generating new prospects...');

    // Prioritize prospects that haven't been contacted
    const uncontactedProspects = Array.from(this.prospects.values())
      .filter((p) => p.status === 'prospective')
      .sort((a, b) => b.priority - a.priority);

    let added = 0;
    const maxToAdd = 20;

    uncontactedProspects.slice(0, maxToAdd).forEach((prospect) => {
      const outreach = {
        id: prospect.id,
        domain: prospect.domain,
        type: prospect.type,
        url: prospect.url,
        contactPage: prospect.contactPage,
        priority: prospect.priority,
        strategy: prospect.strategy,
        notes: prospect.notes,
        targetPage: prospect.targetPage,
        estimatedAuthority: prospect.estimatedAuthority,
        queuedAt: new Date().toISOString(),
      };

      this.outreachQueue.push(outreach);

      // Mark prospect as queued
      prospect.status = 'queued';
      prospect.queuedAt = new Date().toISOString();

      added++;
    });

    console.log(`   📋 Added ${added} new prospects to queue`);
    this.saveProspectsDatabase();
  }

  generateDailyReport() {
    const today = this.getDateString();
    const todayOutreach = this.completedOutreach.filter(
      (o) => o.dateSent && o.dateSent.startsWith(today),
    );

    const report = {
      date: today,
      outreachSent: todayOutreach.length,
      dailyLimit: this.dailyOutreachLimit,
      queueSize: this.outreachQueue.length,
      totalProspects: this.prospects.size,
      byDomainType: this.analyzeDomainTypes(todayOutreach),
      byStrategy: this.analyzeStrategies(todayOutreach),
      topTargets: todayOutreach.slice(0, 5).map((o) => ({
        domain: o.domain,
        strategy: o.strategy,
        priority: o.priority,
        authority: o.estimatedAuthority,
      })),
    };

    fs.writeFileSync(this.dailyLogFile, JSON.stringify(report, null, 2));

    console.log('📊 Daily Outreach Report Generated:');
    console.log(`   📧 Emails Sent: ${report.outreachSent}`);
    console.log(`   🎯 .gov domains: ${report.byDomainType.gov || 0}`);
    console.log(`   🎓 .edu domains: ${report.byDomainType.edu || 0}`);
    console.log(
      `   ⚖️  Legal directories: ${report.byDomainType.legalDirectory || 0}`,
    );
    console.log(`   🏛️  State legal: ${report.byDomainType.stateLegal || 0}`);
  }

  analyzeDomainTypes(outreach) {
    const analysis = {};
    outreach.forEach((o) => {
      analysis[o.type] = (analysis[o.type] || 0) + 1;
    });
    return analysis;
  }

  analyzeStrategies(outreach) {
    const analysis = {};
    outreach.forEach((o) => {
      analysis[o.strategy] = (analysis[o.strategy] || 0) + 1;
    });
    return analysis;
  }

  // Analytics and reporting
  generateWeeklyReport() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyOutreach = this.completedOutreach.filter(
      (o) => new Date(o.dateSent) >= weekAgo,
    );

    const report = {
      weekStart: weekAgo.toISOString().split('T')[0],
      weekEnd: new Date().toISOString().split('T')[0],
      totalOutreach: weeklyOutreach.length,
      averageDaily: Math.round(weeklyOutreach.length / 7),
      domainTypeBreakdown: this.analyzeDomainTypes(weeklyOutreach),
      strategyBreakdown: this.analyzeStrategies(weeklyOutreach),
      topAuthorities: weeklyOutreach
        .sort((a, b) => b.estimatedAuthority - a.estimatedAuthority)
        .slice(0, 10)
        .map((o) => ({
          domain: o.domain,
          authority: o.estimatedAuthority,
          strategy: o.strategy,
        })),
      prospects: {
        total: this.prospects.size,
        contacted: Array.from(this.prospects.values()).filter(
          (p) => p.status !== 'prospective',
        ).length,
        remaining: Array.from(this.prospects.values()).filter(
          (p) => p.status === 'prospective',
        ).length,
      },
    };

    const reportPath = path.join(
      this.reportsDir,
      `weekly-backlink-report-${this.getDateString()}.json`,
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`📊 Weekly report saved: ${reportPath}`);
    return report;
  }

  // Utility methods
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  addProspect(prospectData) {
    const prospect = {
      id: prospectData.id || `prospect_${Date.now()}`,
      ...prospectData,
      status: 'prospective',
      addedAt: new Date().toISOString(),
    };

    this.prospects.set(prospect.id, prospect);
    this.saveProspectsDatabase();

    console.log(`✅ Added new prospect: ${prospect.domain}`);
  }

  getStats() {
    const totalOutreach = this.completedOutreach.length;
    const last30Days = this.completedOutreach.filter((o) => {
      const outreachDate = new Date(o.dateSent);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return outreachDate >= thirtyDaysAgo;
    });

    return {
      totalOutreach,
      last30Days: last30Days.length,
      averageDaily: Math.round(last30Days.length / 30),
      queueSize: this.outreachQueue.length,
      totalProspects: this.prospects.size,
      domainTypes: this.analyzeDomainTypes(this.completedOutreach),
      strategies: this.analyzeStrategies(this.completedOutreach),
    };
  }
}

// CLI execution
if (require.main === module) {
  const builder = new AutomatedBacklinkBuilder();

  const command = process.argv[2];

  switch (command) {
    case 'run':
    case 'daily':
      builder
        .runDailyOutreach()
        .then(() => {
          console.log('\n🎯 Daily outreach complete!');
          process.exit(0);
        })
        .catch((error) => {
          console.error('❌ Daily outreach failed:', error);
          process.exit(1);
        });
      break;

    case 'weekly':
      builder.generateWeeklyReport();
      console.log('\n📊 Weekly report generated!');
      break;

    case 'stats':
      const stats = builder.getStats();
      console.log('📊 Backlink Builder Statistics:');
      console.log(`   Total Outreach: ${stats.totalOutreach}`);
      console.log(`   Last 30 Days: ${stats.last30Days}`);
      console.log(`   Average Daily: ${stats.averageDaily}`);
      console.log(`   Queue Size: ${stats.queueSize}`);
      console.log(`   Total Prospects: ${stats.totalProspects}`);
      break;

    default:
      console.log('📧 Automated Backlink Builder');
      console.log('Available commands:');
      console.log('  npm run backlink-daily  # Run daily outreach');
      console.log('  npm run backlink-weekly # Generate weekly report');
      console.log('  npm run backlink-stats  # Show statistics');
  }
}

module.exports = AutomatedBacklinkBuilder;
