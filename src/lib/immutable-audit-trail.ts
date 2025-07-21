// Immutable Audit Trail System
// Cryptographically secure audit events with blockchain-style integrity
'use client';

import crypto from 'crypto';

export interface ImmutableAuditEvent {
  id: string;
  sequence: number;
  timestamp: string;
  previousHash: string;
  currentHash: string;

  // Event metadata
  eventType:
    | 'policy_change'
    | 'template_update'
    | 'data_access'
    | 'consent_change'
    | 'data_export'
    | 'data_deletion'
    | 'breach_incident'
    | 'user_action'
    | 'system_config'
    | 'compliance_check'
    | 'audit_access';

  // Actor information
  actor: {
    type: 'user' | 'system' | 'api' | 'admin' | 'automated';
    id: string;
    email?: string;
    role?: string;
    sessionId?: string;
    ipAddress: string;
    userAgent: string;
    deviceFingerprint?: string;
  };

  // Resource affected
  resource: {
    type:
      | 'document'
      | 'template'
      | 'policy'
      | 'user_data'
      | 'system'
      | 'database';
    id: string;
    name?: string;
    version?: string;
    classification: 'public' | 'internal' | 'confidential' | 'restricted';
  };

  // Action details
  action: {
    operation:
      | 'create'
      | 'read'
      | 'update'
      | 'delete'
      | 'export'
      | 'import'
      | 'approve'
      | 'reject';
    description: string;
    category:
      | 'data_processing'
      | 'policy_management'
      | 'user_management'
      | 'security'
      | 'compliance';
    outcome: 'success' | 'failure' | 'partial' | 'pending';
  };

  // Change tracking
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
    changeType: 'addition' | 'modification' | 'deletion';
    diff?: string; // Unified diff format
  }[];

  // Compliance context
  compliance: {
    frameworks: (
      | 'gdpr'
      | 'ccpa'
      | 'sox'
      | 'hipaa'
      | 'pci_dss'
      | 'iso27001'
      | 'soc2'
    )[];
    legalBasis?: string;
    retentionPeriod?: number; // days
    dataSubjectRights?: string[];
    consentId?: string;
    processingPurpose?: string;
  };

  // Technical context
  technical: {
    sourceSystem: string;
    transactionId?: string;
    correlationId?: string;
    batchId?: string;
    checksumBefore?: string;
    checksumAfter?: string;
    backupReference?: string;
  };

  // Evidence and attachments
  evidence: {
    screenshots?: string[];
    documents?: string[];
    logs?: string[];
    signatures?: string[];
    approvals?: string[];
  };

  // Validation and integrity
  integrity: {
    signature: string; // Digital signature
    witnessHashes?: string[]; // Additional validation
    merkleRoot?: string;
    blockchainRef?: string;
    immutable: boolean;
  };
}

export interface AuditChain {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  events: ImmutableAuditEvent[];
  metadata: {
    totalEvents: number;
    firstEvent: string;
    lastEvent: string;
    integrityVerified: boolean;
    complianceFrameworks: string[];
  };
}

export interface AuditEventQuery {
  startDate?: string;
  endDate?: string;
  eventTypes?: string[];
  actors?: string[];
  resources?: string[];
  complianceFrameworks?: string[];
  dataClassification?: string[];
  includeEvidence?: boolean;
  maxResults?: number;
  sortOrder?: 'asc' | 'desc';
}

export interface IntegrityVerificationResult {
  isValid: boolean;
  totalEvents: number;
  verifiedEvents: number;
  failedEvents: number;
  errors: {
    eventId: string;
    error: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
  lastVerified: string;
  nextVerification: string;
}

export class ImmutableAuditTrail {
  private static instance: ImmutableAuditTrail;
  private auditChains: Map<string, AuditChain> = new Map();
  private eventIndex: Map<string, string> = new Map(); // eventId -> chainId
  private encryptionKey: string;
  private signingKey: string;

  constructor() {
    this.encryptionKey = this.generateSecureKey();
    this.signingKey = this.generateSecureKey();
    this.initializeDefaultChain();
  }

