// Policy Diff Viewer System
// Visual diff tracking for templates, policies, and document changes
'use client';

export interface DiffLine {
  lineNumber: number;
  type: 'unchanged' | 'added' | 'removed' | 'modified';
  oldContent?: string;
  newContent?: string;
  context?: {
    beforeLines: string[];
    afterLines: string[];
  };
}

export interface PolicyDiff {
  id: string;
  timestamp: string;
  policyId: string;
  policyName: string;
  oldVersion: string;
  newVersion: string;
  diffType: 'content' | 'metadata' | 'permissions' | 'workflow';

  // Change summary
  summary: {
    totalChanges: number;
    addedLines: number;
    removedLines: number;
    modifiedLines: number;
    addedCharacters: number;
    removedCharacters: number;
  };

  // Detailed differences
  sections: PolicyDiffSection[];

  // Change classification
  changeType: 'major' | 'minor' | 'patch' | 'breaking';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceImpact: boolean;

  // Actor information
  changedBy: {
    userId: string;
    email: string;
    role: string;
    timestamp: string;
  };

  // Approval workflow
  approval: {
    required: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'auto_approved';
    approvers: Array<{
      userId: string;
      email: string;
      decision: 'approve' | 'reject' | 'pending';
      timestamp?: string;
      comments?: string;
    }>;
  };

  // Impact analysis
  impact: {
    affectedDocuments: string[];
    affectedUsers: string[];
    affectedProcesses: string[];
    downstreamChanges: string[];
    rollbackComplexity: 'simple' | 'moderate' | 'complex' | 'critical';
  };
}

export interface PolicyDiffSection {
  sectionId: string;
  sectionName: string;
  sectionType: 'text' | 'json' | 'html' | 'markdown' | 'yaml' | 'xml';
  changes: DiffLine[];
  hasChanges: boolean;
  changePercentage: number;
}

export interface TemplateChangeHistory {
  templateId: string;
  templateName: string;
  category: string;
  versions: TemplateVersion[];
  totalChanges: number;
  lastModified: string;
  changeFrequency: 'high' | 'medium' | 'low';
  stabilityScore: number; // 0-100
}

export interface TemplateVersion {
  version: string;
  timestamp: string;
  author: {
    userId: string;
    email: string;
  };
  changelog: string;
  diff?: PolicyDiff;
  status: 'draft' | 'review' | 'approved' | 'published' | 'deprecated';
  compliance: {
    validated: boolean;
    frameworks: string[];
    risks: string[];
  };
}

export interface DiffViewerConfig {
  showLineNumbers: boolean;
  showWhitespace: boolean;
  contextLines: number;
  highlightSyntax: boolean;
  colorScheme: 'light' | 'dark' | 'auto';
  diffAlgorithm: 'myers' | 'patience' | 'histogram' | 'minimal';
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
}

export interface ComplianceChange {
  changeId: string;
  framework: 'gdpr' | 'ccpa' | 'sox' | 'hipaa' | 'pci_dss';
  requirement: string;
  oldCompliance: boolean;
  newCompliance: boolean;
  impact: 'positive' | 'negative' | 'neutral';
  remediation?: {
    required: boolean;
    actions: string[];
    timeline: string;
  };
}

export class PolicyDiffViewer {
  private static instance: PolicyDiffViewer;
  private diffs: Map<string, PolicyDiff> = new Map();
  private templateHistory: Map<string, TemplateChangeHistory> = new Map();
  private config: DiffViewerConfig;

  constructor() {
    this.config = {
      showLineNumbers: true,
      showWhitespace: false,
      contextLines: 3,
      highlightSyntax: true,
      colorScheme: 'auto',
      diffAlgorithm: 'myers',
      ignoreWhitespace: false,
      ignoreCase: false,
    };
  }

  static getInstance(): PolicyDiffViewer {
    if (!PolicyDiffViewer.instance) {
      PolicyDiffViewer.instance = new PolicyDiffViewer();
    }
    return PolicyDiffViewer.instance;
  }

