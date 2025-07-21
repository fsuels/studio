// Advanced Document Lifecycle Management System
// Track document status through draft → pending e-sign → notarized → archived
// Heat-map visualization and stalled document detection

export type DocumentStatus =
  | 'draft'
  | 'pending_review'
  | 'pending_esign'
  | 'pending_notarization'
  | 'pending_payment'
  | 'completed'
  | 'archived'
  | 'cancelled'
  | 'stalled';

export type DocumentPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface DocumentLifecycleEvent {
  id: string;
  documentId: string;
  eventType:
    | 'status_change'
    | 'reminder_sent'
    | 'escalation'
    | 'user_action'
    | 'system_action';
  fromStatus?: DocumentStatus;
  toStatus: DocumentStatus;
  timestamp: string;
  triggeredBy: 'user' | 'system' | 'admin';
  userId?: string;
  adminId?: string;
  metadata: {
    reason?: string;
    notes?: string;
    reminderType?: string;
    escalationLevel?: number;
    automationRule?: string;
    duration?: number; // Time spent in previous status (seconds)
    expectedDuration?: number; // Expected time for this status
    delayReason?: string;
    actionRequired?: string;
    assignedTo?: string;
    dueDate?: string;
    priority?: DocumentPriority;
  };
}

export interface DocumentWorkflow {
  documentId: string;
  documentType: string;
  orderId?: string;
  customerId: string;
  customerEmail: string;
  currentStatus: DocumentStatus;
  priority: DocumentPriority;

  // Lifecycle tracking
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  archivedAt?: string;

  // Status timestamps
  statusTimeline: {
    draft?: string;
    pendingReview?: string;
    pendingEsign?: string;
    pendingNotarization?: string;
    pendingPayment?: string;
    completed?: string;
    archived?: string;
  };

  // Time tracking
  timeInCurrentStatus: number; // seconds
  totalLifecycleTime: number; // seconds
  expectedCompletionTime: number; // seconds

  // Workflow configuration
  requiredSteps: DocumentStatus[];
  optionalSteps: DocumentStatus[];
  autoAdvanceRules: WorkflowRule[];

  // Stall detection
  isStalled: boolean;
  stallReason?: string;
  stalledAt?: string;
  stallThreshold: number; // seconds before considering stalled

  // Notifications and reminders
  lastReminderSent?: string;
  reminderCount: number;
  escalationLevel: number;
  assignedTo?: string;

  // Metadata
  value?: number;
  tags: string[];
  notes: string;
  version: number;

  // Events history
  events: DocumentLifecycleEvent[];
}

export interface WorkflowRule {
  id: string;
  name: string;
  condition: {
    field: string;
    operator:
      | 'equals'
      | 'not_equals'
      | 'greater_than'
      | 'less_than'
      | 'contains';
    value: any;
  };
  action: {
    type:
      | 'advance_status'
      | 'send_reminder'
      | 'escalate'
      | 'assign'
      | 'set_priority';
    toStatus?: DocumentStatus;
    reminderTemplate?: string;
    assignTo?: string;
    priority?: DocumentPriority;
    delay?: number; // seconds to wait before executing
  };
  enabled: boolean;
}

export interface DocumentHeatMapData {
  status: DocumentStatus;
  count: number;
  percentage: number;
  avgTimeInStatus: number;
  stalledCount: number;
  overDueCount: number;
  completionRate: number;
  bottleneckScore: number; // 0-100, higher = bigger bottleneck
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  urgentCount: number;
  revenueImpact: number;
}

export interface WorkflowMetrics {
  overview: {
    totalActiveDocuments: number;
    stalledDocuments: number;
    overDueDocuments: number;
    averageCompletionTime: number;
    completionRate: number;
    bottleneckStatus: DocumentStatus;
    totalValue: number;
  };
  statusDistribution: DocumentHeatMapData[];
  performanceMetrics: {
    avgTimeByStatus: Record<DocumentStatus, number>;
    completionRateByType: Record<string, number>;
    stallRateByStatus: Record<DocumentStatus, number>;
    escalationRate: number;
    automationEfficiency: number;
  };
  trends: {
    completionTrend: Array<{
      date: string;
      completed: number;
      stalled: number;
    }>;
    statusTrends: Array<{
      date: string;
      status: DocumentStatus;
      count: number;
    }>;
    performanceTrend: Array<{ date: string; avgCompletionTime: number }>;
  };
}

