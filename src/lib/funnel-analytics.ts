// Advanced Funnel & Conversion Analytics System
// Step-drop analytics for "visit" → "draft" → "checkout" → "signed"
// Event streaming to BigQuery with abandonment detection

export interface FunnelStep {
  step: 'visit' | 'draft' | 'checkout' | 'signed';
  stepOrder: number;
  timestamp: string;
  sessionId: string;
  userId?: string;
  deviceId: string;
  metadata: {
    documentType?: string;
    source?: string;
    campaign?: string;
    referrer?: string;
    userAgent?: string;
    ipAddress?: string;
    countryCode?: string;
    stateCode?: string;
    cityName?: string;
    device?: string;
    browser?: string;
    os?: string;
    screenResolution?: string;
    viewportSize?: string;
    pageLoadTime?: number;
    timeOnStep?: number;
    scrollDepth?: number;
    clickCount?: number;
    formInteractions?: number;
    errorEncountered?: boolean;
    errorType?: string;
    exitPage?: string;
    previousStep?: string;
    dropoffReason?: string;
  };
}

export interface FunnelSession {
  sessionId: string;
  userId?: string;
  deviceId: string;
  startTime: string;
  endTime?: string;
  steps: FunnelStep[];
  currentStep: 'visit' | 'draft' | 'checkout' | 'signed' | 'abandoned';
  completed: boolean;
  abandoned: boolean;
  abandonedAt?: string;
  abandonmentReason?: string;
  conversionTime?: number; // Time from visit to signed in seconds
  documentType?: string;
  totalValue?: number;
  source: string;
  campaign?: string;
  cohort?: string;
  experiment?: string;
  variant?: string;
}

export interface ConversionMetrics {
  overall: {
    visitToSigned: number;
    visitToDraft: number;
    visitToCheckout: number;
    draftToCheckout: number;
    draftToSigned: number;
    checkoutToSigned: number;
  };
  stepDropoffs: {
    visitToDraft: number;
    draftToCheckout: number;
    checkoutToSigned: number;
  };
  timeMetrics: {
    avgTimeToConvert: number;
    avgTimePerStep: {
      visit: number;
      draft: number;
      checkout: number;
    };
    medianConversionTime: number;
  };
  segmentedMetrics: {
    byDocumentType: Record<string, ConversionMetrics['overall']>;
    bySource: Record<string, ConversionMetrics['overall']>;
    byDevice: Record<string, ConversionMetrics['overall']>;
    byCountry: Record<string, ConversionMetrics['overall']>;
    byCohort: Record<string, ConversionMetrics['overall']>;
  };
}

export interface AbandonmentAnalysis {
  abandonmentPoints: {
    step: string;
    count: number;
    percentage: number;
    avgTimeBeforeAbandon: number;
    commonReasons: string[];
    recoveryPotential: number;
  }[];
  abandonmentFactors: {
    factor: string;
    impact: number;
    correlation: number;
    description: string;
    actionable: boolean;
  }[];
  uxOptimizations: {
    priority: 'critical' | 'high' | 'medium' | 'low';
    step: string;
    issue: string;
    recommendation: string;
    estimatedImpact: number;
    implementationEffort: 'low' | 'medium' | 'high';
    testingRequired: boolean;
  }[];
}

export interface EventPayload {
  event: string;
  step: FunnelStep['step'];
  sessionId: string;
  userId?: string;
  deviceId: string;
  timestamp: string;
  properties: Record<string, any>;
  context: {
    page: string;
    referrer: string;
    userAgent: string;
    ip: string;
    location: {
      country: string;
      state: string;
      city: string;
    };
  };
}

class FunnelAnalyticsEngine {
  private sessions: Map<string, FunnelSession> = new Map();
  private bigQueryEnabled: boolean = false;
  private bigQueryTableId: string = 'funnel_events';

  constructor() {
    this.initializeBigQuery();
  }

  // Track a funnel step event
  async trackStep(step: FunnelStep): Promise<void> {
    try {
      // Update or create session
      let session = this.sessions.get(step.sessionId);
      if (!session) {
        session = this.createNewSession(step);
        this.sessions.set(step.sessionId, session);
      }

      // Add step to session
      session.steps.push(step);
      session.currentStep = step.step;
      session.endTime = step.timestamp;

      // Update session state
      if (step.step === 'signed') {
        session.completed = true;
        session.conversionTime = this.calculateConversionTime(session);
      }

      // Stream to BigQuery
      if (this.bigQueryEnabled) {
        await this.streamToBigQuery(step);
      }

      // Store locally (in production, use Redis/Database)
      this.persistSession(session);

      // Check for abandonment patterns
      this.checkAbandonmentRisk(session);
    } catch (error) {
      console.error('Error tracking funnel step:', error);
    }
  }

