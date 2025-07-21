// src/lib/webhook-registry.ts
import { Timestamp } from 'firebase/firestore';

export interface WebhookSubscription {
  id: string;
  userId: string;
  organizationId?: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  isActive: boolean;
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
    maxBackoffSeconds: number;
  };
  metadata: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastDeliveryAt?: Timestamp;
  deliveryStats: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    avgResponseTime: number;
  };
}

export interface WebhookDelivery {
  id: string;
  subscriptionId: string;
  eventType: WebhookEvent;
  payload: any;
  url: string;
  httpMethod: 'POST';
  headers: Record<string, string>;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  statusCode?: number;
  responseBody?: string;
  errorMessage?: string;
  attempts: number;
  nextRetryAt?: Timestamp;
  deliveredAt?: Timestamp;
  createdAt: Timestamp;
}

export type WebhookEvent =
  | 'document.created'
  | 'document.updated'
  | 'document.signed'
  | 'document.completed'
  | 'document.deleted'
  | 'user.created'
  | 'user.updated'
  | 'payment.succeeded'
  | 'payment.failed'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.cancelled'
  | 'compliance.audit'
  | 'template.created'
  | 'template.updated';

export interface WebhookEventPayload {
  id: string;
  type: WebhookEvent;
  data: any;
  timestamp: string;
  apiVersion: string;
  organizationId?: string;
  userId?: string;
}

export class WebhookRegistry {
  private static instance: WebhookRegistry;
  private subscriptions = new Map<string, WebhookSubscription>();
  private deliveryQueue: WebhookDelivery[] = [];

  static getInstance(): WebhookRegistry {
    if (!WebhookRegistry.instance) {
      WebhookRegistry.instance = new WebhookRegistry();
    }
    return WebhookRegistry.instance;
  }

  async subscribe(
    subscription: Omit<
      WebhookSubscription,
      'id' | 'createdAt' | 'updatedAt' | 'deliveryStats'
    >,
  ): Promise<WebhookSubscription> {
    const id = this.generateId();
    const now = Timestamp.now();

    const newSubscription: WebhookSubscription = {
      ...subscription,
      id,
      secret: this.generateSecret(),
      createdAt: now,
      updatedAt: now,
      deliveryStats: {
        totalDeliveries: 0,
        successfulDeliveries: 0,
        failedDeliveries: 0,
        avgResponseTime: 0,
      },
    };

    // Validate webhook URL
    await this.validateWebhookUrl(subscription.url);

    this.subscriptions.set(id, newSubscription);

    // Persist to database
    await this.persistSubscription(newSubscription);

    return newSubscription;
  }