export interface StalledDocumentAnalysis {
  stalledDocuments: Array<{
    documentId: string;
    documentType: string;
    customerEmail: string;
    currentStatus: DocumentStatus;
    stalledFor: number; // seconds
    stallReason: string;
    priority: DocumentPriority;
    value?: number;
    lastActivity: string;
    recommendedActions: string[];
    escalationSuggested: boolean;
    unblockingSteps: Array<{
      action: string;
      responsibility: 'customer' | 'admin' | 'system';
      estimatedTime: number;
      automated: boolean;
    }>;
  }>;
  stallPatterns: Array<{
    status: DocumentStatus;
    commonReasons: string[];
    avgStallTime: number;
    impactScore: number;
    suggestedFixes: string[];
  }>;
  unblockingOpportunities: {
    automationOpportunities: string[];
    processImprovements: string[];
    communicationFixes: string[];
    systemEnhancements: string[];
  };
}

class DocumentLifecycleEngine {
  private documents: Map<string, DocumentWorkflow> = new Map();
  private workflowRules: WorkflowRule[] = [];

  constructor() {
    this.initializeDefaultRules();
    this.startBackgroundTasks();
  }

  // Track document status change
  async updateDocumentStatus(
    documentId: string,
    newStatus: DocumentStatus,
    metadata: Partial<DocumentLifecycleEvent['metadata']> = {},
    triggeredBy: 'user' | 'system' | 'admin' = 'user',
    userId?: string,
  ): Promise<void> {
    let document = this.documents.get(documentId);

    if (!document) {
      document = this.createNewDocumentWorkflow(documentId, metadata);
      this.documents.set(documentId, document);
    }

    const previousStatus = document.currentStatus;
    const now = new Date().toISOString();

    // Calculate time in previous status
    const timeInPreviousStatus = previousStatus
      ? (Date.now() -
          new Date(
            document.statusTimeline[
              this.getStatusTimelineKey(previousStatus)
            ] || now,
          ).getTime()) /
        1000
      : 0;

    // Update document
    document.currentStatus = newStatus;
    document.updatedAt = now;
    document.statusTimeline[this.getStatusTimelineKey(newStatus)] = now;
    document.timeInCurrentStatus = 0;
    document.totalLifecycleTime += timeInPreviousStatus;

    // Check if completed or archived
    if (newStatus === 'completed') {
      document.completedAt = now;
      document.totalLifecycleTime =
        (Date.now() - new Date(document.createdAt).getTime()) / 1000;
    } else if (newStatus === 'archived') {
      document.archivedAt = now;
    }

    // Create lifecycle event
    const event: DocumentLifecycleEvent = {
      id: this.generateEventId(),
      documentId,
      eventType: 'status_change',
      fromStatus: previousStatus,
      toStatus: newStatus,
      timestamp: now,
      triggeredBy,
      userId,
      metadata: {
        ...metadata,
        duration: timeInPreviousStatus,
      },
    };

    document.events.push(event);

    // Check for stalls and apply workflow rules
    this.checkForStall(document);
    await this.applyWorkflowRules(document);

    // Store document
    this.persistDocument(document);
  }

  // Detect stalled documents
  detectStalledDocuments(): DocumentWorkflow[] {
    const stalledDocs: DocumentWorkflow[] = [];
    const now = Date.now();

    for (const document of this.documents.values()) {
      if (this.isDocumentStalled(document, now)) {
        document.isStalled = true;
        if (!document.stalledAt) {
          document.stalledAt = new Date().toISOString();
          document.stallReason = this.inferStallReason(document);
        }
        stalledDocs.push(document);
      }
    }

    return stalledDocs;
  }