  // Generate diff between two policy versions
  async generatePolicyDiff(
    policyId: string,
    policyName: string,
    oldContent: any,
    newContent: any,
    oldVersion: string,
    newVersion: string,
    changedBy: PolicyDiff['changedBy'],
  ): Promise<PolicyDiff> {
    const diffId = this.generateDiffId();
    const timestamp = new Date().toISOString();

    console.log(
      `🔍 Generating policy diff: ${policyName} (${oldVersion} → ${newVersion})`,
    );

    // Analyze changes at different levels
    const sections = await this.analyzeSections(oldContent, newContent);
    const summary = this.calculateSummary(sections);
    const changeType = this.classifyChangeType(summary);
    const riskLevel = this.assessRiskLevel(changeType, summary);
    const complianceImpact = this.assessComplianceImpact(sections);
    const impact = await this.analyzeImpact(policyId, sections);

    const diff: PolicyDiff = {
      id: diffId,
      timestamp,
      policyId,
      policyName,
      oldVersion,
      newVersion,
      diffType: 'content',
      summary,
      sections,
      changeType,
      riskLevel,
      complianceImpact,
      changedBy,
      approval: {
        required: this.requiresApproval(changeType, riskLevel),
        status: 'pending',
        approvers: this.getRequiredApprovers(changeType, riskLevel),
      },
      impact,
    };

    this.diffs.set(diffId, diff);
    await this.updateTemplateHistory(
      policyId,
      policyName,
      newVersion,
      diff,
      changedBy,
    );

    console.log(
      `✅ Policy diff generated: ${diffId} (${changeType} change, ${riskLevel} risk)`,
    );
    return diff;
  }

  // Generate template diff
  async generateTemplateDiff(
    templateId: string,
    templateName: string,
    oldTemplate: any,
    newTemplate: any,
    changedBy: PolicyDiff['changedBy'],
  ): Promise<PolicyDiff> {
    const oldVersion = oldTemplate.version || 'unknown';
    const newVersion = newTemplate.version || 'unknown';

    // Extract content sections for comparison
    const oldContent = {
      metadata: oldTemplate.metadata || {},
      questions: oldTemplate.questions || [],
      schema: oldTemplate.schema || {},
      template: oldTemplate.template || '',
      styling: oldTemplate.styling || {},
    };

    const newContent = {
      metadata: newTemplate.metadata || {},
      questions: newTemplate.questions || [],
      schema: newTemplate.schema || {},
      template: newTemplate.template || '',
      styling: newTemplate.styling || {},
    };

    return this.generatePolicyDiff(
      templateId,
      templateName,
      oldContent,
      newContent,
      oldVersion,
      newVersion,
      changedBy,
    );
  }

  // Analyze sections for differences
  private async analyzeSections(
    oldContent: any,
    newContent: any,
  ): Promise<PolicyDiffSection[]> {
    const sections: PolicyDiffSection[] = [];

    // Get all unique section keys
    const oldKeys = Object.keys(oldContent || {});
    const newKeys = Object.keys(newContent || {});
    const allKeys = [...new Set([...oldKeys, ...newKeys])];

    for (const key of allKeys) {
      const oldValue = oldContent?.[key];
      const newValue = newContent?.[key];

      const changes = this.generateLineDiff(oldValue, newValue);
      const hasChanges = changes.some((line) => line.type !== 'unchanged');
      const totalLines = changes.length;
      const changedLines = changes.filter(
        (line) => line.type !== 'unchanged',
      ).length;
      const changePercentage =
        totalLines > 0 ? (changedLines / totalLines) * 100 : 0;

      sections.push({
        sectionId: key,
        sectionName: this.formatSectionName(key),
        sectionType: this.detectSectionType(oldValue, newValue),
        changes,
        hasChanges,
        changePercentage,
      });
    }

    return sections;
  }

  // Generate line-by-line diff
  private generateLineDiff(oldValue: any, newValue: any): DiffLine[] {
    const oldLines = this.valueToLines(oldValue);
    const newLines = this.valueToLines(newValue);

    return this.computeDiff(oldLines, newLines);
  }