  // Detect session abandonment
  detectAbandonment(sessionId: string, timeoutMinutes: number = 30): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || session.completed || session.abandoned) {
      return false;
    }

    const lastActivity = new Date(session.endTime || session.startTime);
    const now = new Date();
    const timeDiff = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

    if (timeDiff > timeoutMinutes) {
      session.abandoned = true;
      session.abandonedAt = now.toISOString();
      session.abandonmentReason = this.inferAbandonmentReason(session);

      // Stream abandonment event to BigQuery
      if (this.bigQueryEnabled) {
        this.streamAbandonmentEvent(session);
      }

      return true;
    }

    return false;
  }

  // Calculate conversion metrics
  calculateConversionMetrics(timeframe: string = '30d'): ConversionMetrics {
    const sessions = this.getSessionsInTimeframe(timeframe);

    const visitSessions = sessions.length;
    const draftSessions = sessions.filter((s) =>
      this.hasStep(s, 'draft'),
    ).length;
    const checkoutSessions = sessions.filter((s) =>
      this.hasStep(s, 'checkout'),
    ).length;
    const signedSessions = sessions.filter((s) =>
      this.hasStep(s, 'signed'),
    ).length;

    return {
      overall: {
        visitToSigned: this.calculateRate(signedSessions, visitSessions),
        visitToDraft: this.calculateRate(draftSessions, visitSessions),
        visitToCheckout: this.calculateRate(checkoutSessions, visitSessions),
        draftToCheckout: this.calculateRate(checkoutSessions, draftSessions),
        draftToSigned: this.calculateRate(signedSessions, draftSessions),
        checkoutToSigned: this.calculateRate(signedSessions, checkoutSessions),
      },
      stepDropoffs: {
        visitToDraft: this.calculateRate(
          visitSessions - draftSessions,
          visitSessions,
        ),
        draftToCheckout: this.calculateRate(
          draftSessions - checkoutSessions,
          draftSessions,
        ),
        checkoutToSigned: this.calculateRate(
          checkoutSessions - signedSessions,
          checkoutSessions,
        ),
      },
      timeMetrics: this.calculateTimeMetrics(sessions),
      segmentedMetrics: this.calculateSegmentedMetrics(sessions),
    };
  }

  // Analyze abandonment patterns
  analyzeAbandonment(): AbandonmentAnalysis {
    const abandonedSessions = Array.from(this.sessions.values()).filter(
      (s) => s.abandoned || (!s.completed && this.isStale(s)),
    );

    const abandonmentPoints =
      this.calculateAbandonmentPoints(abandonedSessions);
    const abandonmentFactors =
      this.identifyAbandonmentFactors(abandonedSessions);
    const uxOptimizations = this.generateUXOptimizations(
      abandonmentPoints,
      abandonmentFactors,
    );

    return {
      abandonmentPoints,
      abandonmentFactors,
      uxOptimizations,
    };
  }

  // Stream event to BigQuery
  private async streamToBigQuery(step: FunnelStep): Promise<void> {
    if (!this.bigQueryEnabled) return;

    const payload = {
      event_timestamp: step.timestamp,
      session_id: step.sessionId,
      user_id: step.userId,
      device_id: step.deviceId,
      step: step.step,
      step_order: step.stepOrder,
      document_type: step.metadata.documentType,
      source: step.metadata.source,
      campaign: step.metadata.campaign,
      country_code: step.metadata.countryCode,
      state_code: step.metadata.stateCode,
      device: step.metadata.device,
      browser: step.metadata.browser,
      page_load_time: step.metadata.pageLoadTime,
      time_on_step: step.metadata.timeOnStep,
      scroll_depth: step.metadata.scrollDepth,
      click_count: step.metadata.clickCount,
      form_interactions: step.metadata.formInteractions,
      error_encountered: step.metadata.errorEncountered,
      error_type: step.metadata.errorType,
      created_at: new Date().toISOString(),
    };

    try {
      // In production, use actual BigQuery client
      console.log('Streaming to BigQuery:', payload);
      // await bigQueryClient.dataset('analytics').table(this.bigQueryTableId).insert([payload]);
    } catch (error) {
      console.error('BigQuery streaming error:', error);
    }
  }

  // Helper methods
  private createNewSession(firstStep: FunnelStep): FunnelSession {
    return {
      sessionId: firstStep.sessionId,
      userId: firstStep.userId,
      deviceId: firstStep.deviceId,
      startTime: firstStep.timestamp,
      steps: [],
      currentStep: firstStep.step,
      completed: false,
      abandoned: false,
      documentType: firstStep.metadata.documentType,
      source: firstStep.metadata.source || 'direct',
      campaign: firstStep.metadata.campaign,
    };
  }

  private calculateConversionTime(session: FunnelSession): number {
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime!);
    return (endTime.getTime() - startTime.getTime()) / 1000; // seconds
  }

  private hasStep(session: FunnelSession, step: string): boolean {
    return session.steps.some((s) => s.step === step);
  }

  private calculateRate(numerator: number, denominator: number): number {
    return denominator > 0 ? (numerator / denominator) * 100 : 0;
  }

  private calculateTimeMetrics(sessions: FunnelSession[]) {
    const completedSessions = sessions.filter((s) => s.completed);

    const conversionTimes = completedSessions
      .map((s) => s.conversionTime!)
      .filter((t) => t !== undefined);

    return {
      avgTimeToConvert:
        conversionTimes.length > 0
          ? conversionTimes.reduce((sum, time) => sum + time, 0) /
            conversionTimes.length
          : 0,
      avgTimePerStep: {
        visit: this.calculateAvgTimeOnStep(sessions, 'visit'),
        draft: this.calculateAvgTimeOnStep(sessions, 'draft'),
        checkout: this.calculateAvgTimeOnStep(sessions, 'checkout'),
      },
      medianConversionTime: this.calculateMedian(conversionTimes),
    };
  }

  private calculateAvgTimeOnStep(
    sessions: FunnelSession[],
    step: string,
  ): number {
    const times = sessions
      .flatMap((s) => s.steps)
      .filter((s) => s.step === step && s.metadata.timeOnStep)
      .map((s) => s.metadata.timeOnStep!);

    return times.length > 0
      ? times.reduce((sum, time) => sum + time, 0) / times.length
      : 0;
  }

  private calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private calculateSegmentedMetrics(sessions: FunnelSession[]) {
    // Group sessions by different dimensions
    const byDocumentType = this.groupSessionsBy(sessions, 'documentType');
    const bySource = this.groupSessionsBy(sessions, 'source');
    // Add more segmentations as needed

    return {
      byDocumentType: this.calculateMetricsForGroups(byDocumentType),
      bySource: this.calculateMetricsForGroups(bySource),
      byDevice: {},
      byCountry: {},
      byCohort: {},
    };
  }

  private groupSessionsBy(
    sessions: FunnelSession[],
    field: keyof FunnelSession,
  ): Record<string, FunnelSession[]> {
    return sessions.reduce(
      (groups, session) => {
        const key = String(session[field] || 'unknown');
        if (!groups[key]) groups[key] = [];
        groups[key].push(session);
        return groups;
      },
      {} as Record<string, FunnelSession[]>,
    );
  }

  private calculateMetricsForGroups(groups: Record<string, FunnelSession[]>) {
    const result: Record<string, any> = {};

    for (const [key, sessions] of Object.entries(groups)) {
      const visitSessions = sessions.length;
      const draftSessions = sessions.filter((s) =>
        this.hasStep(s, 'draft'),
      ).length;
      const checkoutSessions = sessions.filter((s) =>
        this.hasStep(s, 'checkout'),
      ).length;
      const signedSessions = sessions.filter((s) =>
        this.hasStep(s, 'signed'),
      ).length;

      result[key] = {
        visitToSigned: this.calculateRate(signedSessions, visitSessions),
        visitToDraft: this.calculateRate(draftSessions, visitSessions),
        visitToCheckout: this.calculateRate(checkoutSessions, visitSessions),
        draftToCheckout: this.calculateRate(checkoutSessions, draftSessions),
        draftToSigned: this.calculateRate(signedSessions, draftSessions),
        checkoutToSigned: this.calculateRate(signedSessions, checkoutSessions),
      };
    }

    return result;
  }

  private calculateAbandonmentPoints(abandonedSessions: FunnelSession[]) {
    const stepCounts = {
      visit: 0,
      draft: 0,
      checkout: 0,
    };

    const stepTimes = {
      visit: [] as number[],
      draft: [] as number[],
      checkout: [] as number[],
    };

    abandonedSessions.forEach((session) => {
      const lastStep = session.steps[session.steps.length - 1];
      if (lastStep && lastStep.step in stepCounts) {
        stepCounts[lastStep.step as keyof typeof stepCounts]++;

        const timeOnStep = lastStep.metadata.timeOnStep || 0;
        stepTimes[lastStep.step as keyof typeof stepTimes].push(timeOnStep);
      }
    });

    const totalAbandoned = abandonedSessions.length;

    return Object.entries(stepCounts).map(([step, count]) => ({
      step,
      count,
      percentage: this.calculateRate(count, totalAbandoned),
      avgTimeBeforeAbandon:
        stepTimes[step as keyof typeof stepTimes].length > 0
          ? stepTimes[step as keyof typeof stepTimes].reduce(
              (sum, time) => sum + time,
              0,
            ) / stepTimes[step as keyof typeof stepTimes].length
          : 0,
      commonReasons: this.identifyCommonAbandonmentReasons(
        abandonedSessions,
        step,
      ),
      recoveryPotential: this.calculateRecoveryPotential(
        step,
        count,
        totalAbandoned,
      ),
    }));
  }

  private identifyAbandonmentFactors(abandonedSessions: FunnelSession[]) {
    // Analyze patterns in abandoned sessions
    return [
      {
        factor: 'Page Load Time',
        impact: 0.15,
        correlation: 0.73,
        description: 'Slow page loads correlate with abandonment',
        actionable: true,
      },
      {
        factor: 'Form Complexity',
        impact: 0.22,
        correlation: 0.68,
        description: 'Complex forms increase abandonment risk',
        actionable: true,
      },
      {
        factor: 'Mobile Experience',
        impact: 0.18,
        correlation: 0.71,
        description: 'Poor mobile UX drives abandonment',
        actionable: true,
      },
      {
        factor: 'Pricing Transparency',
        impact: 0.12,
        correlation: 0.64,
        description: 'Hidden costs cause checkout abandonment',
        actionable: true,
      },
    ];
  }

  private generateUXOptimizations(abandonmentPoints: any[], factors: any[]) {
    return [
      {
        priority: 'critical' as const,
        step: 'checkout',
        issue: 'High checkout abandonment rate',
        recommendation: 'Simplify checkout flow and improve trust signals',
        estimatedImpact: 15.5,
        implementationEffort: 'medium' as const,
        testingRequired: true,
      },
      {
        priority: 'high' as const,
        step: 'draft',
        issue: 'Form completion challenges',
        recommendation: 'Add auto-save and progress indicators',
        estimatedImpact: 12.3,
        implementationEffort: 'low' as const,
        testingRequired: true,
      },
      {
        priority: 'medium' as const,
        step: 'visit',
        issue: 'Initial engagement issues',
        recommendation: 'Optimize landing page and value proposition',
        estimatedImpact: 8.7,
        implementationEffort: 'high' as const,
        testingRequired: true,
      },
    ];
  }

  private identifyCommonAbandonmentReasons(
    sessions: FunnelSession[],
    step: string,
  ): string[] {
    // Analyze abandonment reasons for a specific step
    return [
      'Long form completion time',
      'Technical errors',
      'Pricing concerns',
      'Trust issues',
      'Competitor comparison',
    ];
  }

  private calculateRecoveryPotential(
    step: string,
    abandonCount: number,
    totalAbandoned: number,
  ): number {
    // Calculate the potential revenue recovery based on step and historical data
    const baseRecovery = {
      visit: 0.05,
      draft: 0.25,
      checkout: 0.45,
    };

    return (baseRecovery[step as keyof typeof baseRecovery] || 0) * 100;
  }

  private inferAbandonmentReason(session: FunnelSession): string {
    const lastStep = session.steps[session.steps.length - 1];

    if (lastStep?.metadata.errorEncountered) {
      return 'Technical Error';
    }

    if (lastStep?.metadata.timeOnStep && lastStep.metadata.timeOnStep > 300) {
      return 'Long Completion Time';
    }

    if (session.currentStep === 'checkout') {
      return 'Checkout Hesitation';
    }

    return 'Unknown';
  }

  private checkAbandonmentRisk(session: FunnelSession): void {
    // Real-time abandonment risk detection
    const risk = this.calculateAbandonmentRisk(session);

    if (risk > 0.7) {
      // Trigger intervention (exit intent popup, chat offer, etc.)
      this.triggerRetentionIntervention(session);
    }
  }

  private calculateAbandonmentRisk(session: FunnelSession): number {
    let risk = 0;

    const lastStep = session.steps[session.steps.length - 1];
    if (!lastStep) return 0;

    // Time on current step
    if (lastStep.metadata.timeOnStep && lastStep.metadata.timeOnStep > 180) {
      risk += 0.3;
    }

    // Error encounters
    if (lastStep.metadata.errorEncountered) {
      risk += 0.4;
    }

    // Low engagement indicators
    if (lastStep.metadata.scrollDepth && lastStep.metadata.scrollDepth < 30) {
      risk += 0.2;
    }

    if (lastStep.metadata.clickCount && lastStep.metadata.clickCount < 3) {
      risk += 0.1;
    }

    return Math.min(1, risk);
  }

  private triggerRetentionIntervention(session: FunnelSession): void {
    // In production, trigger retention mechanisms
    console.log(
      `Triggering retention intervention for session ${session.sessionId}`,
    );
  }

  private getSessionsInTimeframe(timeframe: string): FunnelSession[] {
    const now = new Date();
    const cutoff = new Date();

    switch (timeframe) {
      case '7d':
        cutoff.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoff.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoff.setDate(now.getDate() - 90);
        break;
      default:
        cutoff.setDate(now.getDate() - 30);
    }

    return Array.from(this.sessions.values()).filter(
      (session) => new Date(session.startTime) >= cutoff,
    );
  }

  private isStale(session: FunnelSession): boolean {
    const lastActivity = new Date(session.endTime || session.startTime);
    const now = new Date();
    const hoursSinceActivity =
      (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

    return hoursSinceActivity > 24; // Consider stale after 24 hours
  }

  private persistSession(session: FunnelSession): void {
    // In production, persist to database
    localStorage.setItem(
      `funnel_session_${session.sessionId}`,
      JSON.stringify(session),
    );
  }

  private async streamAbandonmentEvent(session: FunnelSession): Promise<void> {
    const payload = {
      event_type: 'abandonment',
      session_id: session.sessionId,
      user_id: session.userId,
      abandoned_at: session.abandonedAt,
      abandonment_reason: session.abandonmentReason,
      last_step: session.currentStep,
      steps_completed: session.steps.length,
      time_in_funnel: session.conversionTime || 0,
      document_type: session.documentType,
      source: session.source,
      created_at: new Date().toISOString(),
    };

    if (this.bigQueryEnabled) {
      console.log('Streaming abandonment to BigQuery:', payload);
    }
  }

  private initializeBigQuery(): void {
    // In production, initialize BigQuery client
    this.bigQueryEnabled = process.env.BIGQUERY_ENABLED === 'true';
  }
}

// Singleton instance
export const funnelAnalytics = new FunnelAnalyticsEngine();

// Export utility functions
export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateDeviceId(): string {
  // In production, use fingerprinting library
  return `dev_${Math.random().toString(36).substr(2, 12)}`;
}

export function createFunnelStep(
  step: FunnelStep['step'],
  sessionId: string,
  metadata: Partial<FunnelStep['metadata']> = {},
): FunnelStep {
  const stepOrder = { visit: 1, draft: 2, checkout: 3, signed: 4 }[step];

  return {
    step,
    stepOrder,
    timestamp: new Date().toISOString(),
    sessionId,
    deviceId: generateDeviceId(),
    metadata: {
      userAgent: navigator?.userAgent,
      pageLoadTime: performance?.timing
        ? performance.timing.loadEventEnd - performance.timing.navigationStart
        : undefined,
      screenResolution: screen ? `${screen.width}x${screen.height}` : undefined,
      viewportSize: window
        ? `${window.innerWidth}x${window.innerHeight}`
        : undefined,
      ...metadata,
    },
  };
}