  // Generate workflow metrics and heat-map data
  generateWorkflowMetrics(timeframe: string = '30d'): WorkflowMetrics {
    const documents = this.getDocumentsInTimeframe(timeframe);
    const activeDocuments = documents.filter(
      (d) => !['completed', 'archived', 'cancelled'].includes(d.currentStatus),
    );
    const stalledDocuments = documents.filter((d) => d.isStalled);
    const completedDocuments = documents.filter(
      (d) => d.currentStatus === 'completed',
    );

    // Calculate status distribution
    const statusCounts = new Map<DocumentStatus, number>();
    const statusTimes = new Map<DocumentStatus, number[]>();
    const statusStalled = new Map<DocumentStatus, number>();

    documents.forEach((doc) => {
      // Count by status
      statusCounts.set(
        doc.currentStatus,
        (statusCounts.get(doc.currentStatus) || 0) + 1,
      );

      // Collect time data
      if (!statusTimes.has(doc.currentStatus)) {
        statusTimes.set(doc.currentStatus, []);
      }
      statusTimes.get(doc.currentStatus)!.push(doc.timeInCurrentStatus);

      // Count stalled
      if (doc.isStalled) {
        statusStalled.set(
          doc.currentStatus,
          (statusStalled.get(doc.currentStatus) || 0) + 1,
        );
      }
    });

    const statusDistribution: DocumentHeatMapData[] = Array.from(
      statusCounts.entries(),
    ).map(([status, count]) => {
      const times = statusTimes.get(status) || [];
      const avgTime =
        times.length > 0
          ? times.reduce((sum, time) => sum + time, 0) / times.length
          : 0;
      const stalledCount = statusStalled.get(status) || 0;

      return {
        status,
        count,
        percentage: (count / documents.length) * 100,
        avgTimeInStatus: avgTime,
        stalledCount,
        overDueCount: this.getOverDueCountForStatus(documents, status),
        completionRate: this.getCompletionRateForStatus(documents, status),
        bottleneckScore: this.calculateBottleneckScore(
          status,
          count,
          avgTime,
          stalledCount,
        ),
        trendDirection: this.calculateTrendDirection(status, timeframe),
        urgentCount: documents.filter(
          (d) => d.currentStatus === status && d.priority === 'urgent',
        ).length,
        revenueImpact: documents
          .filter((d) => d.currentStatus === status)
          .reduce((sum, d) => sum + (d.value || 0), 0),
      };
    });

    return {
      overview: {
        totalActiveDocuments: activeDocuments.length,
        stalledDocuments: stalledDocuments.length,
        overDueDocuments: this.getOverDueDocuments(documents).length,
        averageCompletionTime:
          this.calculateAverageCompletionTime(completedDocuments),
        completionRate: (completedDocuments.length / documents.length) * 100,
        bottleneckStatus: this.identifyBottleneckStatus(statusDistribution),
        totalValue: documents.reduce((sum, doc) => sum + (doc.value || 0), 0),
      },
      statusDistribution,
      performanceMetrics: this.calculatePerformanceMetrics(documents),
      trends: this.calculateTrends(timeframe),
    };
  }

  // Analyze stalled documents and suggest unblocking actions
  analyzeStalledDocuments(): StalledDocumentAnalysis {
    const stalledDocs = this.detectStalledDocuments();

    const stalledDocuments = stalledDocs.map((doc) => {
      const stalledFor = doc.stalledAt
        ? (Date.now() - new Date(doc.stalledAt).getTime()) / 1000
        : doc.timeInCurrentStatus;

      return {
        documentId: doc.documentId,
        documentType: doc.documentType,
        customerEmail: doc.customerEmail,
        currentStatus: doc.currentStatus,
        stalledFor,
        stallReason: doc.stallReason || 'Unknown',
        priority: doc.priority,
        value: doc.value,
        lastActivity: doc.updatedAt,
        recommendedActions: this.generateRecommendedActions(doc),
        escalationSuggested: this.shouldEscalate(doc),
        unblockingSteps: this.generateUnblockingSteps(doc),
      };
    });

    return {
      stalledDocuments,
      stallPatterns: this.identifyStallPatterns(stalledDocs),
      unblockingOpportunities:
        this.identifyUnblockingOpportunities(stalledDocs),
    };
  }

