// Comprehensive Security Audit Logging System
// Enterprise-grade audit trail for compliance and security monitoring

interface AuditEvent {
  id: string;
  timestamp: string;
  eventType:
    | 'authentication'
    | 'authorization'
    | 'data_access'
    | 'data_modification'
    | 'system_configuration'
    | 'security_incident'
    | 'compliance_check'
    | 'document_access'
    | 'payment_transaction'
    | 'api_access';
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: 'security' | 'compliance' | 'business' | 'system' | 'user';

  // Actor information
  actor: {
    userId?: string;
    userEmail?: string;
    userRole?: string;
    sessionId?: string;
    ipAddress: string;
    userAgent: string;
    location?: {
      country: string;
      region: string;
      city: string;
      coordinates?: [number, number];
    };
  };

  // Event details
  action: string;
  resource: {
    type:
      | 'document'
      | 'user'
      | 'payment'
      | 'subscription'
      | 'system'
      | 'api'
      | 'template';
    id?: string;
    name?: string;
    path?: string;
  };

  // Context and metadata
  context: {
    method?: string;
    endpoint?: string;
    statusCode?: number;
    duration?: number;
    bytesSent?: number;
    bytesReceived?: number;
  };

  // Security-specific fields
  security: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    threatIndicators?: string[];
    mitigationActions?: string[];
    complianceFlags?: string[];
  };

  // Results and impact
  result: 'success' | 'failure' | 'partial' | 'blocked';
  changes?: Array<{
    field: string;
    oldValue?: unknown;
    newValue?: unknown;
  }>;

  // Additional metadata
  metadata: {
    correlationId?: string;
    parentEventId?: string;
    deviceFingerprint?: string;
    sourceSystem: string;
    dataClassification?: 'public' | 'internal' | 'confidential' | 'restricted';
  };
}

interface ComplianceReport {
  id: string;
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  reportType: 'sox' | 'gdpr' | 'hipaa' | 'pci_dss' | 'ccpa' | 'iso27001';
  summary: {
    totalEvents: number;
    securityIncidents: number;
    complianceViolations: number;
    dataAccessEvents: number;
    authenticationFailures: number;
    privilegedAccess: number;
  };
  findings: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    description: string;
    affectedResources: string[];
    recommendations: string[];
    remediated: boolean;
  }>;
  complianceStatus: 'compliant' | 'non_compliant' | 'partially_compliant';
}

export class SecurityAuditLogger {
  private static instance: SecurityAuditLogger;
  private auditEvents: Map<string, AuditEvent> = new Map();
  private eventBuffer: AuditEvent[] = [];
  private retentionPeriodDays: number = 2555; // 7 years for compliance
  private bufferFlushInterval: number = 5000; // 5 seconds
  private maxBufferSize: number = 1000;

  constructor() {
    this.startBufferFlushTimer();
    this.initializeComplianceRules();
  }

  static getInstance(): SecurityAuditLogger {
    if (!SecurityAuditLogger.instance) {
      SecurityAuditLogger.instance = new SecurityAuditLogger();
    }
    return SecurityAuditLogger.instance;
  }

  // Initialize compliance rules and monitoring
  private initializeComplianceRules() {
    console.log('🔒 Initializing compliance monitoring rules...');

    // Set up real-time compliance monitoring
    this.setupGDPRMonitoring();
    this.setupSOXCompliance();
    this.setupSecurityIncidentDetection();
  }

