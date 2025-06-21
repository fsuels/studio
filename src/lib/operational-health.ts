// src/lib/operational-health.ts
import { getDb } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

export interface HealthMetric {
  timestamp: number;
  metricType:
    | 'error_rate'
    | 'latency'
    | 'queue_depth'
    | 'success_rate'
    | 'memory_usage'
    | 'cpu_usage';
  value: number;
  endpoint?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface Alert {
  id: string;
  type:
    | 'error_spike'
    | 'high_latency'
    | 'queue_overflow'
    | 'anomaly'
    | 'downtime';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
  metadata: Record<string, any>;
}

export interface OperationalMetrics {
  errorRate: {
    current: number;
    p95: number;
    trend: 'up' | 'down' | 'stable';
  };
  latency: {
    p50: number;
    p95: number;
    p99: number;
    avg: number;
  };
  throughput: {
    requestsPerMinute: number;
    successfulRequests: number;
    failedRequests: number;
  };
  queueDepth: {
    current: number;
    max: number;
    processing: number;
  };
  systemHealth: {
    score: number; // 0-100
    status: 'healthy' | 'degraded' | 'critical';
    uptime: number;
  };
}

class OperationalHealthMonitor {
  private static instance: OperationalHealthMonitor;
  private metrics: HealthMetric[] = [];
  private alerts: Alert[] = [];
  private thresholds = {
    errorRate: { warning: 0.05, critical: 0.1 }, // 5% warning, 10% critical
    latencyP95: { warning: 2000, critical: 5000 }, // 2s warning, 5s critical
    queueDepth: { warning: 100, critical: 500 },
    memoryUsage: { warning: 0.8, critical: 0.95 },
  };

  private constructor() {
    this.startMetricsCollection();
  }

  static getInstance(): OperationalHealthMonitor {
    if (!OperationalHealthMonitor.instance) {
      OperationalHealthMonitor.instance = new OperationalHealthMonitor();
    }
    return OperationalHealthMonitor.instance;
  }

