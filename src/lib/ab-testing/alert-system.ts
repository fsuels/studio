// Automated Alert System for A/B Testing
// Multi-channel notifications for experiment events and performance changes

import {
  type MonitoringAlert,
  type ExperimentHealth,
  type GrowthMetrics,
} from './monitoring-service';
import { type Experiment, type ExperimentResults } from './experiment-engine';

export interface AlertChannel {
  id: string;
  name: string;
  type: 'email' | 'slack' | 'webhook' | 'sms' | 'browser';
  enabled: boolean;
  config: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: {
    eventTypes: MonitoringAlert['type'][];
    priorities: MonitoringAlert['priority'][];
    experimentTags?: string[];
    minimumConfidence?: number;
    minimumImpact?: number;
  };
  channels: string[]; // Channel IDs
  cooldownMinutes: number; // Prevent spam
  lastTriggered?: string;
}

export interface NotificationTemplate {
  type: MonitoringAlert['type'];
  priority: MonitoringAlert['priority'];
  subject: string;
  htmlTemplate: string;
  slackTemplate: string;
  webhookPayload: Record<string, any>;
}

class AlertSystemService {
  private channels: Map<string, AlertChannel> = new Map();
  private rules: AlertRule[] = [];
  private templates: Map<string, NotificationTemplate> = new Map();

  constructor() {
    this.initializeDefaultChannels();
    this.initializeDefaultRules();
    this.initializeDefaultTemplates();
  }

  // Channel Management
  private initializeDefaultChannels(): void {
    // Email channel
    this.addChannel({
      id: 'email_admin',
      name: 'Admin Email',
      type: 'email',
      enabled: true,
      config: {
        recipients: ['admin@123legaldoc.com', 'growth@123legaldoc.com'],
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT || '587'),
        smtpUser: process.env.SMTP_USER,
        smtpPass: process.env.SMTP_PASSWORD,
      },
    });