  static getInstance(): ImmutableAuditTrail {
    if (!ImmutableAuditTrail.instance) {
      ImmutableAuditTrail.instance = new ImmutableAuditTrail();
    }
    return ImmutableAuditTrail.instance;
  }

  // Initialize default audit chain
  private initializeDefaultChain(): void {
    const genesisChain: AuditChain = {
      id: 'main_audit_chain',
      name: 'Main Audit Chain',
      description: 'Primary audit trail for all system events',
      createdAt: new Date().toISOString(),
      events: [],
      metadata: {
        totalEvents: 0,
        firstEvent: '',
        lastEvent: '',
        integrityVerified: true,
        complianceFrameworks: ['gdpr', 'sox', 'iso27001', 'soc2'],
      },
    };

    this.auditChains.set(genesisChain.id, genesisChain);
    console.log('🔗 Immutable audit chain initialized');
  }

  // Create immutable audit event
  async createAuditEvent(
    eventData: Omit<
      ImmutableAuditEvent,
      | 'id'
      | 'sequence'
      | 'timestamp'
      | 'previousHash'
      | 'currentHash'
      | 'integrity'
    >,
  ): Promise<string> {
    const chainId = 'main_audit_chain';
    const chain = this.auditChains.get(chainId);

    if (!chain) {
      throw new Error('Audit chain not found');
    }

    // Generate event metadata
    const eventId = this.generateEventId();
    const timestamp = new Date().toISOString();
    const sequence = chain.events.length + 1;
    const previousHash =
      chain.events.length > 0
        ? chain.events[chain.events.length - 1].currentHash
        : '0000000000000000000000000000000000000000000000000000000000000000';

    // Create event object
    const event: Omit<ImmutableAuditEvent, 'currentHash' | 'integrity'> = {
      id: eventId,
      sequence,
      timestamp,
      previousHash,
      ...eventData,
    };

    // Calculate hash and signature
    const eventHash = this.calculateHash(event);
    const signature = this.signEvent(event, eventHash);

    // Complete event with integrity information
    const completeEvent: ImmutableAuditEvent = {
      ...event,
      currentHash: eventHash,
      integrity: {
        signature,
        immutable: true,
        witnessHashes: [this.generateWitnessHash(eventHash)],
        merkleRoot: this.calculateMerkleRoot([
          ...chain.events.map((e) => e.currentHash),
          eventHash,
        ]),
      },
    };

    // Add to chain
    chain.events.push(completeEvent);
    chain.metadata.totalEvents = chain.events.length;
    chain.metadata.lastEvent = timestamp;
    if (chain.metadata.firstEvent === '') {
      chain.metadata.firstEvent = timestamp;
    }

    // Index the event
    this.eventIndex.set(eventId, chainId);

    // Log compliance-relevant events
    this.logComplianceEvent(completeEvent);

    console.log(
      `🔐 Immutable audit event created: ${eventId} (sequence: ${sequence})`,
    );
    return eventId;
  }

  // Log policy changes with diff tracking
  async logPolicyChange(
    policyId: string,
    policyName: string,
    version: string,
    oldContent: any,
    newContent: any,
    actorId: string,
    actorEmail: string,
    approvalId?: string,
  ): Promise<string> {
    const changes = this.generateDiff(oldContent, newContent);

    return this.createAuditEvent({
      eventType: 'policy_change',
      actor: {
        type: 'user',
        id: actorId,
        email: actorEmail,
        ipAddress: 'policy_editor',
        userAgent: 'policy_management_system',
      },
      resource: {
        type: 'policy',
        id: policyId,
        name: policyName,
        version: version,
        classification: 'internal',
      },
      action: {
        operation: 'update',
        description: `Policy ${policyName} updated to version ${version}`,
        category: 'policy_management',
        outcome: 'success',
      },
      changes,
      compliance: {
        frameworks: ['gdpr', 'sox', 'iso27001'],
        retentionPeriod: 2555, // 7 years
        processingPurpose: 'policy_governance',
      },
      technical: {
        sourceSystem: 'policy_management',
        checksumBefore: this.calculateChecksum(oldContent),
        checksumAfter: this.calculateChecksum(newContent),
        transactionId: approvalId,
      },
      evidence: {
        documents: [`policy_${policyId}_v${version}.pdf`],
        approvals: approvalId ? [approvalId] : [],
      },
    });
  }