  // Record a metric
  async recordMetric(metric: Omit<HealthMetric, 'timestamp'>): Promise<void> {
    const timestampedMetric: HealthMetric = {
      ...metric,
      timestamp: Date.now(),
    };

    this.metrics.push(timestampedMetric);

    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Store in Firebase for persistence
    try {
      const db = await getDb();
      await addDoc(collection(db, 'operational_metrics'), {
        ...timestampedMetric,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to store metric:', error);
    }

    // Check for anomalies
    await this.checkAnomalies(timestampedMetric);
  }

  // Record request latency
  recordLatency(endpoint: string, duration: number, success: boolean): void {
    this.recordMetric({
      metricType: 'latency',
      value: duration,
      endpoint,
      metadata: { success },
    });

    // Also record success/error rate
    this.recordMetric({
      metricType: success ? 'success_rate' : 'error_rate',
      value: success ? 1 : 0,
      endpoint,
      metadata: { duration },
    });
  }

  // Record queue operations
  recordQueueOperation(
    queueName: string,
    operation: 'enqueue' | 'dequeue' | 'depth',
    value: number,
  ): void {
    this.recordMetric({
      metricType: 'queue_depth',
      value,
      metadata: { queueName, operation },
    });
  }

  // Get current operational metrics
  async getOperationalMetrics(): Promise<OperationalMetrics> {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const recentMetrics = this.metrics.filter((m) => m.timestamp >= oneHourAgo);

    // Calculate error rate
    const errorMetrics = recentMetrics.filter(
      (m) => m.metricType === 'error_rate',
    );
    const totalRequests = recentMetrics.filter(
      (m) => m.metricType === 'error_rate' || m.metricType === 'success_rate',
    ).length;
    const errorCount = errorMetrics.reduce((sum, m) => sum + m.value, 0);
    const currentErrorRate = totalRequests > 0 ? errorCount / totalRequests : 0;

    // Calculate latency percentiles
    const latencyMetrics = recentMetrics
      .filter((m) => m.metricType === 'latency')
      .map((m) => m.value)
      .sort((a, b) => a - b);

    const latency = {
      p50: this.percentile(latencyMetrics, 0.5),
      p95: this.percentile(latencyMetrics, 0.95),
      p99: this.percentile(latencyMetrics, 0.99),
      avg:
        latencyMetrics.length > 0
          ? latencyMetrics.reduce((a, b) => a + b, 0) / latencyMetrics.length
          : 0,
    };

    // Calculate throughput
    const successCount = recentMetrics
      .filter((m) => m.metricType === 'success_rate')
      .reduce((sum, m) => sum + m.value, 0);
    const requestsPerMinute = totalRequests / 60; // Approximate

    // Calculate queue depth
    const queueMetrics = recentMetrics.filter(
      (m) => m.metricType === 'queue_depth',
    );
    const currentQueueDepth =
      queueMetrics.length > 0 ? queueMetrics[queueMetrics.length - 1].value : 0;
    const maxQueueDepth =
      queueMetrics.length > 0
        ? Math.max(...queueMetrics.map((m) => m.value))
        : 0;

    // Calculate system health score
    const healthScore = this.calculateHealthScore(
      currentErrorRate,
      latency.p95,
      currentQueueDepth,
    );

    return {
      errorRate: {
        current: currentErrorRate,
        p95: this.percentile(
          errorMetrics.map((m) => m.value),
          0.95,
        ),
        trend: this.calculateTrend(errorMetrics.map((m) => m.value)),
      },
      latency,
      throughput: {
        requestsPerMinute,
        successfulRequests: successCount,
        failedRequests: errorCount,
      },
      queueDepth: {
        current: currentQueueDepth,
        max: maxQueueDepth,
        processing: 0, // Would need actual queue implementation
      },
      systemHealth: {
        score: healthScore,
        status:
          healthScore > 90
            ? 'healthy'
            : healthScore > 70
              ? 'degraded'
              : 'critical',
        uptime: this.calculateUptime(),
      },
    };
  }

  // Check for anomalies and create alerts
  private async checkAnomalies(metric: HealthMetric): Promise<void> {
    let alertCreated = false;

    // Error rate spike detection
    if (metric.metricType === 'error_rate') {
      const recentErrorRate = this.calculateRecentErrorRate();
      if (recentErrorRate > this.thresholds.errorRate.critical) {
        await this.createAlert(
          'error_spike',
          'critical',
          `Critical error rate: ${(recentErrorRate * 100).toFixed(2)}%`,
          { errorRate: recentErrorRate, endpoint: metric.endpoint },
        );
        alertCreated = true;
      } else if (recentErrorRate > this.thresholds.errorRate.warning) {
        await this.createAlert(
          'error_spike',
          'high',
          `High error rate: ${(recentErrorRate * 100).toFixed(2)}%`,
          { errorRate: recentErrorRate, endpoint: metric.endpoint },
        );
        alertCreated = true;
      }
    }

    // High latency detection
    if (
      metric.metricType === 'latency' &&
      metric.value > this.thresholds.latencyP95.critical
    ) {
      await this.createAlert(
        'high_latency',
        'critical',
        `Critical latency: ${metric.value}ms on ${metric.endpoint}`,
        { latency: metric.value, endpoint: metric.endpoint },
      );
      alertCreated = true;
    } else if (
      metric.metricType === 'latency' &&
      metric.value > this.thresholds.latencyP95.warning
    ) {
      await this.createAlert(
        'high_latency',
        'medium',
        `High latency: ${metric.value}ms on ${metric.endpoint}`,
        { latency: metric.value, endpoint: metric.endpoint },
      );
      alertCreated = true;
    }

    // Queue overflow detection
    if (
      metric.metricType === 'queue_depth' &&
      metric.value > this.thresholds.queueDepth.critical
    ) {
      await this.createAlert(
        'queue_overflow',
        'critical',
        `Queue overflow: ${metric.value} items`,
        { queueDepth: metric.value, queue: metric.metadata?.queueName },
      );
      alertCreated = true;
    }

    // Send alert notification if created
    if (alertCreated) {
      await this.sendAlertNotification(this.alerts[this.alerts.length - 1]);
    }
  }

  // Create an alert
  private async createAlert(
    type: Alert['type'],
    severity: Alert['severity'],
    message: string,
    metadata: Record<string, any>,
  ): Promise<void> {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      severity,
      message,
      timestamp: Date.now(),
      resolved: false,
      metadata,
    };

    this.alerts.push(alert);

    // Store in Firebase
    try {
      const db = await getDb();
      await addDoc(collection(db, 'operational_alerts'), {
        ...alert,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to store alert:', error);
    }
  }

  // Send alert notification
  private async sendAlertNotification(alert: Alert): Promise<void> {
    // Send to Slack if configured
    if (process.env.SLACK_WEBHOOK_URL) {
      await this.sendSlackAlert(alert);
    }

    // Send to webhook if configured
    if (process.env.ALERT_WEBHOOK_URL) {
      await this.sendWebhookAlert(alert);
    }

    // Log to console as fallback
    console.error(
      `🚨 OPERATIONAL ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`,
      alert.metadata,
    );
  }

  // Send Slack notification
  private async sendSlackAlert(alert: Alert): Promise<void> {
    try {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL;
      if (!webhookUrl) return;

      const color = {
        low: '#36a64f',
        medium: '#ff9900',
        high: '#ff6600',
        critical: '#cc0000',
      }[alert.severity];

      const payload = {
        channel: process.env.SLACK_ALERT_CHANNEL || '#alerts',
        username: '123LegalDoc Monitor',
        icon_emoji: ':warning:',
        attachments: [
          {
            color,
            title: `${alert.severity.toUpperCase()} Alert: ${alert.type.replace('_', ' ')}`,
            text: alert.message,
            fields: [
              {
                title: 'Severity',
                value: alert.severity,
                short: true,
              },
              {
                title: 'Timestamp',
                value: new Date(alert.timestamp).toISOString(),
                short: true,
              },
            ],
            footer: '123LegalDoc Operational Health',
            ts: Math.floor(alert.timestamp / 1000),
          },
        ],
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Failed to send Slack alert:', error);
    }
  }

  // Send webhook notification
  private async sendWebhookAlert(alert: Alert): Promise<void> {
    try {
      const webhookUrl = process.env.ALERT_WEBHOOK_URL;
      if (!webhookUrl) return;

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert_id: alert.id,
          type: alert.type,
          severity: alert.severity,
          message: alert.message,
          timestamp: alert.timestamp,
          metadata: alert.metadata,
          service: '123LegalDoc',
        }),
      });
    } catch (error) {
      console.error('Failed to send webhook alert:', error);
    }
  }