  // Auto-unblock stalled documents
  async autoUnblockStalledDocuments(): Promise<{
    attempted: number;
    successful: number;
    failed: Array<{ documentId: string; reason: string }>;
  }> {
    const stalledDocs = this.detectStalledDocuments();
    let attempted = 0;
    let successful = 0;
    const failed: Array<{ documentId: string; reason: string }> = [];

    for (const doc of stalledDocs) {
      try {
        attempted++;
        const unblocked = await this.attemptAutoUnblock(doc);
        if (unblocked) {
          successful++;
        } else {
          failed.push({
            documentId: doc.documentId,
            reason: 'No applicable auto-unblock rules',
          });
        }
      } catch (error) {
        failed.push({
          documentId: doc.documentId,
          reason: (error as Error).message,
        });
      }
    }

    return { attempted, successful, failed };
  }

  // Private helper methods
  private createNewDocumentWorkflow(
    documentId: string,
    metadata: any,
  ): DocumentWorkflow {
    const now = new Date().toISOString();

    return {
      documentId,
      documentType: metadata.documentType || 'unknown',
      customerId: metadata.customerId || 'unknown',
      customerEmail: metadata.customerEmail || 'unknown',
      currentStatus: 'draft',
      priority: metadata.priority || 'medium',
      createdAt: now,
      updatedAt: now,
      statusTimeline: { draft: now },
      timeInCurrentStatus: 0,
      totalLifecycleTime: 0,
      expectedCompletionTime: this.getExpectedCompletionTime(
        metadata.documentType,
      ),
      requiredSteps: this.getRequiredSteps(metadata.documentType),
      optionalSteps: this.getOptionalSteps(metadata.documentType),
      autoAdvanceRules: this.getAutoAdvanceRules(metadata.documentType),
      isStalled: false,
      stallThreshold: this.getStallThreshold(metadata.documentType),
      reminderCount: 0,
      escalationLevel: 0,
      value: metadata.value,
      tags: metadata.tags || [],
      notes: '',
      version: 1,
      events: [],
    };
  }

  private isDocumentStalled(document: DocumentWorkflow, now: number): boolean {
    if (
      ['completed', 'archived', 'cancelled'].includes(document.currentStatus)
    ) {
      return false;
    }

    const currentStatusStartTime = new Date(
      document.statusTimeline[
        this.getStatusTimelineKey(document.currentStatus)
      ] || document.updatedAt,
    ).getTime();

    const timeInCurrentStatus = (now - currentStatusStartTime) / 1000;
    return timeInCurrentStatus > document.stallThreshold;
  }

  private inferStallReason(document: DocumentWorkflow): string {
    const statusReasons: Record<DocumentStatus, string> = {
      draft: 'Customer has not completed document creation',
      pending_review: 'Document pending admin review',
      pending_esign: 'Customer has not signed document',
      pending_notarization: 'Document pending notary signature',
      pending_payment: 'Payment not received from customer',
      completed: 'Document completed',
      archived: 'Document archived',
      cancelled: 'Document cancelled',
      stalled: 'Document stalled for unknown reason',
    };

    return statusReasons[document.currentStatus] || 'Unknown stall reason';
  }

  private generateRecommendedActions(document: DocumentWorkflow): string[] {
    const actions: Record<DocumentStatus, string[]> = {
      draft: [
        'Send reminder email to customer',
        'Offer customer support assistance',
        'Simplify document creation process',
      ],
      pending_review: [
        'Assign to available admin',
        'Set review deadline',
        'Escalate to supervisor if overdue',
      ],
      pending_esign: [
        'Send e-signature reminder',
        'Provide signing instructions',
        'Offer phone support for signing',
      ],
      pending_notarization: [
        'Schedule notary appointment',
        'Send notarization instructions',
        'Offer mobile notary service',
      ],
      pending_payment: [
        'Send payment reminder',
        'Offer payment plan options',
        'Check for payment processing issues',
      ],
      completed: [],
      archived: [],
      cancelled: [],
      stalled: ['Manual review required'],
    };

    return actions[document.currentStatus] || ['Manual review required'];
  }

