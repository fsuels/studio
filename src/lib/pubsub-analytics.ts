// Google Pub/Sub Integration for Analytics Events
// Provides scalable event streaming to BigQuery via Pub/Sub
// Enhances the existing direct BigQuery streaming with better reliability and buffering

import { PubSub } from '@google-cloud/pubsub';

export interface PubSubEventPayload {
  eventId: string;
  eventName: string;
  sessionId: string;
  userId?: string;
  deviceId: string;
  timestamp: string;

  userProperties: {
    country?: string;
    state?: string;
    city?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };

  eventProperties: {
    pagePath?: string;
    pageTitle?: string;
    documentType?: string;
    formName?: string;
    fieldName?: string;
    errorType?: string;
    errorMessage?: string;
    value?: number;
    step?: string;
    timeOnPage?: number;
    scrollDepth?: number;
    clickCount?: number;
    formInteractions?: number;
  };

  technicalProperties: {
    userAgent?: string;
    ipAddress?: string;
    screenResolution?: string;
    viewportSize?: string;
    pageLoadTime?: number;
    connectionType?: string;
  };

  calculatedFields: {
    createdAt: string;
    date: string; // YYYY-MM-DD
    hour: number;
  };
}

class PubSubAnalyticsService {
  private pubsub: PubSub;
  private topicName: string;
  private projectId: string;
  private isEnabled: boolean;
  private batchSize: number = 100;
  private batchTimeout: number = 5000; // 5 seconds
  private eventQueue: PubSubEventPayload[] = [];
  private batchTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.projectId =
      process.env.GOOGLE_CLOUD_PROJECT_ID ||
      process.env.BIGQUERY_PROJECT_ID ||
      '';
    this.topicName = process.env.PUBSUB_ANALYTICS_TOPIC || 'analytics-events';
    this.isEnabled = process.env.PUBSUB_ENABLED === 'true' && !!this.projectId;