  // Utility methods
  private percentile(arr: number[], p: number): number {
    if (arr.length === 0) return 0;
    const index = Math.ceil(arr.length * p) - 1;
    return arr[Math.max(0, index)] || 0;
  }

  private calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
    if (values.length < 2) return 'stable';
    const recent = values.slice(-10);
    const older = values.slice(-20, -10);

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg =
      older.length > 0
        ? older.reduce((a, b) => a + b, 0) / older.length
        : recentAvg;

    const change = (recentAvg - olderAvg) / olderAvg;

    if (change > 0.1) return 'up';
    if (change < -0.1) return 'down';
    return 'stable';
  }

  private calculateRecentErrorRate(): number {
    const recentMetrics = this.metrics.filter(
      (m) =>
        m.timestamp > Date.now() - 5 * 60 * 1000 && // Last 5 minutes
        (m.metricType === 'error_rate' || m.metricType === 'success_rate'),
    );

    if (recentMetrics.length === 0) return 0;

    const errors = recentMetrics
      .filter((m) => m.metricType === 'error_rate')
      .reduce((sum, m) => sum + m.value, 0);
    return errors / recentMetrics.length;
  }

  private calculateHealthScore(
    errorRate: number,
    latency: number,
    queueDepth: number,
  ): number {
    let score = 100;

    // Deduct for error rate
    score -= errorRate * 500; // 10% error rate = -50 points

    // Deduct for high latency
    if (latency > 1000) score -= Math.min(30, (latency - 1000) / 100);

    // Deduct for queue depth
    if (queueDepth > 50) score -= Math.min(20, (queueDepth - 50) / 10);

    return Math.max(0, Math.min(100, score));
  }

  private calculateUptime(): number {
    // Simple uptime calculation - would need startup time tracking
    return 99.9; // Placeholder
  }

  private startMetricsCollection(): void {
    // Collect system metrics every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);
  }

  private collectSystemMetrics(): void {
    // Collect memory usage (if available)
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memory = process.memoryUsage();
      this.recordMetric({
        metricType: 'memory_usage',
        value: memory.heapUsed / memory.heapTotal,
        metadata: { heapUsed: memory.heapUsed, heapTotal: memory.heapTotal },
      });
    }

    // Collect CPU usage (simplified)
    if (typeof performance !== 'undefined') {
      this.recordMetric({
        metricType: 'cpu_usage',
        value: Math.random() * 100, // Placeholder - would need actual CPU monitoring
        metadata: { timestamp: performance.now() },
      });
    }
  }

  // Get active alerts
  getActiveAlerts(): Alert[] {
    return this.alerts.filter((alert) => !alert.resolved);
  }

  // Resolve an alert
  async resolveAlert(alertId: string): Promise<void> {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.resolved = true;

      // Update in Firebase
      try {
        const db = await getDb();
        const alertsQuery = query(
          collection(db, 'operational_alerts'),
          where('id', '==', alertId),
        );
        const snapshot = await getDocs(alertsQuery);

        if (!snapshot.empty) {
          // Would update the document here
        }
      } catch (error) {
        console.error('Failed to resolve alert in database:', error);
      }
    }
  }
}

// Express/Next.js middleware for automatic monitoring
export function createMonitoringMiddleware() {
  const monitor = OperationalHealthMonitor.getInstance();

  return async (req: any, res: any, next: any) => {
    const startTime = Date.now();
    const originalSend = res.send;

    res.send = function (data: any) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const success = res.statusCode < 400;

      // Record metrics
      monitor.recordLatency(req.path || req.url, duration, success);

      return originalSend.call(this, data);
    };

    next();
  };
}

// Export singleton instance
export const operationalHealth = OperationalHealthMonitor.getInstance();