  // Convert value to lines for diff
  private valueToLines(value: any): string[] {
    if (value === null || value === undefined) {
      return [];
    }

    if (typeof value === 'string') {
      return value.split('\n');
    }

    if (Array.isArray(value) || typeof value === 'object') {
      return JSON.stringify(value, null, 2).split('\n');
    }

    return [String(value)];
  }

  // Compute diff using Myers algorithm (simplified)
  private computeDiff(oldLines: string[], newLines: string[]): DiffLine[] {
    const diffLines: DiffLine[] = [];
    const maxLen = Math.max(oldLines.length, newLines.length);

    let oldIndex = 0;
    let newIndex = 0;
    let lineNumber = 1;

    while (oldIndex < oldLines.length || newIndex < newLines.length) {
      const oldLine = oldLines[oldIndex];
      const newLine = newLines[newIndex];

      if (oldLine === newLine) {
        // Lines are identical
        diffLines.push({
          lineNumber: lineNumber++,
          type: 'unchanged',
          oldContent: oldLine,
          newContent: newLine,
        });
        oldIndex++;
        newIndex++;
      } else if (oldIndex >= oldLines.length) {
        // Only new lines remain
        diffLines.push({
          lineNumber: lineNumber++,
          type: 'added',
          newContent: newLine,
        });
        newIndex++;
      } else if (newIndex >= newLines.length) {
        // Only old lines remain
        diffLines.push({
          lineNumber: lineNumber++,
          type: 'removed',
          oldContent: oldLine,
        });
        oldIndex++;
      } else {
        // Lines differ - mark as modified
        diffLines.push({
          lineNumber: lineNumber++,
          type: 'modified',
          oldContent: oldLine,
          newContent: newLine,
        });
        oldIndex++;
        newIndex++;
      }
    }

    return diffLines;
  }

  // Calculate change summary
  private calculateSummary(
    sections: PolicyDiffSection[],
  ): PolicyDiff['summary'] {
    let totalChanges = 0;
    let addedLines = 0;
    let removedLines = 0;
    let modifiedLines = 0;
    let addedCharacters = 0;
    let removedCharacters = 0;

    sections.forEach((section) => {
      section.changes.forEach((line) => {
        switch (line.type) {
          case 'added':
            addedLines++;
            totalChanges++;
            addedCharacters += line.newContent?.length || 0;
            break;
          case 'removed':
            removedLines++;
            totalChanges++;
            removedCharacters += line.oldContent?.length || 0;
            break;
          case 'modified':
            modifiedLines++;
            totalChanges++;
            addedCharacters += line.newContent?.length || 0;
            removedCharacters += line.oldContent?.length || 0;
            break;
        }
      });
    });

    return {
      totalChanges,
      addedLines,
      removedLines,
      modifiedLines,
      addedCharacters,
      removedCharacters,
    };
  }

  // Classify change type
  private classifyChangeType(
    summary: PolicyDiff['summary'],
  ): PolicyDiff['changeType'] {
    const { totalChanges, addedLines, removedLines, modifiedLines } = summary;

    // Breaking change indicators
    if (removedLines > addedLines || removedLines > 10) {
      return 'breaking';
    }

    // Major change indicators
    if (totalChanges > 50 || modifiedLines > 20) {
      return 'major';
    }

    // Minor change indicators
    if (totalChanges > 10 || addedLines > 5) {
      return 'minor';
    }

    // Patch change
    return 'patch';
  }

  // Assess risk level
  private assessRiskLevel(
    changeType: PolicyDiff['changeType'],
    summary: PolicyDiff['summary'],
  ): PolicyDiff['riskLevel'] {
    if (changeType === 'breaking') {
      return 'critical';
    }

    if (changeType === 'major' || summary.removedLines > 5) {
      return 'high';
    }

    if (changeType === 'minor' || summary.totalChanges > 5) {
      return 'medium';
    }

    return 'low';
  }

