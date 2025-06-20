# Operational Health Monitoring Setup

## Overview

Your 123LegalDoc platform now includes enterprise-grade operational health monitoring with:

- **Real-time metrics**: Error rates, P95 latency, queue depth, throughput
- **Instant alerts**: Slack, webhook, and email notifications  
- **Anomaly detection**: Automatic threshold monitoring
- **Compliance dashboards**: Admin and user-facing interfaces
- **Immutable audit trail**: Cryptographically secure event logging

## 🚀 Quick Start

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
# Operational Health Monitoring
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
SLACK_ALERT_CHANNEL=#alerts
ALERT_WEBHOOK_URL=https://your-webhook-endpoint.com/alerts

# Sentry Error Tracking (currently disabled)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-auth-token

# Admin Access Control
ADMIN_EMAIL_DOMAIN=@123legaldoc.com
```

### 2. Slack Integration Setup

1. **Create Slack App**:
   - Go to https://api.slack.com/apps
   - Create new app for your workspace
   - Enable "Incoming Webhooks"
   - Create webhook for your alerts channel

2. **Configure Webhook**:
   ```bash
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
   SLACK_ALERT_CHANNEL=#operational-alerts
   ```

3. **Test Integration**:
   - Visit `/admin/operational-health`
   - Click "Test Alert" button
   - Check your Slack channel for notification

### 3. Admin Access Setup

Grant admin access by adding your email domain:

```typescript
// In operational health components, admin check:
const isAdmin = user.email?.endsWith('@123legaldoc.com') || user.uid === 'admin-user-id';
```

## 📊 Features

### Real-Time Metrics Dashboard

Access at `/admin/operational-health`:

- **Error Rate**: Current rate, P95, trending
- **Latency**: P50, P95, P99 response times  
- **Throughput**: Requests per minute, success/failure rates
- **Queue Depth**: Current processing queue status
- **System Health Score**: 0-100 overall health rating

### Automatic Alerting

**Alert Triggers**:
- Error rate > 5% (warning) / 10% (critical)
- P95 latency > 2s (warning) / 5s (critical) 
- Queue depth > 100 (warning) / 500 (critical)

**Notification Channels**:
- Slack messages with severity colors
- Webhook POST requests with full alert data
- Console logging (fallback)

### User Data Export (GDPR/CCPA)

Users can export their data at `/dashboard/data-export`:

- Personal audit trail
- Document history
- Account information
- GDPR-compliant JSON/CSV formats

## 🔧 Integration Guide

### Monitor New API Routes

Wrap any API route with health monitoring:

```typescript
import { withHealthMonitoring } from '@/middleware/health-monitoring';

export const POST = withHealthMonitoring(async (request: NextRequest) => {
  // Your API logic here
  return NextResponse.json({ success: true });
});
```

### Custom Metrics

Record custom metrics:

```typescript
import { operationalHealth } from '@/lib/operational-health';

// Record custom latency
await operationalHealth.recordLatency('/api/custom', duration, success);

// Record queue operations  
await operationalHealth.recordQueueOperation('email_queue', 'enqueue', queueSize);

// Record custom metrics
await operationalHealth.recordMetric({
  metricType: 'custom_metric',
  value: someValue,
  endpoint: '/api/endpoint',
  metadata: { customData: 'value' }
});
```

### Component Error Tracking

Track React component errors:

```typescript
import { withErrorTracking } from '@/middleware/health-monitoring';