  // Log template changes
  async logTemplateChange(
    templateId: string,
    templateName: string,
    oldTemplate: any,
    newTemplate: any,
    actorId: string,
    actorEmail: string,
  ): Promise<string> {
    const changes = this.generateDiff(oldTemplate, newTemplate);

    return this.createAuditEvent({
      eventType: 'template_update',
      actor: {
        type: 'user',
        id: actorId,
        email: actorEmail,
        ipAddress: 'template_editor',
        userAgent: 'template_management_system',
      },
      resource: {
        type: 'template',
        id: templateId,
        name: templateName,
        classification: 'internal',
      },
      action: {
        operation: 'update',
        description: `Template ${templateName} updated`,
        category: 'data_processing',
        outcome: 'success',
      },
      changes,
      compliance: {
        frameworks: ['gdpr', 'ccpa'],
        retentionPeriod: 2555,
        processingPurpose: 'document_generation',
      },
      technical: {
        sourceSystem: 'template_engine',
        checksumBefore: this.calculateChecksum(oldTemplate),
        checksumAfter: this.calculateChecksum(newTemplate),
      },
      evidence: {
        documents: [`template_${templateId}_backup.json`],
      },
    });
  }

  // Log data access events
  async logDataAccess(
    dataType: string,
    dataId: string,
    operation: 'read' | 'export' | 'delete',
    actorId: string,
    actorEmail: string,
    legalBasis: string,
    consentId?: string,
  ): Promise<string> {
    return this.createAuditEvent({
      eventType: 'data_access',
      actor: {
        type: 'user',
        id: actorId,
        email: actorEmail,
        ipAddress: 'data_access_system',
        userAgent: 'data_management_portal',
      },
      resource: {
        type: 'user_data',
        id: dataId,
        name: dataType,
        classification: 'confidential',
      },
      action: {
        operation,
        description: `${operation} operation on ${dataType}`,
        category: 'data_processing',
        outcome: 'success',
      },
      compliance: {
        frameworks: ['gdpr', 'ccpa'],
        legalBasis,
        consentId,
        dataSubjectRights: [
          'access',
          'rectification',
          'erasure',
          'portability',
        ],
        retentionPeriod: 2555,
        processingPurpose: 'service_provision',
      },
      technical: {
        sourceSystem: 'data_access_portal',
        correlationId: `data_access_${Date.now()}`,
      },
      evidence: {
        logs: [`data_access_${dataId}_${Date.now()}.log`],
      },
    });
  }

  // Log consent changes
  async logConsentChange(
    userId: string,
    consentType: string,
    oldConsent: any,
    newConsent: any,
    method: 'web_form' | 'email' | 'phone' | 'api',
  ): Promise<string> {
    return this.createAuditEvent({
      eventType: 'consent_change',
      actor: {
        type: 'user',
        id: userId,
        ipAddress: 'consent_portal',
        userAgent: 'consent_management_system',
      },
      resource: {
        type: 'user_data',
        id: `consent_${userId}`,
        name: consentType,
        classification: 'confidential',
      },
      action: {
        operation: 'update',
        description: `Consent ${consentType} updated via ${method}`,
        category: 'data_processing',
        outcome: 'success',
      },
      changes: this.generateDiff(oldConsent, newConsent),
      compliance: {
        frameworks: ['gdpr', 'ccpa'],
        legalBasis: 'consent',
        dataSubjectRights: ['withdraw_consent'],
        retentionPeriod: 2555,
        processingPurpose: 'consent_management',
      },
      technical: {
        sourceSystem: 'consent_manager',
        checksumBefore: this.calculateChecksum(oldConsent),
        checksumAfter: this.calculateChecksum(newConsent),
      },
      evidence: {
        documents: [`consent_${userId}_${Date.now()}.json`],
      },
    });
  }