    if (this.isEnabled) {
      this.pubsub = new PubSub({
        projectId: this.projectId,
        // In production, configure authentication via service account key
        // keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });

      this.initializeTopic();
    }
  }

  // Stream a single event to Pub/Sub
  async publishEvent(event: PubSubEventPayload): Promise<boolean> {
    if (!this.isEnabled) {
      console.log(
        'Pub/Sub not enabled, falling back to direct BigQuery streaming',
      );
      return false;
    }

    try {
      // Add to batch queue for efficient processing
      this.eventQueue.push(event);

      // Process immediately if batch is full
      if (this.eventQueue.length >= this.batchSize) {
        await this.processBatch();
      } else {
        // Set timer for batch processing if not already set
        if (!this.batchTimer) {
          this.batchTimer = setTimeout(() => {
            this.processBatch();
          }, this.batchTimeout);
        }
      }

      return true;
    } catch (error) {
      console.error('Error publishing event to Pub/Sub:', error);
      return false;
    }
  }

  // Batch publish multiple events for efficiency
  async publishEventBatch(
    events: PubSubEventPayload[],
  ): Promise<{ successful: number; failed: number }> {
    if (!this.isEnabled) {
      return { successful: 0, failed: events.length };
    }

    let successful = 0;
    let failed = 0;

    try {
      const topic = this.pubsub.topic(this.topicName);

      // Split into smaller batches if needed (Pub/Sub recommends max 1000 messages per batch)
      const maxBatchSize = 1000;
      const batches = this.chunkArray(events, maxBatchSize);

      for (const batch of batches) {
        try {
          const messages = batch.map((event) => ({
            data: Buffer.from(JSON.stringify(event)),
            attributes: {
              eventName: event.eventName,
              source: 'legal-doc-platform',
              version: '1.0',
              timestamp: event.timestamp,
            },
            // Add ordering key for related events
            orderingKey: event.sessionId,
          }));

          const messageIds = await topic.publishMessage(...messages);
          successful += messageIds.length;

          console.log(
            `Published ${messageIds.length} events to Pub/Sub topic ${this.topicName}`,
          );
        } catch (batchError) {
          console.error('Error publishing batch to Pub/Sub:', batchError);
          failed += batch.length;
        }
      }
    } catch (error) {
      console.error('Error in batch publish to Pub/Sub:', error);
      failed = events.length;
    }

    return { successful, failed };
  }

  // Enhanced analytics event with Pub/Sub integration
  async streamAnalyticsEvent(eventData: any): Promise<boolean> {
    const pubsubEvent: PubSubEventPayload = {
      eventId: this.generateEventId(),
      eventName: eventData.eventName || eventData.event,
      sessionId: eventData.sessionId,
      userId: eventData.userId,
      deviceId: eventData.deviceId,
      timestamp: eventData.timestamp || new Date().toISOString(),

      userProperties: {
        country: eventData.userProperties?.country,
        state: eventData.userProperties?.state,
        city: eventData.userProperties?.city,
        deviceType: eventData.userProperties?.deviceType,
        browser: eventData.userProperties?.browser,
        os: eventData.userProperties?.os,
        referrer: eventData.userProperties?.referrer,
        utmSource: eventData.userProperties?.utmSource,
        utmMedium: eventData.userProperties?.utmMedium,
        utmCampaign: eventData.userProperties?.utmCampaign,
      },

      eventProperties: {
        pagePath: eventData.eventProperties?.pagePath,
        pageTitle: eventData.eventProperties?.pageTitle,
        documentType: eventData.eventProperties?.documentType,
        formName: eventData.eventProperties?.formName,
        fieldName: eventData.eventProperties?.fieldName,
        errorType: eventData.eventProperties?.errorType,
        errorMessage: eventData.eventProperties?.errorMessage,
        value: eventData.eventProperties?.value,
        step: eventData.eventProperties?.step,
        timeOnPage: eventData.eventProperties?.timeOnPage,
        scrollDepth: eventData.eventProperties?.scrollDepth,
        clickCount: eventData.eventProperties?.clickCount,
        formInteractions: eventData.eventProperties?.formInteractions,
      },

      technicalProperties: {
        userAgent: eventData.technicalProperties?.userAgent,
        ipAddress: eventData.technicalProperties?.ipAddress,
        screenResolution: eventData.technicalProperties?.screenResolution,
        viewportSize: eventData.technicalProperties?.viewportSize,
        pageLoadTime: eventData.technicalProperties?.pageLoadTime,
        connectionType: eventData.technicalProperties?.connectionType,
      },

      calculatedFields: {
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        hour: new Date().getHours(),
      },
    };

    return await this.publishEvent(pubsubEvent);
  }

  // Funnel event streaming via Pub/Sub
  async streamFunnelEvent(funnelStep: any): Promise<boolean> {
    const funnelEvent: PubSubEventPayload = {
      eventId: this.generateEventId(),
      eventName: 'funnel_step',
      sessionId: funnelStep.sessionId,
      userId: funnelStep.userId,
      deviceId: funnelStep.deviceId,
      timestamp: funnelStep.timestamp,

      userProperties: {
        country: funnelStep.metadata?.countryCode,
        state: funnelStep.metadata?.stateCode,
        deviceType: funnelStep.metadata?.device,
        browser: funnelStep.metadata?.browser,
        os: funnelStep.metadata?.os,
        referrer: funnelStep.metadata?.referrer,
        utmSource: funnelStep.metadata?.source,
        utmMedium: funnelStep.metadata?.campaign,
      },

      eventProperties: {
        pagePath: funnelStep.metadata?.exitPage,
        documentType: funnelStep.metadata?.documentType,
        step: funnelStep.step,
        value: funnelStep.stepOrder,
        timeOnPage: funnelStep.metadata?.timeOnStep,
        scrollDepth: funnelStep.metadata?.scrollDepth,
        clickCount: funnelStep.metadata?.clickCount,
        formInteractions: funnelStep.metadata?.formInteractions,
        errorType: funnelStep.metadata?.errorType,
      },

      technicalProperties: {
        userAgent: funnelStep.metadata?.userAgent,
        ipAddress: funnelStep.metadata?.ipAddress,
        screenResolution: funnelStep.metadata?.screenResolution,
        viewportSize: funnelStep.metadata?.viewportSize,
        pageLoadTime: funnelStep.metadata?.pageLoadTime,
      },

      calculatedFields: {
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        hour: new Date().getHours(),
      },
    };

    return await this.publishEvent(funnelEvent);
  }

  // Fraud/Risk event streaming
  async streamRiskEvent(riskAssessment: any, orderData: any): Promise<boolean> {
    const riskEvent: PubSubEventPayload = {
      eventId: this.generateEventId(),
      eventName: 'risk_assessment',
      sessionId: orderData.sessionId || `risk_${Date.now()}`,
      userId: orderData.customer?.userId,
      deviceId: riskAssessment.deviceFingerprint?.id || 'unknown',
      timestamp: riskAssessment.timestamp,

      userProperties: {
        country: orderData.customer?.ipLocation?.country,
        state: orderData.customer?.ipLocation?.state,
        city: orderData.customer?.ipLocation?.city,
      },

      eventProperties: {
        documentType: orderData.documentType,
        value: orderData.payment?.amount,
        errorType: riskAssessment.riskLevel,
        errorMessage: riskAssessment.recommendation,
      },

      technicalProperties: {
        userAgent: riskAssessment.deviceFingerprint?.userAgent,
        ipAddress: orderData.customer?.ipLocation?.ip,
      },

      calculatedFields: {
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        hour: new Date().getHours(),
      },
    };

    return await this.publishEvent(riskEvent);
  }

  // Process queued events in batches
  private async processBatch(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const eventsToProcess = [...this.eventQueue];
    this.eventQueue = [];

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    const result = await this.publishEventBatch(eventsToProcess);

    if (result.failed > 0) {
      console.warn(`Failed to publish ${result.failed} events to Pub/Sub`);
      // In production, implement retry logic or dead letter queue
    }
  }

  // Initialize Pub/Sub topic if it doesn't exist
  private async initializeTopic(): Promise<void> {
    try {
      const topic = this.pubsub.topic(this.topicName);
      const [exists] = await topic.exists();

      if (!exists) {
        console.log(`Creating Pub/Sub topic: ${this.topicName}`);
        await topic.create({
          messageRetentionDuration: { seconds: 604800 }, // 7 days
          messageStoragePolicy: {
            allowedPersistenceRegions: ['us-central1', 'us-east1'], // Adjust for your region
          },
        });
        console.log(`Created Pub/Sub topic: ${this.topicName}`);
      }

      // Enable message ordering for session-based events
      await topic.setOptions({
        enableMessageOrdering: true,
      });
    } catch (error) {
      console.error('Error initializing Pub/Sub topic:', error);
      this.isEnabled = false; // Disable if topic creation fails
    }
  }

  // Create BigQuery subscription for the topic
  async createBigQuerySubscription(): Promise<boolean> {
    if (!this.isEnabled) return false;

    try {
      const subscriptionName = `${this.topicName}-bigquery-sub`;
      const topic = this.pubsub.topic(this.topicName);

      // Check if subscription exists
      const subscription = topic.subscription(subscriptionName);
      const [exists] = await subscription.exists();

      if (!exists) {
        console.log(`Creating BigQuery subscription: ${subscriptionName}`);

        await subscription.create({
          bigqueryConfig: {
            table: `${this.projectId}.analytics.events`, // Match your BigQuery table
            useTopicSchema: false,
            writeMetadata: true,
          },
          deadLetterPolicy: {
            deadLetterTopic: `projects/${this.projectId}/topics/${this.topicName}-dead-letter`,
            maxDeliveryAttempts: 5,
          },
          retryPolicy: {
            minimumBackoff: { seconds: 10 },
            maximumBackoff: { seconds: 600 },
          },
        });

        console.log(`Created BigQuery subscription: ${subscriptionName}`);
      }

      return true;
    } catch (error) {
      console.error('Error creating BigQuery subscription:', error);
      return false;
    }
  }

  // Health check for Pub/Sub connectivity
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    details: any;
  }> {
    if (!this.isEnabled) {
      return {
        status: 'unhealthy',
        details: { error: 'Pub/Sub not enabled' },
      };
    }

    try {
      const topic = this.pubsub.topic(this.topicName);
      const [exists] = await topic.exists();

      if (!exists) {
        return {
          status: 'unhealthy',
          details: { error: `Topic ${this.topicName} does not exist` },
        };
      }

      // Test publish a small event
      const testEvent: PubSubEventPayload = {
        eventId: 'health_check',
        eventName: 'health_check',
        sessionId: 'health_check',
        deviceId: 'health_check',
        timestamp: new Date().toISOString(),
        userProperties: {},
        eventProperties: {},
        technicalProperties: {},
        calculatedFields: {
          createdAt: new Date().toISOString(),
          date: new Date().toISOString().split('T')[0],
          hour: new Date().getHours(),
        },
      };

      await this.publishEvent(testEvent);

      return {
        status: 'healthy',
        details: {
          topicName: this.topicName,
          projectId: this.projectId,
          queueSize: this.eventQueue.length,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: (error as Error).message },
      };
    }
  }

  // Utility methods
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  // Graceful shutdown - process remaining events
  async shutdown(): Promise<void> {
    if (this.eventQueue.length > 0) {
      console.log(
        `Processing ${this.eventQueue.length} remaining events before shutdown`,
      );
      await this.processBatch();
    }
  }
}

// Singleton instance
export const pubsubAnalytics = new PubSubAnalyticsService();

// Export types
export type { PubSubEventPayload };