const MyComponent = withErrorTracking(() => {
  // Component logic
  return <div>Component content</div>;
}, 'MyComponent');
```

## 🎯 Monitoring Thresholds

### Default Thresholds

```typescript
const thresholds = {
  errorRate: { warning: 0.05, critical: 0.10 },     // 5%, 10%
  latencyP95: { warning: 2000, critical: 5000 },    // 2s, 5s
  queueDepth: { warning: 100, critical: 500 },      // 100, 500 items
  memoryUsage: { warning: 0.80, critical: 0.95 }    // 80%, 95%
};
```

### Customizing Thresholds

Update thresholds in `/src/lib/operational-health.ts`:

```typescript
private thresholds = {
  errorRate: { warning: 0.03, critical: 0.08 },  // More aggressive
  latencyP95: { warning: 1500, critical: 3000 }, // Stricter latency
  // ... other thresholds
};
```

## 📈 Dashboards

### Admin Dashboard (`/admin/operational-health`)

- Real-time system metrics
- Active alerts management  
- Performance trends
- Alert resolution workflow

### User Dashboard (`/dashboard/audit-trail`)

- Personal activity audit trail
- Data export functionality
- Privacy-compliant event history

### Compliance Reports (`/dashboard/compliance-reports`)

- GDPR compliance status
- SOC 2 audit preparation
- Downloadable compliance reports

## 🔐 Security & Privacy

### Data Protection

- **Immutable audit events**: Cryptographically protected
- **User data isolation**: Users only see their own data
- **Admin access controls**: Role-based permissions
- **7-year retention**: Compliance-ready data retention

### Firestore Security Rules

```javascript
// Operational metrics - admin read-only
match /operational_metrics/{metricId} {
  allow create: if request.auth != null;
  allow read: if request.auth != null && request.auth.token.admin == true;
  allow update, delete: if false; // Immutable
}

// Alerts - admin manage
match /operational_alerts/{alertId} {
  allow create: if request.auth != null;
  allow read, update: if request.auth != null && request.auth.token.admin == true;
  allow delete: if false; // Preserve history
}
```

## 🚨 Alert Configuration

### Slack Alert Format

```json
{
  "channel": "#alerts",
  "username": "123LegalDoc Monitor",
  "icon_emoji": ":warning:",
  "attachments": [{
    "color": "#cc0000",
    "title": "CRITICAL Alert: High Error Rate",
    "text": "Error rate exceeded 10% threshold",
    "fields": [
      { "title": "Severity", "value": "critical", "short": true },
      { "title": "Endpoint", "value": "/api/generate-pdf", "short": true }
    ]
  }]
}
```

### Webhook Alert Format

```json
{
  "alert_id": "alert_1234567890_abc123",
  "type": "error_spike", 
  "severity": "critical",
  "message": "Critical error rate: 12.5%",
  "timestamp": 1640995200000,
  "metadata": {
    "errorRate": 0.125,
    "endpoint": "/api/generate-pdf"
  },
  "service": "123LegalDoc"
}
```

## 🔄 Maintenance

### Regular Tasks

1. **Weekly**: Review alert thresholds and adjust based on usage patterns
2. **Monthly**: Analyze performance trends and capacity planning
3. **Quarterly**: Export compliance reports for audit preparation

### Health Checks

Access health status:
- **Public**: `/api/health/metrics?public=true` (basic status)
- **Admin**: `/api/health/metrics` (detailed metrics)

### Troubleshooting

**Common Issues**:

1. **No metrics appearing**:
   - Check Firebase authentication
   - Verify Firestore rules deployment
   - Ensure admin privileges

2. **Alerts not firing**:
   - Test with `/admin/operational-health` "Test Alert" button
   - Check Slack webhook URL validity
   - Verify environment variables

3. **Permission errors**:
   - Confirm admin email domain configuration
   - Check Firebase Auth custom claims

## 📞 Support

For operational health monitoring support:

- **Documentation**: This file and inline code comments
- **Testing**: Use "Test Alert" functionality in admin dashboard
- **Monitoring**: Check `/admin/operational-health` dashboard
- **Logs**: Console logs available in development mode

## 🎯 Next Steps

1. **Configure Slack/webhook URLs** in environment variables
2. **Test alert system** using admin dashboard
3. **Set up monitoring schedule** for regular health checks
4. **Enable Sentry** for enhanced error tracking (currently disabled)
5. **Customize thresholds** based on your traffic patterns