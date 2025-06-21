#!/usr/bin/env node

/**
 * Automated Template Fixer
 *
 * Automatically fixes common template issues
 */

import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

interface FixResult {
  file: string;
  fixesApplied: string[];
  success: boolean;
}

class TemplateFixer {
  private templateDir: string;
  private fixResults: FixResult[] = [];

  constructor(templateDir: string) {
    this.templateDir = templateDir;
  }

  /**
   * Fix all templates
   */
  async fixAllTemplates(): Promise<void> {
    console.log(chalk.blue.bold('\n🔧 Auto-Fixing Template Issues\n'));

    const languages = ['en', 'es'];

    for (const lang of languages) {
      const langDir = path.join(this.templateDir, lang);
      if (!fs.existsSync(langDir)) continue;

      console.log(chalk.yellow(`\nFixing ${lang.toUpperCase()} templates...`));

      const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.md'));

      for (const file of files) {
        const filePath = path.join(langDir, file);
        const result = await this.fixTemplate(filePath);
        this.fixResults.push(result);

        if (result.fixesApplied.length > 0) {
          console.log(
            chalk.green(
              `✅ ${file} - Fixed ${result.fixesApplied.length} issues`,
            ),
          );
          result.fixesApplied.forEach((fix) => {
            console.log(chalk.gray(`   - ${fix}`));
          });
        } else {
          console.log(chalk.gray(`✓ ${file} - No fixes needed`));
        }
      }
    }

    this.generateFixReport();
  }