  private generateUnblockingSteps(document: DocumentWorkflow): Array<{
    action: string;
    responsibility: 'customer' | 'admin' | 'system';
    estimatedTime: number;
    automated: boolean;
  }> {
    const steps: Record<DocumentStatus, Array<any>> = {
      draft: [
        {
          action: 'Send automated reminder email',
          responsibility: 'system',
          estimatedTime: 300,
          automated: true,
        },
        {
          action: 'Customer completes document',
          responsibility: 'customer',
          estimatedTime: 1800,
          automated: false,
        },
      ],
      pending_review: [
        {
          action: 'Auto-assign to available admin',
          responsibility: 'system',
          estimatedTime: 60,
          automated: true,
        },
        {
          action: 'Admin reviews document',
          responsibility: 'admin',
          estimatedTime: 900,
          automated: false,
        },
      ],
      pending_esign: [
        {
          action: 'Send signing reminder',
          responsibility: 'system',
          estimatedTime: 300,
          automated: true,
        },
        {
          action: 'Customer signs document',
          responsibility: 'customer',
          estimatedTime: 600,
          automated: false,
        },
      ],
      pending_notarization: [
        {
          action: 'Schedule notary appointment',
          responsibility: 'admin',
          estimatedTime: 1800,
          automated: false,
        },
        {
          action: 'Complete notarization',
          responsibility: 'customer',
          estimatedTime: 1800,
          automated: false,
        },
      ],
      pending_payment: [
        {
          action: 'Send payment reminder',
          responsibility: 'system',
          estimatedTime: 300,
          automated: true,
        },
        {
          action: 'Process payment',
          responsibility: 'customer',
          estimatedTime: 600,
          automated: false,
        },
      ],
      completed: [],
      archived: [],
      cancelled: [],
      stalled: [
        {
          action: 'Manual review and intervention',
          responsibility: 'admin',
          estimatedTime: 1800,
          automated: false,
        },
      ],
    };

    return steps[document.currentStatus] || [];
  }

  private shouldEscalate(document: DocumentWorkflow): boolean {
    return (
      document.priority === 'urgent' ||
      document.escalationLevel >= 2 ||
      (document.value && document.value > 100) ||
      document.timeInCurrentStatus > document.stallThreshold * 2
    );
  }

  private async attemptAutoUnblock(
    document: DocumentWorkflow,
  ): Promise<boolean> {
    // Implement auto-unblocking logic based on document status and workflow rules
    switch (document.currentStatus) {
      case 'pending_review':
        // Auto-assign to available admin
        return await this.autoAssignToAdmin(document);

      case 'pending_esign':
      case 'pending_payment':
        // Send automated reminder
        return await this.sendAutomatedReminder(document);

      default:
        return false;
    }
  }

  private async autoAssignToAdmin(
    document: DocumentWorkflow,
  ): Promise<boolean> {
    // In production, check admin availability and assign
    console.log(
      `Auto-assigning document ${document.documentId} to available admin`,
    );
    return true;
  }

  private async sendAutomatedReminder(
    document: DocumentWorkflow,
  ): Promise<boolean> {
    // In production, send actual reminder emails
    console.log(
      `Sending automated reminder for document ${document.documentId}`,
    );
    document.lastReminderSent = new Date().toISOString();
    document.reminderCount++;
    return true;
  }

  private checkForStall(document: DocumentWorkflow): void {
    const now = Date.now();
    if (this.isDocumentStalled(document, now) && !document.isStalled) {
      document.isStalled = true;
      document.stalledAt = new Date().toISOString();
      document.stallReason = this.inferStallReason(document);
    }
  }

  private async applyWorkflowRules(document: DocumentWorkflow): Promise<void> {
    for (const rule of this.workflowRules) {
      if (rule.enabled && this.evaluateRuleCondition(rule, document)) {
        await this.executeRuleAction(rule, document);
      }
    }
  }