  async unsubscribe(subscriptionId: string, userId: string): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);

    if (!subscription || subscription.userId !== userId) {
      throw new Error('Webhook subscription not found or unauthorized');
    }

    this.subscriptions.delete(subscriptionId);
    await this.removeSubscriptionFromDb(subscriptionId);

    return true;
  }

  async updateSubscription(
    subscriptionId: string,
    userId: string,
    updates: Partial<
      Pick<WebhookSubscription, 'url' | 'events' | 'isActive' | 'metadata'>
    >,
  ): Promise<WebhookSubscription> {
    const subscription = this.subscriptions.get(subscriptionId);

    if (!subscription || subscription.userId !== userId) {
      throw new Error('Webhook subscription not found or unauthorized');
    }

    if (updates.url) {
      await this.validateWebhookUrl(updates.url);
    }

    const updatedSubscription = {
      ...subscription,
      ...updates,
      updatedAt: Timestamp.now(),
    };

    this.subscriptions.set(subscriptionId, updatedSubscription);
    await this.persistSubscription(updatedSubscription);

    return updatedSubscription;
  }

  async getSubscriptions(
    userId: string,
    organizationId?: string,
  ): Promise<WebhookSubscription[]> {
    const userSubscriptions = Array.from(this.subscriptions.values()).filter(
      (sub) =>
        sub.userId === userId ||
        (organizationId && sub.organizationId === organizationId),
    );

    return userSubscriptions;
  }

  async triggerWebhook(
    event: WebhookEvent,
    data: any,
    context: { userId?: string; organizationId?: string },
  ): Promise<void> {
    const relevantSubscriptions = Array.from(
      this.subscriptions.values(),
    ).filter(
      (sub) =>
        sub.isActive &&
        sub.events.includes(event) &&
        (context.organizationId
          ? sub.organizationId === context.organizationId
          : sub.userId === context.userId),
    );

    const payload: WebhookEventPayload = {
      id: this.generateId(),
      type: event,
      data,
      timestamp: new Date().toISOString(),
      apiVersion: '2024-01',
      organizationId: context.organizationId,
      userId: context.userId,
    };

    for (const subscription of relevantSubscriptions) {
      await this.scheduleDelivery(subscription, payload);
    }
  }

  private async scheduleDelivery(
    subscription: WebhookSubscription,
    payload: WebhookEventPayload,
  ): Promise<void> {
    const delivery: WebhookDelivery = {
      id: this.generateId(),
      subscriptionId: subscription.id,
      eventType: payload.type,
      payload,
      url: subscription.url,
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': '123LegalDoc-Webhooks/1.0',
        'X-Webhook-Signature': this.generateSignature(
          payload,
          subscription.secret,
        ),
        'X-Webhook-Event': payload.type,
        'X-Webhook-ID': payload.id,
      },
      status: 'pending',
      attempts: 0,
      createdAt: Timestamp.now(),
    };

    this.deliveryQueue.push(delivery);
    await this.processDelivery(delivery);
  }

  private async processDelivery(delivery: WebhookDelivery): Promise<void> {
    const subscription = this.subscriptions.get(delivery.subscriptionId);
    if (!subscription) return;

    try {
      const response = await fetch(delivery.url, {
        method: delivery.httpMethod,
        headers: delivery.headers,
        body: JSON.stringify(delivery.payload),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      delivery.statusCode = response.status;
      delivery.responseBody = await response.text();
      delivery.deliveredAt = Timestamp.now();

      if (response.ok) {
        delivery.status = 'success';
        subscription.deliveryStats.successfulDeliveries++;
      } else {
        delivery.status = 'failed';
        delivery.errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        subscription.deliveryStats.failedDeliveries++;

        // Schedule retry if within limits
        if (delivery.attempts < subscription.retryPolicy.maxRetries) {
          await this.scheduleRetry(delivery, subscription.retryPolicy);
        }
      }

      subscription.deliveryStats.totalDeliveries++;
      subscription.lastDeliveryAt = Timestamp.now();
    } catch (error: any) {
      delivery.status = 'failed';
      delivery.errorMessage = error.message;
      subscription.deliveryStats.failedDeliveries++;

      // Schedule retry if within limits
      if (delivery.attempts < subscription.retryPolicy.maxRetries) {
        await this.scheduleRetry(delivery, subscription.retryPolicy);
      }
    }

    delivery.attempts++;
    await this.persistDelivery(delivery);
    await this.persistSubscription(subscription);
  }

  private async scheduleRetry(
    delivery: WebhookDelivery,
    retryPolicy: WebhookSubscription['retryPolicy'],
  ): Promise<void> {
    const backoffSeconds = Math.min(
      Math.pow(retryPolicy.backoffMultiplier, delivery.attempts),
      retryPolicy.maxBackoffSeconds,
    );

    delivery.nextRetryAt = Timestamp.fromMillis(
      Date.now() + backoffSeconds * 1000,
    );
    delivery.status = 'retrying';

    // Schedule the retry (in a real implementation, this would use a job queue)
    setTimeout(() => {
      this.processDelivery(delivery);
    }, backoffSeconds * 1000);
  }

  private async validateWebhookUrl(url: string): Promise<void> {
    try {
      const parsedUrl = new URL(url);

      // Security checks
      if (parsedUrl.protocol !== 'https:') {
        throw new Error('Webhook URL must use HTTPS');
      }

      if (
        parsedUrl.hostname === 'localhost' ||
        parsedUrl.hostname.startsWith('127.')
      ) {
        throw new Error('Webhook URL cannot point to localhost');
      }

      // Test connectivity
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`Webhook URL validation failed: ${response.status}`);
      }
    } catch (error: any) {
      throw new Error(`Invalid webhook URL: ${error.message}`);
    }
  }

  private generateSignature(payload: any, secret: string): string {
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    return `sha256=${signature}`;
  }

  private generateId(): string {
    return `wh_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
  }

  private generateSecret(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('base64');
  }

  private async persistSubscription(
    subscription: WebhookSubscription,
  ): Promise<void> {
    // Implementation would persist to Firebase/database
    console.log('Persisting webhook subscription:', subscription.id);
  }

  private async removeSubscriptionFromDb(
    subscriptionId: string,
  ): Promise<void> {
    // Implementation would remove from Firebase/database
    console.log('Removing webhook subscription:', subscriptionId);
  }

  private async persistDelivery(delivery: WebhookDelivery): Promise<void> {
    // Implementation would persist to Firebase/database
    console.log('Persisting webhook delivery:', delivery.id);
  }

  async getDeliveryHistory(
    subscriptionId: string,
    userId: string,
    limit = 50,
  ): Promise<WebhookDelivery[]> {
    const subscription = this.subscriptions.get(subscriptionId);

    if (!subscription || subscription.userId !== userId) {
      throw new Error('Webhook subscription not found or unauthorized');
    }

    // In a real implementation, this would query the database
    return this.deliveryQueue
      .filter((d) => d.subscriptionId === subscriptionId)
      .slice(-limit)
      .reverse();
  }

  async testWebhook(
    subscriptionId: string,
    userId: string,
  ): Promise<WebhookDelivery> {
    const subscription = this.subscriptions.get(subscriptionId);

    if (!subscription || subscription.userId !== userId) {
      throw new Error('Webhook subscription not found or unauthorized');
    }

    const testPayload: WebhookEventPayload = {
      id: this.generateId(),
      type: 'document.created',
      data: {
        test: true,
        message: 'This is a test webhook delivery',
      },
      timestamp: new Date().toISOString(),
      apiVersion: '2024-01',
      userId: subscription.userId,
      organizationId: subscription.organizationId,
    };

    const delivery: WebhookDelivery = {
      id: this.generateId(),
      subscriptionId: subscription.id,
      eventType: testPayload.type,
      payload: testPayload,
      url: subscription.url,
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': '123LegalDoc-Webhooks/1.0',
        'X-Webhook-Signature': this.generateSignature(
          testPayload,
          subscription.secret,
        ),
        'X-Webhook-Event': testPayload.type,
        'X-Webhook-ID': testPayload.id,
        'X-Webhook-Test': 'true',
      },
      status: 'pending',
      attempts: 0,
      createdAt: Timestamp.now(),
    };

    await this.processDelivery(delivery);
    return delivery;
  }
}