  // Query audit events
  async queryEvents(query: AuditEventQuery): Promise<{
    events: ImmutableAuditEvent[];
    total: number;
    hasMore: boolean;
    integrityStatus: 'verified' | 'pending' | 'failed';
  }> {
    const chainId = 'main_audit_chain';
    const chain = this.auditChains.get(chainId);

    if (!chain) {
      throw new Error('Audit chain not found');
    }

    let filteredEvents = [...chain.events];

    // Apply filters
    if (query.startDate) {
      filteredEvents = filteredEvents.filter(
        (e) => e.timestamp >= query.startDate!,
      );
    }

    if (query.endDate) {
      filteredEvents = filteredEvents.filter(
        (e) => e.timestamp <= query.endDate!,
      );
    }

    if (query.eventTypes?.length) {
      filteredEvents = filteredEvents.filter((e) =>
        query.eventTypes!.includes(e.eventType),
      );
    }

    if (query.actors?.length) {
      filteredEvents = filteredEvents.filter((e) =>
        query.actors!.includes(e.actor.id),
      );
    }

    if (query.resources?.length) {
      filteredEvents = filteredEvents.filter((e) =>
        query.resources!.includes(e.resource.id),
      );
    }

    if (query.complianceFrameworks?.length) {
      filteredEvents = filteredEvents.filter((e) =>
        e.compliance.frameworks.some((f) =>
          query.complianceFrameworks!.includes(f),
        ),
      );
    }

    if (query.dataClassification?.length) {
      filteredEvents = filteredEvents.filter((e) =>
        query.dataClassification!.includes(e.resource.classification),
      );
    }

    // Sort events
    if (query.sortOrder === 'asc') {
      filteredEvents.sort((a, b) => a.sequence - b.sequence);
    } else {
      filteredEvents.sort((a, b) => b.sequence - a.sequence);
    }

    // Apply pagination
    const maxResults = query.maxResults || 100;
    const hasMore = filteredEvents.length > maxResults;
    const paginatedEvents = filteredEvents.slice(0, maxResults);

    // Verify integrity of returned events
    const integrityStatus = await this.verifyEventIntegrity(paginatedEvents);

    return {
      events: paginatedEvents,
      total: filteredEvents.length,
      hasMore,
      integrityStatus: integrityStatus.isValid ? 'verified' : 'failed',
    };
  }

  // Verify chain integrity
  async verifyChainIntegrity(
    chainId: string = 'main_audit_chain',
  ): Promise<IntegrityVerificationResult> {
    const chain = this.auditChains.get(chainId);

    if (!chain) {
      throw new Error('Audit chain not found');
    }

    const errors: IntegrityVerificationResult['errors'] = [];
    let verifiedEvents = 0;

    // Verify each event
    for (let i = 0; i < chain.events.length; i++) {
      const event = chain.events[i];
      const isValid = await this.verifyEventIntegrity([event]);

      if (isValid.isValid) {
        verifiedEvents++;
      } else {
        errors.push({
          eventId: event.id,
          error: 'Hash verification failed',
          severity: 'critical',
        });
      }

      // Verify chain linkage
      if (i > 0) {
        const previousEvent = chain.events[i - 1];
        if (event.previousHash !== previousEvent.currentHash) {
          errors.push({
            eventId: event.id,
            error: 'Chain linkage broken',
            severity: 'critical',
          });
        }
      }
    }

    // Update chain metadata
    chain.metadata.integrityVerified = errors.length === 0;

    return {
      isValid: errors.length === 0,
      totalEvents: chain.events.length,
      verifiedEvents,
      failedEvents: chain.events.length - verifiedEvents,
      errors,
      lastVerified: new Date().toISOString(),
      nextVerification: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(), // 24 hours
    };
  }