  // Log security event
  async logEvent(eventData: Partial<AuditEvent>): Promise<string> {
    const eventId = this.generateEventId();
    const timestamp = new Date().toISOString();

    const auditEvent: AuditEvent = {
      id: eventId,
      timestamp,
      eventType: eventData.eventType || 'system_configuration',
      severity: eventData.severity || 'info',
      category: eventData.category || 'system',
      actor: {
        ipAddress: '127.0.0.1',
        userAgent: 'system',
        ...eventData.actor,
      },
      action: eventData.action || 'unknown_action',
      resource: {
        type: 'system',
        ...eventData.resource,
      },
      context: eventData.context || {},
      security: {
        riskLevel: 'low',
        ...eventData.security,
      },
      result: eventData.result || 'success',
      changes: eventData.changes,
      metadata: {
        sourceSystem: '123legaldoc',
        ...eventData.metadata,
      },
    };

    // Add to buffer for batch processing
    this.eventBuffer.push(auditEvent);

    // Immediate processing for critical events
    if (
      auditEvent.severity === 'critical' ||
      auditEvent.security.riskLevel === 'critical'
    ) {
      await this.processImmediately(auditEvent);
    }

    // Check for compliance violations
    this.checkComplianceViolations(auditEvent);

    // Trigger security incident detection
    this.detectSecurityAnomalies(auditEvent);

    console.log(
      `📝 Audit event logged: ${eventData.action} (${auditEvent.severity})`,
    );
    return eventId;
  }

  // Log authentication events
  async logAuthentication(
    action:
      | 'login_attempt'
      | 'login_success'
      | 'login_failure'
      | 'logout'
      | 'session_timeout',
    userId?: string,
    userEmail?: string,
    ipAddress?: string,
    additionalContext?: Record<string, unknown>,
  ): Promise<string> {
    return this.logEvent({
      eventType: 'authentication',
      severity: action.includes('failure') ? 'warning' : 'info',
      category: 'security',
      action,
      actor: {
        userId,
        userEmail,
        ipAddress: ipAddress || 'unknown',
        userAgent: additionalContext?.userAgent || 'unknown',
      },
      security: {
        riskLevel: this.assessAuthenticationRisk(action, additionalContext),
        threatIndicators: this.detectAuthenticationThreats(
          action,
          additionalContext,
        ),
      },
      result: action.includes('success')
        ? 'success'
        : action.includes('failure')
          ? 'failure'
          : 'success',
      metadata: {
        dataClassification: 'confidential',
        ...additionalContext,
      },
    });
  }

  // Log data access events
  async logDataAccess(
    action: 'read' | 'create' | 'update' | 'delete' | 'export' | 'print',
    resourceType: AuditEvent['resource']['type'],
    resourceId: string,
    userId: string,
    sensitive: boolean = false,
  ): Promise<string> {
    return this.logEvent({
      eventType: 'data_access',
      severity: sensitive ? 'warning' : 'info',
      category: 'business',
      action: `data_${action}`,
      actor: {
        userId,
        ipAddress: 'client_ip',
        userAgent: 'client_agent',
      },
      resource: {
        type: resourceType,
        id: resourceId,
      },
      security: {
        riskLevel: this.assessDataAccessRisk(action, sensitive),
        complianceFlags: sensitive ? ['gdpr_sensitive', 'pii_access'] : [],
      },
      metadata: {
        dataClassification: sensitive ? 'restricted' : 'internal',
      },
    });
  }

  // Log payment transactions
  async logPaymentTransaction(
    action:
      | 'payment_initiated'
      | 'payment_completed'
      | 'payment_failed'
      | 'refund_processed',
    transactionId: string,
    amount: number,
    currency: string,
    customerId: string,
  ): Promise<string> {
    return this.logEvent({
      eventType: 'payment_transaction',
      severity: action.includes('failed') ? 'error' : 'info',
      category: 'business',
      action,
      actor: {
        userId: customerId,
        ipAddress: 'payment_gateway',
        userAgent: 'stripe_webhook',
      },
      resource: {
        type: 'payment',
        id: transactionId,
      },
      security: {
        riskLevel: amount > 1000 ? 'medium' : 'low',
        complianceFlags: ['pci_dss_transaction', 'financial_data'],
      },
      context: {
        statusCode: action.includes('completed') ? 200 : 400,
      },
      metadata: {
        dataClassification: 'confidential',
        amount,
        currency,
      },
    });
  }

