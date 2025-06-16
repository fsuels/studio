/**
 * Template Quality Monitoring Dashboard
 * 
 * Real-time monitoring of template quality metrics
 */

import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';
import chalk from 'chalk';
import { TemplateVerifier } from './verify-templates';

interface TemplateMetrics {
  totalTemplates: number;
  validTemplates: number;
  invalidTemplates: number;
  averageWordCount: number;
  averageVariableCount: number;
  lastVerification: Date;
  recentChanges: TemplateChange[];
  qualityScore: number;
}

interface TemplateChange {
  file: string;
  timestamp: Date;
  changeType: 'added' | 'modified' | 'deleted';
  isValid?: boolean;
}

class TemplateMonitor {
  private templateDir: string;
  private metrics: TemplateMetrics;
  private verifier: TemplateVerifier;
  private watcher: chokidar.FSWatcher | null = null;

  constructor(templateDir: string) {
    this.templateDir = templateDir;
    this.verifier = new TemplateVerifier(templateDir);
    this.metrics = {
      totalTemplates: 0,
      validTemplates: 0,
      invalidTemplates: 0,
      averageWordCount: 0,
      averageVariableCount: 0,
      lastVerification: new Date(),
      recentChanges: [],
      qualityScore: 0
    };
  }

  /**
   * Start monitoring templates
   */
  async startMonitoring(): Promise<void> {
    console.log(chalk.blue.bold('\n📊 Template Quality Monitoring Dashboard\n'));
    
    // Initial verification
    await this.updateMetrics();
    this.displayDashboard();
    
    // Watch for changes
    const watchPath = path.join(this.templateDir, '**/*.md');
    this.watcher = chokidar.watch(watchPath, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });
    
    // Handle file changes
    this.watcher
      .on('add', (filePath) => this.handleFileChange(filePath, 'added'))
      .on('change', (filePath) => this.handleFileChange(filePath, 'modified'))
      .on('unlink', (filePath) => this.handleFileChange(filePath, 'deleted'));
    
    // Refresh dashboard every 30 seconds
    setInterval(() => {
      this.displayDashboard();
    }, 30000);
    