  private evaluateRuleCondition(
    rule: WorkflowRule,
    document: DocumentWorkflow,
  ): boolean {
    // Implement rule condition evaluation logic
    return false; // Simplified for demo
  }

  private async executeRuleAction(
    rule: WorkflowRule,
    document: DocumentWorkflow,
  ): Promise<void> {
    // Implement rule action execution logic
    console.log(
      `Executing rule ${rule.name} for document ${document.documentId}`,
    );
  }

  private initializeDefaultRules(): void {
    this.workflowRules = [
      {
        id: 'auto_reminder_esign',
        name: 'Auto-send e-signature reminders',
        condition: {
          field: 'status',
          operator: 'equals',
          value: 'pending_esign',
        },
        action: {
          type: 'send_reminder',
          reminderTemplate: 'esign_reminder',
          delay: 86400,
        },
        enabled: true,
      },
      {
        id: 'escalate_high_value',
        name: 'Escalate high-value stalled documents',
        condition: { field: 'value', operator: 'greater_than', value: 200 },
        action: { type: 'escalate', priority: 'urgent' as DocumentPriority },
        enabled: true,
      },
    ];
  }

  private startBackgroundTasks(): void {
    // In production, set up periodic tasks for stall detection and auto-unblocking
    setInterval(() => {
      this.detectStalledDocuments();
      this.autoUnblockStalledDocuments();
    }, 300000); // Every 5 minutes
  }

  // Additional helper methods...
  private getStatusTimelineKey(
    status: DocumentStatus,
  ): keyof DocumentWorkflow['statusTimeline'] {
    const mapping: Record<
      DocumentStatus,
      keyof DocumentWorkflow['statusTimeline']
    > = {
      draft: 'draft',
      pending_review: 'pendingReview',
      pending_esign: 'pendingEsign',
      pending_notarization: 'pendingNotarization',
      pending_payment: 'pendingPayment',
      completed: 'completed',
      archived: 'archived',
      cancelled: 'completed', // Fallback
      stalled: 'draft', // Fallback
    };
    return mapping[status];
  }

  private getExpectedCompletionTime(documentType: string): number {
    // Return expected completion time in seconds based on document type
    const defaults: Record<string, number> = {
      'lease-agreement': 7 * 24 * 3600, // 7 days
      'llc-operating-agreement': 5 * 24 * 3600, // 5 days
      'promissory-note': 3 * 24 * 3600, // 3 days
      default: 5 * 24 * 3600, // 5 days
    };
    return defaults[documentType] || defaults.default;
  }

  private getRequiredSteps(documentType: string): DocumentStatus[] {
    return ['draft', 'pending_esign', 'completed'];
  }

  private getOptionalSteps(documentType: string): DocumentStatus[] {
    return ['pending_review', 'pending_notarization'];
  }

  private getAutoAdvanceRules(documentType: string): WorkflowRule[] {
    return [];
  }