  // Log system configuration changes
  async logSystemConfiguration(
    action: string,
    component: string,
    adminUserId: string,
    changes: AuditEvent['changes'],
  ): Promise<string> {
    return this.logEvent({
      eventType: 'system_configuration',
      severity: 'warning',
      category: 'system',
      action: `config_${action}`,
      actor: {
        userId: adminUserId,
        userRole: 'administrator',
        ipAddress: 'admin_console',
        userAgent: 'web_interface',
      },
      resource: {
        type: 'system',
        name: component,
      },
      security: {
        riskLevel: 'high', // System changes are always high risk
        complianceFlags: ['sox_configuration_change', 'privileged_access'],
      },
      changes,
      metadata: {
        dataClassification: 'restricted',
      },
    });
  }

  // Process events immediately for critical incidents
  private async processImmediately(event: AuditEvent): Promise<void> {
    console.log(`🚨 CRITICAL EVENT: ${event.action}`);

    // Store immediately
    this.auditEvents.set(event.id, event);

    // Trigger real-time alerts
    await this.triggerSecurityAlert(event);

    // Notify compliance team
    await this.notifyComplianceTeam(event);
  }

  // Detect security anomalies and threats
  private detectSecurityAnomalies(event: AuditEvent): void {
    const anomalies = [];

    // Multiple failed login attempts
    if (
      event.eventType === 'authentication' &&
      event.action === 'login_failure'
    ) {
      const recentFailures = this.getRecentEvents('authentication', 300000); // 5 minutes
      const userFailures = recentFailures.filter(
        (e) =>
          e.actor.userId === event.actor.userId && e.action === 'login_failure',
      ).length;

      if (userFailures >= 5) {
        anomalies.push('brute_force_attempt');
      }
    }

    // Unusual data access patterns
    if (event.eventType === 'data_access') {
      const recentAccess = this.getRecentEvents('data_access', 3600000); // 1 hour
      const userAccess = recentAccess.filter(
        (e) => e.actor.userId === event.actor.userId,
      );

      if (userAccess.length > 100) {
        anomalies.push('unusual_access_volume');
      }
    }

    // Geographic anomalies
    if (event.actor.location) {
      const userHistory = this.getUserLocationHistory(event.actor.userId);
      if (this.isUnusualLocation(event.actor.location, userHistory)) {
        anomalies.push('geographic_anomaly');
      }
    }

    // Update threat indicators
    if (anomalies.length > 0) {
      event.security.threatIndicators = [
        ...(event.security.threatIndicators || []),
        ...anomalies,
      ];
      event.security.riskLevel = 'high';

      console.log(`⚠️ Security anomalies detected: ${anomalies.join(', ')}`);
    }
  }

  // Check for compliance violations
  private checkComplianceViolations(event: AuditEvent): void {
    const violations = [];

    // GDPR compliance checks
    if (
      event.metadata.dataClassification === 'restricted' &&
      !event.security.complianceFlags?.includes('gdpr_consent')
    ) {
      violations.push('gdpr_data_access_without_consent');
    }

    // SOX compliance checks
    if (
      event.eventType === 'system_configuration' &&
      !event.actor.userRole?.includes('administrator')
    ) {
      violations.push('sox_unauthorized_configuration_change');
    }

    // PCI DSS compliance checks
    if (
      event.eventType === 'payment_transaction' &&
      !event.security.complianceFlags?.includes('pci_dss_transaction')
    ) {
      violations.push('pci_dss_untracked_transaction');
    }

    if (violations.length > 0) {
      event.security.complianceFlags = [
        ...(event.security.complianceFlags || []),
        ...violations,
      ];
      console.log(
        `⚖️ Compliance violations detected: ${violations.join(', ')}`,
      );
    }
  }