  /**
   * Fix a single template
   */
  private async fixTemplate(filePath: string): Promise<FixResult> {
    const fileName = path.basename(filePath);
    const result: FixResult = {
      file: filePath,
      fixesApplied: [],
      success: true,
    };

    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;

      // Apply fixes
      content = this.fixHeaderFormat(content, result);
      content = this.fixSectionNumbering(content, result);
      content = this.fixHandlebarsBalance(content, result);
      content = this.fixMarkdownFormatting(content, result);
      content = this.fixFooterFormat(content, result);
      content = this.fixWhitespace(content, result);
      content = this.addMissingElements(content, fileName, result);

      // Save if changed
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
      }
    } catch (error) {
      result.success = false;
      console.error(chalk.red(`Error fixing ${fileName}:`), error);
    }

    return result;
  }

  /**
   * Fix header format
   */
  private fixHeaderFormat(content: string, result: FixResult): string {
    const lines = content.split('\n');

    // Ensure proper title format
    if (lines[0] && !lines[0].startsWith('# ')) {
      lines[0] = `# ${lines[0].replace(/^#+\s*/, '')}`;
      result.fixesApplied.push('Fixed main header format');
    }

    // Ensure separator after title
    if (lines[1] !== '' || lines[2] !== '---') {
      lines.splice(1, 0, '', '---');
      result.fixesApplied.push('Added header separator');
    }

    return lines.join('\n');
  }

  /**
   * Fix section numbering
   */
  private fixSectionNumbering(content: string, result: FixResult): string {
    const lines = content.split('\n');
    let sectionNumber = 1;
    let fixed = false;

    for (let i = 0; i < lines.length; i++) {
      const sectionMatch = lines[i].match(/^##\s+(\d+)\.\s+(.+)/);
      if (sectionMatch) {
        const currentNumber = parseInt(sectionMatch[1]);
        if (currentNumber !== sectionNumber) {
          lines[i] = `## ${sectionNumber}. ${sectionMatch[2]}`;
          fixed = true;
        }
        sectionNumber++;
      }
    }

    if (fixed) {
      result.fixesApplied.push('Fixed section numbering sequence');
    }

    return lines.join('\n');
  }

  /**
   * Fix unbalanced Handlebars conditions
   */
  private fixHandlebarsBalance(content: string, result: FixResult): string {
    const ifMatches = content.match(/\{\{#if\s+[^}]+\}\}/g) || [];
    const endIfMatches = content.match(/\{\{\/if\}\}/g) || [];

    if (ifMatches.length !== endIfMatches.length) {
      // Try to auto-fix by adding missing {{/if}} at appropriate locations
      const lines = content.split('\n');
      let openIfs = 0;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('{{#if')) {
          openIfs++;
        }
        if (lines[i].includes('{{/if}}')) {
          openIfs--;
        }

        // If we're at a section boundary with open ifs, close them
        if (
          openIfs > 0 &&
          (lines[i].match(/^##\s+\d+\./) || i === lines.length - 1)
        ) {
          while (openIfs > 0) {
            lines.splice(i, 0, '{{/if}}');
            openIfs--;
            i++;
          }
        }
      }

      content = lines.join('\n');
      result.fixesApplied.push('Fixed unbalanced Handlebars conditions');
    }

    return content;
  }

  /**
   * Fix markdown formatting issues
   */
  private fixMarkdownFormatting(content: string, result: FixResult): string {
    let fixed = false;
    const originalContent = content;

    // Fix bold/italic combinations
    content = content.replace(/\*\*_([^_]+)_\*\*/g, '**$1**');
    content = content.replace(/_\*\*([^*]+)\*\*_/g, '**$1**');

    // Fix table formatting
    content = content.replace(/\|\s*\|\s*\|/g, '| | |');

    // Fix list formatting
    content = content.replace(/^(\s*)-\s+/gm, '$1- ');

    // Fix inconsistent header underlines
    content = content.replace(/^-+$/gm, '---');

    if (content !== originalContent) {
      result.fixesApplied.push('Fixed markdown formatting issues');
    }

    return content;
  }

  /**
   * Fix footer format
   */
  private fixFooterFormat(content: string, result: FixResult): string {
    const oldFooter =
      '_Template generated by 123 LegalDoc. Replace bracketed fields with actual data._';
    const newFooter =
      '*Template generated by 123LegalDoc - Professional Legal Document Platform*';

    if (content.includes(oldFooter)) {
      content = content.replace(oldFooter, newFooter);
      result.fixesApplied.push('Updated footer format');
    }

    // Ensure footer exists
    if (
      !content.includes(newFooter) &&
      !content.includes('Template generated by 123LegalDoc')
    ) {
      content = content.trimEnd() + '\n\n' + newFooter;
      result.fixesApplied.push('Added missing footer');
    }

    return content;
  }

  /**
   * Fix whitespace issues
   */
  private fixWhitespace(content: string, result: FixResult): string {
    const originalContent = content;

    // Remove trailing whitespace
    content = content
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n');

    // Ensure single blank line between sections
    content = content.replace(/\n{3,}/g, '\n\n');

    // Ensure document ends with single newline
    content = content.trimEnd() + '\n';

    if (content !== originalContent) {
      result.fixesApplied.push('Fixed whitespace issues');
    }

    return content;
  }

  /**
   * Add missing required elements
   */
  private addMissingElements(
    content: string,
    fileName: string,
    result: FixResult,
  ): string {
    // Check for legal notice
    if (!content.includes('IMPORTANT LEGAL NOTICE')) {
      const documentType = fileName
        .replace('.md', '')
        .replace(/-/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const legalNotice = `\n---\n\n**IMPORTANT LEGAL NOTICE:** This ${documentType.toLowerCase()} should be reviewed by qualified legal counsel to ensure compliance with applicable laws. Legal requirements vary by jurisdiction.`;

      // Insert before footer
      const footerMatch = content.match(/\*Template generated by.*/);
      if (footerMatch) {
        content = content.replace(
          footerMatch[0],
          legalNotice + '\n\n' + footerMatch[0],
        );
      } else {
        content = content.trimEnd() + legalNotice + '\n';
      }

      result.fixesApplied.push('Added missing legal notice');
    }

    // Check for signature section
    if (!content.toLowerCase().includes('signature')) {
      // Add basic signature section before legal notice
      const signatureSection = `\n---\n\n## Signatures\n\n**IN WITNESS WHEREOF**, the parties have executed this agreement as of the date first written above.\n\n| Signature | Date |\n|-----------|------|\n| _________________________________ | {{agreement_date}} |\n| {{party_name}} | |\n`;

      const legalNoticeIndex = content.indexOf('IMPORTANT LEGAL NOTICE');
      if (legalNoticeIndex > -1) {
        content =
          content.slice(0, legalNoticeIndex - 5) +
          signatureSection +
          content.slice(legalNoticeIndex - 5);
      } else {
        content = content.trimEnd() + signatureSection;
      }

      result.fixesApplied.push('Added missing signature section');
    }

    return content;
  }

  /**
   * Generate fix report
   */
  private generateFixReport(): void {
    const totalFiles = this.fixResults.length;
    const filesFixed = this.fixResults.filter(
      (r) => r.fixesApplied.length > 0,
    ).length;
    const totalFixes = this.fixResults.reduce(
      (sum, r) => sum + r.fixesApplied.length,
      0,
    );
    const failures = this.fixResults.filter((r) => !r.success).length;

    console.log(chalk.blue.bold('\n📊 Auto-Fix Report\n'));
    console.log(`Total Files Processed: ${totalFiles}`);
    console.log(`Files Fixed: ${chalk.green(filesFixed)}`);
    console.log(`Total Fixes Applied: ${chalk.green(totalFixes)}`);
    if (failures > 0) {
      console.log(`Failed Files: ${chalk.red(failures)}`);
    }

    // Save detailed report
    const reportPath = path.join(
      this.templateDir,
      '..',
      '..',
      'template-fix-report.json',
    );
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles,
        filesFixed,
        totalFixes,
        failures,
      },
      results: this.fixResults,
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(chalk.gray(`\nDetailed report saved to: ${reportPath}`));

    if (totalFixes > 0) {
      console.log(
        chalk.green.bold('\n✅ Templates have been automatically fixed!'),
      );
      console.log(
        chalk.yellow(
          'Please run npm run verify-templates to confirm all issues are resolved.',
        ),
      );
    } else {
      console.log(
        chalk.green.bold(
          '\n✅ No fixes needed - all templates are properly formatted!',
        ),
      );
    }
  }
}

// Run fixer
async function main() {
  const templateDir = path.join(__dirname, '..', 'public', 'templates');
  const fixer = new TemplateFixer(templateDir);

  try {
    await fixer.fixAllTemplates();
  } catch (error) {
    console.error(chalk.red('Auto-fix failed:'), error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { TemplateFixer };