  private getStallThreshold(documentType: string): number {
    // Return stall threshold in seconds
    return 24 * 3600; // 24 hours
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private persistDocument(document: DocumentWorkflow): void {
    // In production, persist to database
    console.log(`Persisting document ${document.documentId}`);
  }

  private getDocumentsInTimeframe(timeframe: string): DocumentWorkflow[] {
    // Filter documents by timeframe
    return Array.from(this.documents.values());
  }

  private getOverDueCountForStatus(
    documents: DocumentWorkflow[],
    status: DocumentStatus,
  ): number {
    return documents.filter(
      (d) => d.currentStatus === status && this.isOverDue(d),
    ).length;
  }

  private getCompletionRateForStatus(
    documents: DocumentWorkflow[],
    status: DocumentStatus,
  ): number {
    const statusDocs = documents.filter((d) => d.currentStatus === status);
    const completedDocs = documents.filter(
      (d) => d.currentStatus === 'completed',
    );
    return statusDocs.length > 0
      ? (completedDocs.length / statusDocs.length) * 100
      : 0;
  }

  private calculateBottleneckScore(
    status: DocumentStatus,
    count: number,
    avgTime: number,
    stalledCount: number,
  ): number {
    // Calculate bottleneck score (0-100)
    const timeScore = Math.min(100, (avgTime / 86400) * 20); // Time component
    const stallScore = stalledCount > 0 ? (stalledCount / count) * 50 : 0; // Stall component
    const volumeScore = Math.min(30, count * 2); // Volume component

    return Math.min(100, timeScore + stallScore + volumeScore);
  }

  private calculateTrendDirection(
    status: DocumentStatus,
    timeframe: string,
  ): 'increasing' | 'decreasing' | 'stable' {
    // Simplified trend calculation
    return 'stable';
  }

  private getOverDueDocuments(
    documents: DocumentWorkflow[],
  ): DocumentWorkflow[] {
    return documents.filter((d) => this.isOverDue(d));
  }

  private isOverDue(document: DocumentWorkflow): boolean {
    const now = Date.now();
    const created = new Date(document.createdAt).getTime();
    const elapsed = (now - created) / 1000;
    return elapsed > document.expectedCompletionTime;
  }

  private calculateAverageCompletionTime(
    completedDocuments: DocumentWorkflow[],
  ): number {
    if (completedDocuments.length === 0) return 0;
    return (
      completedDocuments.reduce((sum, doc) => sum + doc.totalLifecycleTime, 0) /
      completedDocuments.length
    );
  }

  private identifyBottleneckStatus(
    statusDistribution: DocumentHeatMapData[],
  ): DocumentStatus {
    return statusDistribution.reduce((max, current) =>
      current.bottleneckScore > max.bottleneckScore ? current : max,
    ).status;
  }

  private calculatePerformanceMetrics(
    documents: DocumentWorkflow[],
  ): WorkflowMetrics['performanceMetrics'] {
    // Calculate detailed performance metrics
    return {
      avgTimeByStatus: {} as Record<DocumentStatus, number>,
      completionRateByType: {},
      stallRateByStatus: {} as Record<DocumentStatus, number>,
      escalationRate: 0,
      automationEfficiency: 0,
    };
  }

  private calculateTrends(timeframe: string): WorkflowMetrics['trends'] {
    // Calculate trend data
    return {
      completionTrend: [],
      statusTrends: [],
      performanceTrend: [],
    };
  }

  private identifyStallPatterns(
    stalledDocs: DocumentWorkflow[],
  ): StalledDocumentAnalysis['stallPatterns'] {
    // Identify common stall patterns
    return [];
  }

  private identifyUnblockingOpportunities(
    stalledDocs: DocumentWorkflow[],
  ): StalledDocumentAnalysis['unblockingOpportunities'] {
    return {
      automationOpportunities: [
        'Auto-assign pending reviews to available admins',
        'Send automated e-signature reminders',
        'Auto-escalate high-value stalled documents',
      ],
      processImprovements: [
        'Streamline document review process',
        'Implement priority queues for urgent documents',
        'Add status-specific help guides',
      ],
      communicationFixes: [
        'Improve reminder email templates',
        'Add progress tracking for customers',
        'Implement real-time status notifications',
      ],
      systemEnhancements: [
        'Add automated workflow rules engine',
        'Implement smart document routing',
        'Build customer self-service portal',
      ],
    };
  }
}

// Singleton instance
export const documentLifecycle = new DocumentLifecycleEngine();

// Export utility functions
export function createDocumentWorkflow(
  documentId: string,
  documentType: string,
  customerId: string,
  customerEmail: string,
  metadata: Partial<DocumentWorkflow> = {},
): DocumentWorkflow {
  return documentLifecycle['createNewDocumentWorkflow'](documentId, {
    documentType,
    customerId,
    customerEmail,
    ...metadata,
  });
}

export function isDocumentOverDue(document: DocumentWorkflow): boolean {
  return documentLifecycle['isOverDue'](document);
}

export function formatDuration(seconds: number): string {
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  return `${Math.round(seconds / 86400)}d`;
}