  // Export audit chain for compliance
  async exportAuditChain(
    chainId: string,
    format: 'json' | 'csv' | 'xml' | 'pdf',
    includeEvidence: boolean = true,
  ): Promise<{
    data: string | Buffer;
    filename: string;
    mimeType: string;
    integrity: {
      checksum: string;
      signature: string;
      timestamp: string;
    };
  }> {
    const chain = this.auditChains.get(chainId);

    if (!chain) {
      throw new Error('Audit chain not found');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `audit_chain_${chainId}_${timestamp}.${format}`;

    let data: string | Buffer;
    let mimeType: string;

    switch (format) {
      case 'json':
        data = JSON.stringify(
          {
            chain,
            exportMetadata: {
              exportDate: new Date().toISOString(),
              includeEvidence,
              totalEvents: chain.events.length,
              integrityVerified: chain.metadata.integrityVerified,
            },
          },
          null,
          2,
        );
        mimeType = 'application/json';
        break;

      case 'csv':
        data = this.convertToCSV(chain.events);
        mimeType = 'text/csv';
        break;

      case 'xml':
        data = this.convertToXML(chain);
        mimeType = 'application/xml';
        break;

      case 'pdf':
        data = await this.generatePDFReport(chain);
        mimeType = 'application/pdf';
        break;

      default:
        throw new Error('Unsupported export format');
    }

    // Generate integrity information
    const checksum = this.calculateChecksum(data);
    const signature = this.signData(data);

    return {
      data,
      filename,
      mimeType,
      integrity: {
        checksum,
        signature,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Private helper methods
  private generateEventId(): string {
    return `audit_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  private generateSecureKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private calculateHash(
    event: Omit<ImmutableAuditEvent, 'currentHash' | 'integrity'>,
  ): string {
    const eventString = JSON.stringify(event, Object.keys(event).sort());
    return crypto.createHash('sha256').update(eventString).digest('hex');
  }

  private signEvent(event: any, hash: string): string {
    const hmac = crypto.createHmac('sha256', this.signingKey);
    hmac.update(hash);
    return hmac.digest('hex');
  }

  private signData(data: string | Buffer): string {
    const hmac = crypto.createHmac('sha256', this.signingKey);
    hmac.update(data);
    return hmac.digest('hex');
  }

  private generateWitnessHash(eventHash: string): string {
    return crypto
      .createHash('sha256')
      .update(eventHash + Date.now().toString())
      .digest('hex');
  }

  private calculateMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) return '';
    if (hashes.length === 1) return hashes[0];

    const nextLevel: string[] = [];
    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i];
      const right = i + 1 < hashes.length ? hashes[i + 1] : left;
      const combined = crypto
        .createHash('sha256')
        .update(left + right)
        .digest('hex');
      nextLevel.push(combined);
    }

    return this.calculateMerkleRoot(nextLevel);
  }

  private calculateChecksum(data: any): string {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  private generateDiff(
    oldData: any,
    newData: any,
  ): ImmutableAuditEvent['changes'] {
    const changes: ImmutableAuditEvent['changes'] = [];

    // Simple diff implementation - in production, use a proper diff library
    const oldKeys = Object.keys(oldData || {});
    const newKeys = Object.keys(newData || {});
    const allKeys = [...new Set([...oldKeys, ...newKeys])];

    allKeys.forEach((key) => {
      const oldValue = oldData?.[key];
      const newValue = newData?.[key];

      if (oldValue !== newValue) {
        let changeType: 'addition' | 'modification' | 'deletion';

        if (oldValue === undefined) {
          changeType = 'addition';
        } else if (newValue === undefined) {
          changeType = 'deletion';
        } else {
          changeType = 'modification';
        }

        changes.push({
          field: key,
          oldValue,
          newValue,
          changeType,
          diff: `- ${oldValue}\n+ ${newValue}`,
        });
      }
    });

    return changes;
  }

  private async verifyEventIntegrity(
    events: ImmutableAuditEvent[],
  ): Promise<IntegrityVerificationResult> {
    let verifiedEvents = 0;
    const errors: IntegrityVerificationResult['errors'] = [];

    for (const event of events) {
      // Recalculate hash
      const eventCopy = { ...event };
      delete (eventCopy as any).currentHash;
      delete (eventCopy as any).integrity;

      const calculatedHash = this.calculateHash(eventCopy);

      if (calculatedHash !== event.currentHash) {
        errors.push({
          eventId: event.id,
          error: 'Hash mismatch - event may be corrupted',
          severity: 'critical',
        });
      } else {
        verifiedEvents++;
      }
    }

    return {
      isValid: errors.length === 0,
      totalEvents: events.length,
      verifiedEvents,
      failedEvents: events.length - verifiedEvents,
      errors,
      lastVerified: new Date().toISOString(),
      nextVerification: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
  }

  private logComplianceEvent(event: ImmutableAuditEvent): void {
    // Log compliance-relevant events for monitoring
    if (event.compliance.frameworks.includes('gdpr')) {
      console.log(`📋 GDPR audit event: ${event.action.description}`);
    }

    if (event.compliance.frameworks.includes('sox')) {
      console.log(`📊 SOX audit event: ${event.action.description}`);
    }
  }

  private convertToCSV(events: ImmutableAuditEvent[]): string {
    const headers = [
      'ID',
      'Sequence',
      'Timestamp',
      'Event Type',
      'Actor',
      'Resource',
      'Action',
      'Outcome',
      'Compliance Frameworks',
      'Hash',
    ];

    const rows = events.map((event) => [
      event.id,
      event.sequence.toString(),
      event.timestamp,
      event.eventType,
      event.actor.email || event.actor.id,
      `${event.resource.type}:${event.resource.id}`,
      event.action.description,
      event.action.outcome,
      event.compliance.frameworks.join(';'),
      event.currentHash,
    ]);

    return [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','),
      )
      .join('\n');
  }

  private convertToXML(chain: AuditChain): string {
    // Simple XML conversion - in production, use a proper XML library
    return `<?xml version="1.0" encoding="UTF-8"?>
<auditChain id="${chain.id}" name="${chain.name}">
  <metadata>
    <totalEvents>${chain.metadata.totalEvents}</totalEvents>
    <integrityVerified>${chain.metadata.integrityVerified}</integrityVerified>
  </metadata>
  <events>
    ${chain.events
      .map(
        (event) => `
    <event id="${event.id}" sequence="${event.sequence}">
      <timestamp>${event.timestamp}</timestamp>
      <eventType>${event.eventType}</eventType>
      <hash>${event.currentHash}</hash>
    </event>`,
      )
      .join('')}
  </events>
</auditChain>`;
  }

  private async generatePDFReport(chain: AuditChain): Promise<Buffer> {
    // In production, use a PDF library like puppeteer or pdfkit
    const htmlContent = `
    <html>
      <head><title>Audit Chain Report</title></head>
      <body>
        <h1>Audit Chain Report: ${chain.name}</h1>
        <p>Generated: ${new Date().toISOString()}</p>
        <p>Total Events: ${chain.metadata.totalEvents}</p>
        <p>Integrity Verified: ${chain.metadata.integrityVerified}</p>
        <table border="1">
          <tr><th>Sequence</th><th>Timestamp</th><th>Event Type</th><th>Description</th></tr>
          ${chain.events
            .map(
              (event) => `
            <tr>
              <td>${event.sequence}</td>
              <td>${event.timestamp}</td>
              <td>${event.eventType}</td>
              <td>${event.action.description}</td>
            </tr>
          `,
            )
            .join('')}
        </table>
      </body>
    </html>`;

    return Buffer.from(htmlContent, 'utf-8');
  }

  // Performance metrics
  getAuditMetrics(): {
    totalChains: number;
    totalEvents: number;
    averageEventsPerChain: number;
    integrityStatus: 'verified' | 'pending' | 'failed';
    storageUsed: string;
    lastIntegrityCheck: string;
    complianceFrameworks: string[];
  } {
    const allChains = Array.from(this.auditChains.values());
    const totalEvents = allChains.reduce(
      (sum, chain) => sum + chain.events.length,
      0,
    );
    const avgEvents = allChains.length > 0 ? totalEvents / allChains.length : 0;

    const allVerified = allChains.every(
      (chain) => chain.metadata.integrityVerified,
    );

    return {
      totalChains: allChains.length,
      totalEvents,
      averageEventsPerChain: Math.round(avgEvents),
      integrityStatus: allVerified ? 'verified' : 'failed',
      storageUsed: `${(totalEvents * 2.5).toFixed(1)} KB`, // Estimated
      lastIntegrityCheck: new Date().toISOString(),
      complianceFrameworks: [
        'gdpr',
        'sox',
        'iso27001',
        'soc2',
        'ccpa',
        'hipaa',
      ],
    };
  }
}

// Export singleton instance
export const immutableAuditTrail = ImmutableAuditTrail.getInstance();