    console.log(chalk.gray('\n👀 Monitoring templates for changes... (Press Ctrl+C to stop)\n'));
  }

  /**
   * Update metrics by running verification
   */
  private async updateMetrics(): Promise<void> {
    try {
      // Run verification silently
      const originalLog = console.log;
      console.log = () => {}; // Suppress output
      
      await this.verifier.verifyAllTemplates();
      
      console.log = originalLog; // Restore output
      
      // Read verification report
      const reportPath = path.join(this.templateDir, '..', '..', 'template-verification-report.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        // Update metrics
        this.metrics.totalTemplates = report.summary.totalTemplates;
        this.metrics.validTemplates = report.summary.validTemplates;
        this.metrics.invalidTemplates = report.summary.invalidTemplates;
        this.metrics.lastVerification = new Date();
        
        // Calculate averages
        const validResults = report.results.filter((r: any) => r.isValid);
        if (validResults.length > 0) {
          this.metrics.averageWordCount = Math.round(
            validResults.reduce((sum: number, r: any) => sum + r.wordCount, 0) / validResults.length
          );
          this.metrics.averageVariableCount = Math.round(
            validResults.reduce((sum: number, r: any) => sum + r.variableCount, 0) / validResults.length
          );
        }
        
        // Calculate quality score (0-100)
        this.metrics.qualityScore = Math.round(
          (this.metrics.validTemplates / this.metrics.totalTemplates) * 100
        );
      }
    } catch (error) {
      console.error(chalk.red('Error updating metrics:'), error);
    }
  }

  /**
   * Handle file changes
   */
  private async handleFileChange(filePath: string, changeType: 'added' | 'modified' | 'deleted'): Promise<void> {
    const fileName = path.basename(filePath);
    
    // Add to recent changes
    const change: TemplateChange = {
      file: fileName,
      timestamp: new Date(),
      changeType
    };
    
    // Verify the changed file if it exists
    if (changeType !== 'deleted' && fs.existsSync(filePath)) {
      const result = await this.verifier['verifyTemplate'](filePath);
      change.isValid = result.isValid;
    }
    
    this.metrics.recentChanges.unshift(change);
    
    // Keep only last 10 changes
    if (this.metrics.recentChanges.length > 10) {
      this.metrics.recentChanges = this.metrics.recentChanges.slice(0, 10);
    }
    
    // Update metrics
    await this.updateMetrics();
    
    // Display alert for invalid changes
    if (change.isValid === false) {
      console.log(chalk.red.bold(`\n⚠️  ALERT: Invalid template detected: ${fileName}`));
      console.log(chalk.red('Run npm run verify-templates for details.\n'));
    } else if (changeType === 'added') {
      console.log(chalk.green(`\n✅ New template added: ${fileName}\n`));
    } else if (changeType === 'modified') {
      console.log(chalk.yellow(`\n📝 Template modified: ${fileName}\n`));
    }
    
    // Refresh dashboard
    this.displayDashboard();
  }

  /**
   * Display monitoring dashboard
   */
  private displayDashboard(): void {
    console.clear();
    console.log(chalk.blue.bold('\n📊 Template Quality Monitoring Dashboard\n'));
    
    // Quality Score with color coding
    const scoreColor = this.metrics.qualityScore >= 90 ? chalk.green :
                      this.metrics.qualityScore >= 70 ? chalk.yellow :
                      chalk.red;
    
    console.log(chalk.bold('Overall Quality Score: ') + scoreColor.bold(`${this.metrics.qualityScore}%`));
    console.log(chalk.gray(`Last verified: ${this.metrics.lastVerification.toLocaleString()}\n`));
    
    // Template Stats
    console.log(chalk.cyan('📄 Template Statistics:'));
    console.log(`  Total Templates: ${this.metrics.totalTemplates}`);
    console.log(`  Valid Templates: ${chalk.green(this.metrics.validTemplates)}`);
    console.log(`  Invalid Templates: ${chalk.red(this.metrics.invalidTemplates)}`);
    console.log(`  Average Word Count: ${this.metrics.averageWordCount}`);
    console.log(`  Average Variables: ${this.metrics.averageVariableCount}\n`);
    
    // Recent Changes
    if (this.metrics.recentChanges.length > 0) {
      console.log(chalk.cyan('🔄 Recent Changes:'));
      this.metrics.recentChanges.forEach(change => {
        const icon = change.changeType === 'added' ? '➕' :
                    change.changeType === 'modified' ? '📝' : '❌';
        const validIcon = change.isValid === true ? '✅' :
                         change.isValid === false ? '❌' : '';
        const time = new Date(change.timestamp).toLocaleTimeString();
        
        console.log(`  ${icon} ${change.file} ${validIcon} (${time})`);
      });
      console.log('');
    }
    
    // Health Status
    console.log(chalk.cyan('🏥 System Health:'));
    if (this.metrics.invalidTemplates === 0) {
      console.log(chalk.green('  ✅ All templates are valid'));
    } else {
      console.log(chalk.red(`  ❌ ${this.metrics.invalidTemplates} templates need attention`));
    }
    
    // Alerts
    if (this.metrics.qualityScore < 90) {
      console.log(chalk.yellow.bold('\n⚠️  Quality Alert: Score below 90%'));
      console.log(chalk.yellow('  Run npm run verify-templates for detailed report'));
    }
    
    console.log(chalk.gray('\n👀 Monitoring... (Press Ctrl+C to stop)'));
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.watcher) {
      this.watcher.close();
      console.log(chalk.blue('\n👋 Monitoring stopped.'));
    }
  }
}

// Run monitor
async function main() {
  const templateDir = path.join(__dirname, '..', 'public', 'templates');
  const monitor = new TemplateMonitor(templateDir);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    monitor.stopMonitoring();
    process.exit(0);
  });
  
  try {
    await monitor.startMonitoring();
  } catch (error) {
    console.error(chalk.red('Monitoring failed:'), error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { TemplateMonitor };