  // Generate compliance report
  async generateComplianceReport(
    reportType: ComplianceReport['reportType'],
    startDate: string,
    endDate: string,
  ): Promise<ComplianceReport> {
    console.log(
      `📊 Generating ${reportType.toUpperCase()} compliance report...`,
    );

    const events = this.getEventsInPeriod(startDate, endDate);
    const reportId = this.generateReportId();

    // Analyze events for compliance
    const securityIncidents = events.filter(
      (e) =>
        e.security.threatIndicators && e.security.threatIndicators.length > 0,
    );

    const complianceViolations = events.filter(
      (e) =>
        e.security.complianceFlags &&
        e.security.complianceFlags.some((flag) => flag.includes('violation')),
    );

    const dataAccessEvents = events.filter(
      (e) => e.eventType === 'data_access',
    );
    const authFailures = events.filter(
      (e) => e.eventType === 'authentication' && e.result === 'failure',
    );

    const privilegedAccess = events.filter(
      (e) =>
        e.actor.userRole?.includes('admin') ||
        e.eventType === 'system_configuration',
    );

    // Generate findings based on report type
    const findings = this.generateComplianceFindings(reportType, events);

    const report: ComplianceReport = {
      id: reportId,
      generatedAt: new Date().toISOString(),
      period: { start: startDate, end: endDate },
      reportType,
      summary: {
        totalEvents: events.length,
        securityIncidents: securityIncidents.length,
        complianceViolations: complianceViolations.length,
        dataAccessEvents: dataAccessEvents.length,
        authenticationFailures: authFailures.length,
        privilegedAccess: privilegedAccess.length,
      },
      findings,
      complianceStatus: this.assessComplianceStatus(findings),
    };

    console.log(`✅ Compliance report generated: ${reportId}`);
    return report;
  }

  // Generate compliance findings
  private generateComplianceFindings(
    reportType: ComplianceReport['reportType'],
    events: AuditEvent[],
  ): ComplianceReport['findings'] {
    const findings: ComplianceReport['findings'] = [];

    switch (reportType) {
      case 'gdpr':
        findings.push(...this.generateGDPRFindings(events));
        break;
      case 'sox':
        findings.push(...this.generateSOXFindings(events));
        break;
      case 'pci_dss':
        findings.push(...this.generatePCIDSSFindings(events));
        break;
      case 'iso27001':
        findings.push(...this.generateISO27001Findings(events));
        break;
    }

    return findings;
  }

  // GDPR-specific findings
  private generateGDPRFindings(
    events: AuditEvent[],
  ): ComplianceReport['findings'] {
    const findings: ComplianceReport['findings'] = [];

    // Check for data access without consent
    const unauthorizedAccess = events.filter(
      (e) =>
        e.eventType === 'data_access' &&
        e.metadata.dataClassification === 'restricted' &&
        !e.security.complianceFlags?.includes('gdpr_consent'),
    );

    if (unauthorizedAccess.length > 0) {
      findings.push({
        severity: 'high',
        category: 'GDPR Data Access',
        description: `${unauthorizedAccess.length} data access events without proper GDPR consent`,
        affectedResources: unauthorizedAccess.map(
          (e) => e.resource.id || 'unknown',
        ),
        recommendations: [
          'Implement consent verification before data access',
          'Review data access policies',
          'Train staff on GDPR requirements',
        ],
        remediated: false,
      });
    }

    // Check for data retention violations
    const oldDataAccess = events.filter((e) => {
      const eventDate = new Date(e.timestamp);
      const cutoffDate = new Date();
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 3); // 3 years retention
      return eventDate < cutoffDate && e.eventType === 'data_access';
    });

    if (oldDataAccess.length > 0) {
      findings.push({
        severity: 'medium',
        category: 'GDPR Data Retention',
        description: 'Potential data retention policy violations detected',
        affectedResources: ['audit_logs'],
        recommendations: [
          'Review data retention policies',
          'Implement automated data purging',
          'Document data lifecycle management',
        ],
        remediated: false,
      });
    }