  // Assess compliance impact
  private assessComplianceImpact(sections: PolicyDiffSection[]): boolean {
    const complianceKeywords = [
      'gdpr',
      'privacy',
      'consent',
      'data protection',
      'retention',
      'sox',
      'financial',
      'audit',
      'control',
      'segregation',
      'hipaa',
      'health',
      'medical',
      'patient',
      'pci',
      'payment',
      'card',
      'transaction',
    ];

    return sections.some((section) =>
      section.changes.some((line) => {
        const content = (
          line.oldContent ||
          line.newContent ||
          ''
        ).toLowerCase();
        return complianceKeywords.some((keyword) => content.includes(keyword));
      }),
    );
  }

  // Analyze impact of changes
  private async analyzeImpact(
    policyId: string,
    sections: PolicyDiffSection[],
  ): Promise<PolicyDiff['impact']> {
    // Simulate impact analysis - in production, this would query actual dependencies
    const affectedDocuments = this.findAffectedDocuments(policyId, sections);
    const affectedUsers = this.findAffectedUsers(policyId, sections);
    const affectedProcesses = this.findAffectedProcesses(policyId, sections);
    const downstreamChanges = this.identifyDownstreamChanges(
      policyId,
      sections,
    );
    const rollbackComplexity = this.assessRollbackComplexity(sections);

    return {
      affectedDocuments,
      affectedUsers,
      affectedProcesses,
      downstreamChanges,
      rollbackComplexity,
    };
  }

  // Get policy diff by ID
  getPolicyDiff(diffId: string): PolicyDiff | undefined {
    return this.diffs.get(diffId);
  }

  // Get template change history
  getTemplateHistory(templateId: string): TemplateChangeHistory | undefined {
    return this.templateHistory.get(templateId);
  }