    // Slack channel
    this.addChannel({
      id: 'slack_growth',
      name: 'Growth Team Slack',
      type: 'slack',
      enabled: !!process.env.SLACK_WEBHOOK_URL,
      config: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        channel: '#growth-experiments',
        username: '123LegalDoc A/B Testing',
      },
    });

    // Webhook for external integrations
    this.addChannel({
      id: 'webhook_analytics',
      name: 'Analytics Webhook',
      type: 'webhook',
      enabled: !!process.env.ANALYTICS_WEBHOOK_URL,
      config: {
        url: process.env.ANALYTICS_WEBHOOK_URL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.ANALYTICS_WEBHOOK_TOKEN}`,
        },
      },
    });

    // Browser notifications
    this.addChannel({
      id: 'browser_notifications',
      name: 'Browser Notifications',
      type: 'browser',
      enabled: true,
      config: {},
    });
  }

  addChannel(channel: AlertChannel): void {
    this.channels.set(channel.id, channel);
  }

  getChannel(channelId: string): AlertChannel | undefined {
    return this.channels.get(channelId);
  }

  updateChannel(channelId: string, updates: Partial<AlertChannel>): void {
    const channel = this.channels.get(channelId);
    if (channel) {
      this.channels.set(channelId, { ...channel, ...updates });
    }
  }

  // Alert Rules Management
  private initializeDefaultRules(): void {
    // Critical experiment issues
    this.addRule({
      id: 'critical_experiment_issues',
      name: 'Critical Experiment Issues',
      description: 'Immediate alerts for critical experiment problems',
      enabled: true,
      conditions: {
        eventTypes: ['performance_drop', 'error_rate_high'],
        priorities: ['high', 'critical'],
      },
      channels: ['email_admin', 'slack_growth'],
      cooldownMinutes: 15,
    });

    // Statistical significance achieved
    this.addRule({
      id: 'significance_achieved',
      name: 'Statistical Significance Achieved',
      description: 'Alert when experiments reach statistical significance',
      enabled: true,
      conditions: {
        eventTypes: ['significance_reached'],
        priorities: ['low', 'medium', 'high'],
        minimumConfidence: 0.95,
      },
      channels: ['slack_growth', 'webhook_analytics'],
      cooldownMinutes: 60,
    });

    // Experiment duration warnings
    this.addRule({
      id: 'duration_warnings',
      name: 'Long Running Experiments',
      description: 'Warn when experiments run longer than expected',
      enabled: true,
      conditions: {
        eventTypes: ['duration_exceeded'],
        priorities: ['medium', 'high'],
      },
      channels: ['email_admin'],
      cooldownMinutes: 1440, // Daily
    });

    // High-impact experiment completion
    this.addRule({
      id: 'high_impact_completion',
      name: 'High Impact Experiment Results',
      description: 'Alert when high-impact experiments complete',
      enabled: true,
      conditions: {
        eventTypes: ['significance_reached'],
        priorities: ['medium', 'high'],
        minimumImpact: 15,
      },
      channels: ['email_admin', 'slack_growth'],
      cooldownMinutes: 0,
    });
  }

  addRule(rule: AlertRule): void {
    this.rules.push(rule);
  }

  updateRule(ruleId: string, updates: Partial<AlertRule>): void {
    const index = this.rules.findIndex((r) => r.id === ruleId);
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates };
    }
  }

  getRules(): AlertRule[] {
    return this.rules;
  }

  // Notification Templates
  private initializeDefaultTemplates(): void {
    // Statistical significance template
    this.addTemplate('significance_reached', 'medium', {
      type: 'significance_reached',
      priority: 'medium',
      subject:
        '🎯 A/B Test Reached Statistical Significance - {{experimentName}}',
      htmlTemplate: `
        <h2>🎯 Statistical Significance Achieved!</h2>
        <p><strong>Experiment:</strong> {{experimentName}}</p>
        <p><strong>Confidence Level:</strong> {{confidence}}%</p>
        <p><strong>Winning Variant:</strong> {{winningVariant}}</p>
        <p><strong>Impact:</strong> {{impact}}% improvement</p>
        <p><strong>Sample Size:</strong> {{sampleSize}} users</p>
        
        <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3>💡 Recommended Actions:</h3>
          <ul>
            <li>Review the experiment results in detail</li>
            <li>Consider implementing the winning variant</li>
            <li>Plan the rollout strategy</li>
            <li>Document learnings for future experiments</li>
          </ul>
        </div>
        
        <p><a href="{{dashboardUrl}}" style="background: #2563eb; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px;">View Full Results</a></p>
      `,
      slackTemplate: `
🎯 *Statistical Significance Achieved!*

*Experiment:* {{experimentName}}
*Confidence:* {{confidence}}%
*Winning Variant:* {{winningVariant}}
*Impact:* {{impact}}% improvement
*Sample Size:* {{sampleSize}} users

💡 *Next Steps:*
• Review results in detail
• Consider implementing winning variant
• Plan rollout strategy

<{{dashboardUrl}}|View Full Results>
      `,
      webhookPayload: {
        event: 'experiment_significance_reached',
        experiment: '{{experimentName}}',
        confidence: '{{confidence}}',
        impact: '{{impact}}',
        winningVariant: '{{winningVariant}}',
        sampleSize: '{{sampleSize}}',
      },
    });

    // Performance drop template
    this.addTemplate('performance_drop', 'high', {
      type: 'performance_drop',
      priority: 'high',
      subject: '🚨 Performance Drop Detected - {{experimentName}}',
      htmlTemplate: `
        <h2>🚨 Performance Drop Alert!</h2>
        <p><strong>Experiment:</strong> {{experimentName}}</p>
        <p><strong>Issue:</strong> Significant performance degradation detected</p>
        <p><strong>Affected Variant:</strong> {{affectedVariant}}</p>
        <p><strong>Performance Drop:</strong> {{dropPercentage}}%</p>
        
        <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #ef4444;">
          <h3>⚠️ Immediate Action Required:</h3>
          <ul>
            <li>Review experiment configuration</li>
            <li>Check for technical issues</li>
            <li>Consider pausing the underperforming variant</li>
            <li>Investigate user feedback and error logs</li>
          </ul>
        </div>
        
        <p><a href="{{dashboardUrl}}" style="background: #ef4444; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Investigate Now</a></p>
      `,
      slackTemplate: `
🚨 *Performance Drop Alert!*

*Experiment:* {{experimentName}}
*Issue:* Significant performance degradation
*Affected Variant:* {{affectedVariant}}
*Performance Drop:* {{dropPercentage}}%

⚠️ *Immediate Action Required:*
• Review experiment configuration
• Check for technical issues
• Consider pausing underperforming variant

<{{dashboardUrl}}|Investigate Now>
      `,
      webhookPayload: {
        event: 'experiment_performance_drop',
        experiment: '{{experimentName}}',
        severity: 'high',
        dropPercentage: '{{dropPercentage}}',
        affectedVariant: '{{affectedVariant}}',
      },
    });

    // Duration exceeded template
    this.addTemplate('duration_exceeded', 'medium', {
      type: 'duration_exceeded',
      priority: 'medium',
      subject: '⏰ Experiment Duration Exceeded - {{experimentName}}',
      htmlTemplate: `
        <h2>⏰ Experiment Running Longer Than Expected</h2>
        <p><strong>Experiment:</strong> {{experimentName}}</p>
        <p><strong>Expected Duration:</strong> {{expectedDuration}} days</p>
        <p><strong>Actual Duration:</strong> {{actualDuration}} days</p>
        <p><strong>Current Status:</strong> {{currentStatus}}</p>
        
        <div style="background: #fffbeb; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3>📋 Recommended Review:</h3>
          <ul>
            <li>Assess if more time is needed for significance</li>
            <li>Review current sample size and conversion rates</li>
            <li>Consider stopping if no clear winner emerges</li>
            <li>Evaluate experiment design for future improvements</li>
          </ul>
        </div>
        
        <p><a href="{{dashboardUrl}}" style="background: #f59e0b; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Review Experiment</a></p>
      `,
      slackTemplate: `
⏰ *Experiment Duration Exceeded*

*Experiment:* {{experimentName}}
*Expected:* {{expectedDuration}} days
*Actual:* {{actualDuration}} days
*Status:* {{currentStatus}}

📋 *Consider:*
• Review significance progress
• Evaluate sample size adequacy
• Consider stopping experiment

<{{dashboardUrl}}|Review Experiment>
      `,
      webhookPayload: {
        event: 'experiment_duration_exceeded',
        experiment: '{{experimentName}}',
        expectedDuration: '{{expectedDuration}}',
        actualDuration: '{{actualDuration}}',
      },
    });
  }

  addTemplate(
    type: MonitoringAlert['type'],
    priority: MonitoringAlert['priority'],
    template: NotificationTemplate,
  ): void {
    const key = `${type}_${priority}`;
    this.templates.set(key, template);
  }

  getTemplate(
    type: MonitoringAlert['type'],
    priority: MonitoringAlert['priority'],
  ): NotificationTemplate | undefined {
    const key = `${type}_${priority}`;
    return this.templates.get(key) || this.templates.get(`${type}_medium`); // Fallback to medium priority
  }

  // Main alert processing
  async processAlert(
    alert: MonitoringAlert,
    experiment?: Experiment,
    results?: ExperimentResults,
  ): Promise<void> {
    const applicableRules = this.rules.filter(
      (rule) => rule.enabled && this.doesAlertMatchRule(alert, rule),
    );

    for (const rule of applicableRules) {
      if (this.isRuleOnCooldown(rule)) {
        continue;
      }

      await this.sendAlert(alert, rule, experiment, results);

      // Update last triggered
      rule.lastTriggered = new Date().toISOString();
    }
  }

  private doesAlertMatchRule(alert: MonitoringAlert, rule: AlertRule): boolean {
    // Check event type
    if (!rule.conditions.eventTypes.includes(alert.type)) {
      return false;
    }

    // Check priority
    if (!rule.conditions.priorities.includes(alert.priority)) {
      return false;
    }

    // Check experiment tags if specified
    if (rule.conditions.experimentTags && alert.data.tags) {
      const hasMatchingTag = rule.conditions.experimentTags.some((tag) =>
        alert.data.tags.includes(tag),
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Check minimum confidence if specified
    if (rule.conditions.minimumConfidence && alert.data.confidence) {
      if (alert.data.confidence < rule.conditions.minimumConfidence) {
        return false;
      }
    }

    // Check minimum impact if specified
    if (rule.conditions.minimumImpact && alert.data.impact) {
      if (alert.data.impact < rule.conditions.minimumImpact) {
        return false;
      }
    }

    return true;
  }

  private isRuleOnCooldown(rule: AlertRule): boolean {
    if (!rule.lastTriggered || rule.cooldownMinutes === 0) {
      return false;
    }

    const lastTriggered = new Date(rule.lastTriggered);
    const cooldownEnd = new Date(
      lastTriggered.getTime() + rule.cooldownMinutes * 60000,
    );

    return new Date() < cooldownEnd;
  }

  private async sendAlert(
    alert: MonitoringAlert,
    rule: AlertRule,
    experiment?: Experiment,
    results?: ExperimentResults,
  ): Promise<void> {
    const template = this.getTemplate(alert.type, alert.priority);
    if (!template) {
      console.warn(
        `No template found for alert type ${alert.type} with priority ${alert.priority}`,
      );
      return;
    }

    const context = this.buildTemplateContext(alert, experiment, results);

    for (const channelId of rule.channels) {
      const channel = this.channels.get(channelId);
      if (!channel || !channel.enabled) {
        continue;
      }

      try {
        await this.sendToChannel(channel, template, context);
      } catch (error) {
        console.error(`Failed to send alert to channel ${channelId}:`, error);
      }
    }
  }

  private buildTemplateContext(
    alert: MonitoringAlert,
    experiment?: Experiment,
    results?: ExperimentResults,
  ): Record<string, string> {
    return {
      experimentName: experiment?.name || 'Unknown Experiment',
      experimentId: alert.experimentId,
      alertType: alert.type,
      alertPriority: alert.priority,
      alertMessage: alert.message,
      confidence: results?.confidence
        ? (results.confidence * 100).toFixed(1)
        : 'N/A',
      impact: results?.effectSize ? results.effectSize.toFixed(1) : 'N/A',
      winningVariant: results?.winningVariant || 'N/A',
      sampleSize: results
        ? Object.values(results.sampleSizes)
            .reduce((sum, size) => sum + size, 0)
            .toLocaleString()
        : 'N/A',
      dropPercentage: alert.data.dropPercentage || 'N/A',
      affectedVariant: alert.data.affectedVariant || 'N/A',
      expectedDuration: experiment?.estimatedDuration?.toString() || 'N/A',
      actualDuration: alert.data.actualDuration || 'N/A',
      currentStatus: experiment?.status || 'N/A',
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/admin/experiments/${alert.experimentId}`,
      timestamp: new Date(alert.createdAt).toLocaleString(),
    };
  }

  private async sendToChannel(
    channel: AlertChannel,
    template: NotificationTemplate,
    context: Record<string, string>,
  ): Promise<void> {
    switch (channel.type) {
      case 'email':
        await this.sendEmail(channel, template, context);
        break;
      case 'slack':
        await this.sendSlack(channel, template, context);
        break;
      case 'webhook':
        await this.sendWebhook(channel, template, context);
        break;
      case 'browser':
        await this.sendBrowserNotification(channel, template, context);
        break;
      case 'sms':
        await this.sendSMS(channel, template, context);
        break;
    }
  }

  private interpolateTemplate(
    template: string,
    context: Record<string, string>,
  ): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match;
    });
  }

  private async sendEmail(
    channel: AlertChannel,
    template: NotificationTemplate,
    context: Record<string, string>,
  ): Promise<void> {
    const subject = this.interpolateTemplate(template.subject, context);
    const htmlBody = this.interpolateTemplate(template.htmlTemplate, context);

    // In a real implementation, integrate with your email service
    console.log(`📧 Email Alert: ${subject}`);
    console.log(`To: ${channel.config.recipients.join(', ')}`);
    console.log(`Body: ${htmlBody.substring(0, 100)}...`);
  }

  private async sendSlack(
    channel: AlertChannel,
    template: NotificationTemplate,
    context: Record<string, string>,
  ): Promise<void> {
    const message = this.interpolateTemplate(template.slackTemplate, context);

    if (channel.config.webhookUrl) {
      const payload = {
        channel: channel.config.channel,
        username: channel.config.username,
        text: message,
        icon_emoji: ':warning:',
      };

      const response = await fetch(channel.config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Slack webhook failed: ${response.statusText}`);
      }
    }
  }

  private async sendWebhook(
    channel: AlertChannel,
    template: NotificationTemplate,
    context: Record<string, string>,
  ): Promise<void> {
    let payload = template.webhookPayload;

    // Interpolate values in payload
    payload = JSON.parse(
      this.interpolateTemplate(JSON.stringify(payload), context),
    );

    const response = await fetch(channel.config.url, {
      method: channel.config.method || 'POST',
      headers: channel.config.headers || { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }
  }

  private async sendBrowserNotification(
    channel: AlertChannel,
    template: NotificationTemplate,
    context: Record<string, string>,
  ): Promise<void> {
    const title = this.interpolateTemplate(template.subject, context);
    const body = context.alertMessage;

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: context.experimentId,
        });
      } else if (Notification.permission !== 'denied') {
        await Notification.requestPermission();
      }
    }
  }

  private async sendSMS(
    channel: AlertChannel,
    template: NotificationTemplate,
    context: Record<string, string>,
  ): Promise<void> {
    // Implement SMS integration (Twilio, etc.)
    console.log(`📱 SMS Alert: ${context.alertMessage}`);
  }

  // Configuration management
  exportConfiguration(): {
    channels: AlertChannel[];
    rules: AlertRule[];
    templates: NotificationTemplate[];
  } {
    return {
      channels: Array.from(this.channels.values()),
      rules: this.rules,
      templates: Array.from(this.templates.values()),
    };
  }

  importConfiguration(config: {
    channels?: AlertChannel[];
    rules?: AlertRule[];
    templates?: NotificationTemplate[];
  }): void {
    if (config.channels) {
      this.channels.clear();
      config.channels.forEach((channel) => this.addChannel(channel));
    }

    if (config.rules) {
      this.rules = config.rules;
    }

    if (config.templates) {
      this.templates.clear();
      config.templates.forEach((template) => {
        this.addTemplate(template.type, template.priority, template);
      });
    }
  }
}

// Singleton instance
export const alertSystem = new AlertSystemService();

// Utility function for testing alerts
export async function testAlert(channelId: string): Promise<void> {
  const testAlert: MonitoringAlert = {
    id: 'test_alert',
    experimentId: 'test_experiment',
    type: 'significance_reached',
    priority: 'medium',
    message: 'This is a test alert to verify your notification setup',
    data: {
      experiment: 'Test Experiment',
      confidence: 95.5,
      impact: 18.2,
      winningVariant: 'Variant B',
    },
    createdAt: new Date().toISOString(),
    acknowledged: false,
  };

  await alertSystem.processAlert(testAlert);
}

export type { AlertChannel, AlertRule, NotificationTemplate };