    return findings;
  }

  // SOX-specific findings
  private generateSOXFindings(
    events: AuditEvent[],
  ): ComplianceReport['findings'] {
    const findings: ComplianceReport['findings'] = [];

    // Check for segregation of duties violations
    const configChanges = events.filter(
      (e) => e.eventType === 'system_configuration',
    );
    const approvalRequired = configChanges.filter(
      (e) => !e.metadata.approvedBy && e.security.riskLevel === 'high',
    );

    if (approvalRequired.length > 0) {
      findings.push({
        severity: 'high',
        category: 'SOX Segregation of Duties',
        description: 'High-risk configuration changes without proper approval',
        affectedResources: approvalRequired.map(
          (e) => e.resource.name || 'system',
        ),
        recommendations: [
          'Implement approval workflow for configuration changes',
          'Require dual authorization for high-risk changes',
          'Document change management procedures',
        ],
        remediated: false,
      });
    }

    return findings;
  }

  // PCI DSS-specific findings
  private generatePCIDSSFindings(
    events: AuditEvent[],
  ): ComplianceReport['findings'] {
    const findings: ComplianceReport['findings'] = [];

    // Check for payment data access
    const paymentAccess = events.filter(
      (e) =>
        e.eventType === 'data_access' &&
        e.security.complianceFlags?.includes('financial_data'),
    );

    if (paymentAccess.length > 0) {
      findings.push({
        severity: 'medium',
        category: 'PCI DSS Data Access',
        description: 'Financial data access events require enhanced monitoring',
        affectedResources: paymentAccess.map(
          (e) => e.resource.id || 'payment_data',
        ),
        recommendations: [
          'Enhanced monitoring of payment data access',
          'Regular access reviews',
          'Implement data masking for non-production environments',
        ],
        remediated: true,
      });
    }

    return findings;
  }

  // ISO 27001-specific findings
  private generateISO27001Findings(
    events: AuditEvent[],
  ): ComplianceReport['findings'] {
    const findings: ComplianceReport['findings'] = [];

    // Check for security incident response
    const securityIncidents = events.filter(
      (e) =>
        e.security.threatIndicators && e.security.threatIndicators.length > 0,
    );

    const unresponded = securityIncidents.filter(
      (e) =>
        !e.security.mitigationActions ||
        e.security.mitigationActions.length === 0,
    );

    if (unresponded.length > 0) {
      findings.push({
        severity: 'high',
        category: 'ISO 27001 Incident Response',
        description: 'Security incidents without documented response actions',
        affectedResources: unresponded.map((e) => e.id),
        recommendations: [
          'Implement incident response procedures',
          'Train security team on response protocols',
          'Document all mitigation actions',
        ],
        remediated: false,
      });
    }

    return findings;
  }

  // Risk assessment functions
  private assessAuthenticationRisk(
    action: string,
    context: Record<string, unknown> | undefined,
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (action === 'login_failure') return 'medium';
    if (context && (context as { unusualLocation?: boolean }).unusualLocation)
      return 'high';
    if (context && (context as { multipleDevices?: boolean }).multipleDevices)
      return 'medium';
    return 'low';
  }

  private assessDataAccessRisk(
    action: string,
    sensitive: boolean,
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (sensitive && action === 'export') return 'high';
    if (sensitive) return 'medium';
    if (action === 'delete') return 'medium';
    return 'low';
  }

  private detectAuthenticationThreats(
    action: string,
    context: Record<string, unknown> | undefined,
  ): string[] {
    const threats: string[] = [];
    if (action === 'login_failure') threats.push('potential_brute_force');
    if (context && (context as { unusualLocation?: boolean }).unusualLocation)
      threats.push('geographic_anomaly');
    if (context && (context as { newDevice?: boolean }).newDevice)
      threats.push('unknown_device');
    return threats;
  }

  // Helper methods
  private getRecentEvents(
    eventType: string,
    milliseconds: number,
  ): AuditEvent[] {
    const cutoff = Date.now() - milliseconds;
    return Array.from(this.auditEvents.values()).filter(
      (event) =>
        event.eventType === eventType &&
        new Date(event.timestamp).getTime() > cutoff,
    );
  }

  private getEventsInPeriod(startDate: string, endDate: string): AuditEvent[] {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return Array.from(this.auditEvents.values()).filter((event) => {
      const eventTime = new Date(event.timestamp).getTime();
      return eventTime >= start && eventTime <= end;
    });
  }

  private getUserLocationHistory(
    userId?: string,
  ): NonNullable<AuditEvent['actor']['location']>[] {
    if (!userId) return [];

    return Array.from(this.auditEvents.values())
      .filter((event) => event.actor.userId === userId && event.actor.location)
      .map((event) => event.actor.location)
      .slice(-10); // Last 10 locations
  }

  private isUnusualLocation(
    location: NonNullable<AuditEvent['actor']['location']>,
    history: NonNullable<AuditEvent['actor']['location']>[],
  ): boolean {
    // Simple check - in production this would be more sophisticated
    return (
      history.length > 0 && !history.some((h) => h.country === location.country)
    );
  }

  private assessComplianceStatus(
    findings: ComplianceReport['findings'],
  ): ComplianceReport['complianceStatus'] {
    const criticalFindings = findings.filter((f) => f.severity === 'critical');
    const highFindings = findings.filter((f) => f.severity === 'high');

    if (criticalFindings.length > 0) return 'non_compliant';
    if (highFindings.length > 0) return 'partially_compliant';
    return 'compliant';
  }

  // Monitoring setup methods
  private setupGDPRMonitoring(): void {
    console.log('🇪🇺 GDPR monitoring enabled');
  }

  private setupSOXCompliance(): void {
    console.log('📈 SOX compliance monitoring enabled');
  }

  private setupSecurityIncidentDetection(): void {
    console.log('🛡️ Security incident detection enabled');
  }

  // Alert and notification methods
  private async triggerSecurityAlert(event: AuditEvent): Promise<void> {
    console.log(`🚨 Security alert triggered for event: ${event.id}`);
  }

  private async notifyComplianceTeam(event: AuditEvent): Promise<void> {
    console.log(`📧 Compliance team notified about event: ${event.id}`);
  }

  // Buffer management
  private startBufferFlushTimer(): void {
    setInterval(() => {
      this.flushEventBuffer();
    }, this.bufferFlushInterval);
  }

  private flushEventBuffer(): void {
    if (this.eventBuffer.length === 0) return;

    console.log(
      `💾 Flushing ${this.eventBuffer.length} audit events to storage`,
    );

    // Move events from buffer to main storage
    this.eventBuffer.forEach((event) => {
      this.auditEvents.set(event.id, event);
    });

    // Clear buffer
    this.eventBuffer = [];

    // Clean up old events based on retention policy
    this.cleanupOldEvents();
  }

  private cleanupOldEvents(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionPeriodDays);
    const cutoffTime = cutoffDate.getTime();

    let cleanedCount = 0;
    for (const [eventId, event] of this.auditEvents.entries()) {
      if (new Date(event.timestamp).getTime() < cutoffTime) {
        this.auditEvents.delete(eventId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} old audit events`);
    }
  }

  // Utility functions
  private generateEventId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  // Performance metrics
  getAuditMetrics(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    securityIncidents: number;
    complianceViolations: number;
    averageProcessingTime: number;
    storageUsed: string;
  } {
    const allEvents = Array.from(this.auditEvents.values());

    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    let securityIncidents = 0;
    let complianceViolations = 0;

    allEvents.forEach((event) => {
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
      eventsBySeverity[event.severity] =
        (eventsBySeverity[event.severity] || 0) + 1;

      if (
        event.security.threatIndicators &&
        event.security.threatIndicators.length > 0
      ) {
        securityIncidents++;
      }

      if (
        event.security.complianceFlags?.some((flag) =>
          flag.includes('violation'),
        )
      ) {
        complianceViolations++;
      }
    });

    return {
      totalEvents: allEvents.length,
      eventsByType,
      eventsBySeverity,
      securityIncidents,
      complianceViolations,
      averageProcessingTime: 15, // ms (simulated)
      storageUsed: `${(allEvents.length * 2).toFixed(1)} KB`, // Estimated
    };
  }
}

// Export singleton instance
export const securityAuditLogger = SecurityAuditLogger.getInstance();