  // Search diffs
  searchDiffs(query: {
    policyId?: string;
    changeType?: PolicyDiff['changeType'];
    riskLevel?: PolicyDiff['riskLevel'];
    dateFrom?: string;
    dateTo?: string;
    changedBy?: string;
    complianceImpact?: boolean;
  }): PolicyDiff[] {
    let results = Array.from(this.diffs.values());

    if (query.policyId) {
      results = results.filter((diff) => diff.policyId === query.policyId);
    }

    if (query.changeType) {
      results = results.filter((diff) => diff.changeType === query.changeType);
    }

    if (query.riskLevel) {
      results = results.filter((diff) => diff.riskLevel === query.riskLevel);
    }

    if (query.dateFrom) {
      results = results.filter((diff) => diff.timestamp >= query.dateFrom!);
    }

    if (query.dateTo) {
      results = results.filter((diff) => diff.timestamp <= query.dateTo!);
    }

    if (query.changedBy) {
      results = results.filter(
        (diff) => diff.changedBy.userId === query.changedBy,
      );
    }

    if (query.complianceImpact !== undefined) {
      results = results.filter(
        (diff) => diff.complianceImpact === query.complianceImpact,
      );
    }

    return results.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  // Generate HTML diff view
  generateHTMLDiff(diffId: string): string {
    const diff = this.diffs.get(diffId);
    if (!diff) {
      throw new Error('Diff not found');
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Policy Diff: ${diff.policyName}</title>
      <style>
        body { font-family: monospace; margin: 20px; }
        .diff-header { background: #f0f0f0; padding: 10px; margin-bottom: 20px; }
        .diff-section { margin-bottom: 30px; border: 1px solid #ddd; }
        .section-header { background: #e9ecef; padding: 8px; font-weight: bold; }
        .diff-line { padding: 2px 4px; white-space: pre-wrap; }
        .line-number { display: inline-block; width: 40px; color: #666; }
        .unchanged { background: white; }
        .added { background: #d4edda; color: #155724; }
        .removed { background: #f8d7da; color: #721c24; }
        .modified { background: #fff3cd; color: #856404; }
      </style>
    </head>
    <body>
      <div class="diff-header">
        <h1>Policy Diff: ${diff.policyName}</h1>
        <p><strong>Version:</strong> ${diff.oldVersion} → ${diff.newVersion}</p>
        <p><strong>Changed by:</strong> ${diff.changedBy.email}</p>
        <p><strong>Timestamp:</strong> ${diff.timestamp}</p>
        <p><strong>Change Type:</strong> ${diff.changeType} (${diff.riskLevel} risk)</p>
        <p><strong>Total Changes:</strong> ${diff.summary.totalChanges}</p>
      </div>
      
      ${diff.sections
        .filter((s) => s.hasChanges)
        .map(
          (section) => `
        <div class="diff-section">
          <div class="section-header">${section.sectionName} (${section.changePercentage.toFixed(1)}% changed)</div>
          ${section.changes
            .map(
              (line) => `
            <div class="diff-line ${line.type}">
              <span class="line-number">${line.lineNumber}</span>
              ${line.type === 'removed' ? '- ' + (line.oldContent || '') : ''}
              ${line.type === 'added' ? '+ ' + (line.newContent || '') : ''}
              ${line.type === 'modified' ? '~ ' + (line.newContent || '') : ''}
              ${line.type === 'unchanged' ? '  ' + (line.oldContent || '') : ''}
            </div>
          `,
            )
            .join('')}
        </div>
      `,
        )
        .join('')}
    </body>
    </html>`;

    return html;
  }

  // Approve or reject diff
  async approveDiff(
    diffId: string,
    approverId: string,
    approverEmail: string,
    decision: 'approve' | 'reject',
    comments?: string,
  ): Promise<void> {
    const diff = this.diffs.get(diffId);
    if (!diff) {
      throw new Error('Diff not found');
    }

    const approver = diff.approval.approvers.find(
      (a) => a.userId === approverId,
    );
    if (!approver) {
      throw new Error('Approver not authorized');
    }

    approver.decision = decision;
    approver.timestamp = new Date().toISOString();
    approver.comments = comments;

    // Update overall approval status
    const allDecisions = diff.approval.approvers.map((a) => a.decision);
    if (allDecisions.some((d) => d === 'reject')) {
      diff.approval.status = 'rejected';
    } else if (allDecisions.every((d) => d === 'approve')) {
      diff.approval.status = 'approved';
    }

    console.log(`📋 Diff ${decision}: ${diffId} by ${approverEmail}`);
  }

  // Utility methods
  private updateTemplateHistory(
    templateId: string,
    templateName: string,
    version: string,
    diff: PolicyDiff,
    author: PolicyDiff['changedBy'],
  ): void {
    let history = this.templateHistory.get(templateId);

    if (!history) {
      history = {
        templateId,
        templateName,
        category: 'legal_document',
        versions: [],
        totalChanges: 0,
        lastModified: diff.timestamp,
        changeFrequency: 'low',
        stabilityScore: 100,
      };
      this.templateHistory.set(templateId, history);
    }

    const newVersion: TemplateVersion = {
      version,
      timestamp: diff.timestamp,
      author: {
        userId: author.userId,
        email: author.email,
      },
      changelog: `${diff.changeType} change with ${diff.summary.totalChanges} modifications`,
      diff,
      status: 'review',
      compliance: {
        validated: false,
        frameworks: ['gdpr', 'sox'],
        risks: diff.riskLevel === 'high' ? ['compliance_violation'] : [],
      },
    };

    history.versions.push(newVersion);
    history.totalChanges += diff.summary.totalChanges;
    history.lastModified = diff.timestamp;

    // Update metrics
    const recentChanges = history.versions.filter(
      (v) =>
        new Date(v.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    ).length;

    history.changeFrequency =
      recentChanges > 10 ? 'high' : recentChanges > 3 ? 'medium' : 'low';
    history.stabilityScore = Math.max(0, 100 - recentChanges * 5);
  }

  private requiresApproval(
    changeType: PolicyDiff['changeType'],
    riskLevel: PolicyDiff['riskLevel'],
  ): boolean {
    return (
      changeType === 'major' ||
      changeType === 'breaking' ||
      riskLevel === 'high' ||
      riskLevel === 'critical'
    );
  }

  private getRequiredApprovers(
    changeType: PolicyDiff['changeType'],
    riskLevel: PolicyDiff['riskLevel'],
  ): PolicyDiff['approval']['approvers'] {
    const approvers: PolicyDiff['approval']['approvers'] = [];

    if (riskLevel === 'critical' || changeType === 'breaking') {
      approvers.push(
        {
          userId: 'legal_counsel',
          email: 'legal@company.com',
          decision: 'pending',
        },
        {
          userId: 'compliance_officer',
          email: 'compliance@company.com',
          decision: 'pending',
        },
        { userId: 'cto', email: 'cto@company.com', decision: 'pending' },
      );
    } else if (riskLevel === 'high' || changeType === 'major') {
      approvers.push(
        {
          userId: 'legal_counsel',
          email: 'legal@company.com',
          decision: 'pending',
        },
        {
          userId: 'compliance_officer',
          email: 'compliance@company.com',
          decision: 'pending',
        },
      );
    } else {
      approvers.push({
        userId: 'policy_manager',
        email: 'policy@company.com',
        decision: 'pending',
      });
    }

    return approvers;
  }

  private detectSectionType(
    oldValue: any,
    newValue: any,
  ): PolicyDiffSection['sectionType'] {
    const value = newValue || oldValue;

    if (typeof value === 'string') {
      if (value.includes('<') && value.includes('>')) return 'html';
      if (value.includes('#') || value.includes('**')) return 'markdown';
      if (value.includes('<?xml')) return 'xml';
      return 'text';
    }

    if (Array.isArray(value) || typeof value === 'object') {
      return 'json';
    }

    return 'text';
  }

  private formatSectionName(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  // Mock methods for impact analysis (would be implemented with real data)
  private findAffectedDocuments(
    policyId: string,
    sections: PolicyDiffSection[],
  ): string[] {
    return [`doc_${Math.random().toString(36).substr(2, 8)}`];
  }

  private findAffectedUsers(
    policyId: string,
    sections: PolicyDiffSection[],
  ): string[] {
    return [`user_${Math.random().toString(36).substr(2, 8)}`];
  }

  private findAffectedProcesses(
    policyId: string,
    sections: PolicyDiffSection[],
  ): string[] {
    return ['document_generation', 'approval_workflow'];
  }

  private identifyDownstreamChanges(
    policyId: string,
    sections: PolicyDiffSection[],
  ): string[] {
    return ['template_validation', 'compliance_check'];
  }

  private assessRollbackComplexity(
    sections: PolicyDiffSection[],
  ): PolicyDiff['impact']['rollbackComplexity'] {
    const totalChanges = sections.reduce((sum, s) => sum + s.changes.length, 0);

    if (totalChanges > 100) return 'critical';
    if (totalChanges > 50) return 'complex';
    if (totalChanges > 10) return 'moderate';
    return 'simple';
  }

  private generateDiffId(): string {
    return `diff_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  // Performance metrics
  getDiffMetrics(): {
    totalDiffs: number;
    avgChangesPerDiff: number;
    changeTypeDistribution: Record<string, number>;
    riskLevelDistribution: Record<string, number>;
    approvalPendingCount: number;
    complianceImpactCount: number;
  } {
    const allDiffs = Array.from(this.diffs.values());

    const changeTypes: Record<string, number> = {};
    const riskLevels: Record<string, number> = {};
    let totalChanges = 0;
    let approvalPending = 0;
    let complianceImpact = 0;

    allDiffs.forEach((diff) => {
      changeTypes[diff.changeType] = (changeTypes[diff.changeType] || 0) + 1;
      riskLevels[diff.riskLevel] = (riskLevels[diff.riskLevel] || 0) + 1;
      totalChanges += diff.summary.totalChanges;

      if (diff.approval.status === 'pending') approvalPending++;
      if (diff.complianceImpact) complianceImpact++;
    });

    return {
      totalDiffs: allDiffs.length,
      avgChangesPerDiff:
        allDiffs.length > 0 ? Math.round(totalChanges / allDiffs.length) : 0,
      changeTypeDistribution: changeTypes,
      riskLevelDistribution: riskLevels,
      approvalPendingCount: approvalPending,
      complianceImpactCount: complianceImpact,
    };
  }
}

// Export singleton instance
export const policyDiffViewer = PolicyDiffViewer.getInstance();
