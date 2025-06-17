#!/usr/bin/env node

/**
 * Document System Health Monitoring Dashboard
 * Generates real-time status reports and health metrics
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

class DocumentSystemMonitor {
  constructor() {
    this.metricsHistory = [];
    this.alerts = [];
    this.config = {
      port: 3001,
      refreshInterval: 60000, // 1 minute
      historyRetention: 24 * 60, // 24 hours worth of minutes
      thresholds: {
        qualityScore: 85,
        errorCount: 5,
        warningCount: 20,
        documentCount: 45
      }
    };
  }

  async collectMetrics() {
    const timestamp = new Date().toISOString();
    
    try {
      // Run quality verification
      const { execSync } = require('child_process');
      const result = execSync('node scripts/quality-verification-system.js', {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8',
        stdio: 'pipe'
      });

      // Find latest quality report
      const reportDir = path.join(__dirname, '../quality-reports');
      if (!fs.existsSync(reportDir)) {
        throw new Error('Quality reports directory not found');
      }

      const reports = fs.readdirSync(reportDir)
        .filter(f => f.endsWith('.json'))
        .map(f => ({
          name: f,
          path: path.join(reportDir, f),
          mtime: fs.statSync(path.join(reportDir, f)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);

      if (reports.length === 0) {
        throw new Error('No quality reports found');
      }

      const latestReport = JSON.parse(fs.readFileSync(reports[0].path, 'utf8'));
      
      const metrics = {
        timestamp,
        qualityScore: latestReport.score || 0,
        totalDocuments: latestReport.summary?.totalDocuments || 0,
        passedChecks: latestReport.summary?.passedChecks || 0,
        failedChecks: latestReport.summary?.failedChecks || 0,
        warningChecks: latestReport.summary?.warningChecks || 0,
        errors: latestReport.errors || [],
        warnings: latestReport.warnings || [],
        systemHealth: this.calculateSystemHealth(latestReport),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      };

      // Add to history
      this.metricsHistory.push(metrics);
      
      // Trim history to retention period
      while (this.metricsHistory.length > this.config.historyRetention) {
        this.metricsHistory.shift();
      }

      // Check for alerts
      this.checkAlerts(metrics);

      return metrics;
      
    } catch (error) {
      const errorMetrics = {
        timestamp,
        error: error.message,
        systemHealth: 'critical',
        qualityScore: 0,
        totalDocuments: 0,
        passedChecks: 0,
        failedChecks: 1,
        warningChecks: 0,
        errors: [{ check: 'System', message: error.message }],
        warnings: [],
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      };

      this.metricsHistory.push(errorMetrics);
      return errorMetrics;
    }
  }

  calculateSystemHealth(report) {
    const score = report.score || 0;
    const errors = report.summary?.failedChecks || 0;
    
    if (errors > 0) return 'critical';
    if (score < this.config.thresholds.qualityScore) return 'warning';
    if (score >= 95) return 'excellent';
    return 'good';
  }

  checkAlerts(metrics) {
    const now = Date.now();
    
    // Quality score alert
    if (metrics.qualityScore < this.config.thresholds.qualityScore) {
      this.addAlert('quality_score', `Quality score dropped to ${metrics.qualityScore}`, 'warning');
    }

    // Error count alert
    if (metrics.failedChecks > this.config.thresholds.errorCount) {
      this.addAlert('error_count', `High error count: ${metrics.failedChecks} errors`, 'critical');
    }

    // Document count alert
    if (metrics.totalDocuments < this.config.thresholds.documentCount) {
      this.addAlert('document_count', `Document count below threshold: ${metrics.totalDocuments}`, 'warning');
    }

    // System error alert
    if (metrics.error) {
      this.addAlert('system_error', metrics.error, 'critical');
    }

    // Clean old alerts (older than 1 hour)
    this.alerts = this.alerts.filter(alert => now - alert.timestamp < 60 * 60 * 1000);
  }

  addAlert(type, message, severity) {
    const existingAlert = this.alerts.find(a => a.type === type && a.message === message);
    if (!existingAlert) {
      this.alerts.push({
        type,
        message,
        severity,
        timestamp: Date.now(),
        count: 1
      });
    } else {
      existingAlert.count++;
      existingAlert.timestamp = Date.now();
    }
  }

  generateDashboardHTML() {
    const latestMetrics = this.metricsHistory[this.metricsHistory.length - 1] || {};
    const healthColor = {
      excellent: '#10b981',
      good: '#3b82f6',
      warning: '#f59e0b',
      critical: '#ef4444'
    }[latestMetrics.systemHealth] || '#6b7280';

    const chartData = this.metricsHistory.slice(-60); // Last hour
    const scoreData = chartData.map(m => m.qualityScore || 0);
    const errorData = chartData.map(m => m.failedChecks || 0);
    const warningData = chartData.map(m => m.warningChecks || 0);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document System Health Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }
        .header {
            background: white;
            padding: 1rem 2rem;
            border-bottom: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .card {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .metric-card {
            text-align: center;
            padding: 2rem;
        }
        .metric-value {
            font-size: 3rem;
            font-weight: bold;
            color: ${healthColor};
        }
        .metric-label {
            font-size: 0.875rem;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${healthColor};
            margin-right: 0.5rem;
        }
        .alert {
            padding: 0.75rem 1rem;
            border-radius: 6px;
            margin-bottom: 0.5rem;
        }
        .alert-critical { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .alert-warning { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .chart-container { height: 300px; margin-top: 1rem; }
        .refresh-info {
            position: fixed;
            top: 1rem;
            right: 1rem;
            background: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            font-size: 0.875rem;
            color: #64748b;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        .stat-item {
            text-align: center;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 6px;
        }
        .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
        }
        .stat-label {
            font-size: 0.75rem;
            color: #64748b;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 Document System Health Dashboard</h1>
        <p>Real-time monitoring of your legal document system</p>
    </div>

    <div class="refresh-info">
        Auto-refresh every ${this.config.refreshInterval / 1000}s
    </div>

    <div class="container">
        <div class="grid">
            <!-- System Health Overview -->
            <div class="card metric-card">
                <div class="metric-value">${latestMetrics.qualityScore || 0}/100</div>
                <div class="metric-label">
                    <span class="status-indicator"></span>
                    Quality Score (${latestMetrics.systemHealth || 'unknown'})
                </div>
            </div>

            <!-- Document Count -->
            <div class="card metric-card">
                <div class="metric-value">${latestMetrics.totalDocuments || 0}</div>
                <div class="metric-label">Total Documents</div>
            </div>

            <!-- Error Count -->
            <div class="card metric-card">
                <div class="metric-value" style="color: ${latestMetrics.failedChecks > 0 ? '#ef4444' : '#10b981'}">${latestMetrics.failedChecks || 0}</div>
                <div class="metric-label">Active Errors</div>
            </div>

            <!-- Warning Count -->
            <div class="card metric-card">
                <div class="metric-value" style="color: ${latestMetrics.warningChecks > 10 ? '#f59e0b' : '#10b981'}">${latestMetrics.warningChecks || 0}</div>
                <div class="metric-label">Warnings</div>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="card" style="margin-top: 1.5rem;">
            <h3>📊 System Statistics</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${latestMetrics.passedChecks || 0}</div>
                    <div class="stat-label">Passed Checks</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round((latestMetrics.uptime || 0) / 60)}m</div>
                    <div class="stat-label">Monitor Uptime</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round(((latestMetrics.memoryUsage?.heapUsed || 0) / 1024 / 1024) * 10) / 10}MB</div>
                    <div class="stat-label">Memory Usage</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${latestMetrics.nodeVersion || 'N/A'}</div>
                    <div class="stat-label">Node Version</div>
                </div>
            </div>
        </div>

        <div class="grid" style="margin-top: 1.5rem;">
            <!-- Quality Score Chart -->
            <div class="card">
                <h3>📈 Quality Score Trend</h3>
                <div class="chart-container">
                    <canvas id="qualityChart"></canvas>
                </div>
            </div>

            <!-- Issues Chart -->
            <div class="card">
                <h3>🚨 Issues Over Time</h3>
                <div class="chart-container">
                    <canvas id="issuesChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Active Alerts -->
        ${this.alerts.length > 0 ? `
        <div class="card" style="margin-top: 1.5rem;">
            <h3>🚨 Active Alerts</h3>
            ${this.alerts.map(alert => `
                <div class="alert alert-${alert.severity}">
                    <strong>${alert.type.replace('_', ' ').toUpperCase()}:</strong> ${alert.message}
                    ${alert.count > 1 ? ` (${alert.count} times)` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Recent Issues -->
        ${latestMetrics.errors && latestMetrics.errors.length > 0 ? `
        <div class="card" style="margin-top: 1.5rem;">
            <h3>❌ Recent Errors</h3>
            ${latestMetrics.errors.slice(0, 5).map(error => `
                <div class="alert alert-critical">
                    <strong>${error.check}:</strong> ${error.message}
                    ${error.file ? ` (${error.file})` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
    </div>

    <script>
        // Quality Score Chart
        const qualityCtx = document.getElementById('qualityChart').getContext('2d');
        new Chart(qualityCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: ${scoreData.length}}, (_, i) => \`\${i + 1}m ago\`).reverse(),
                datasets: [{
                    label: 'Quality Score',
                    data: [${scoreData.join(',')}],
                    borderColor: '${healthColor}',
                    backgroundColor: '${healthColor}20',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Issues Chart
        const issuesCtx = document.getElementById('issuesChart').getContext('2d');
        new Chart(issuesCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: ${errorData.length}}, (_, i) => \`\${i + 1}m ago\`).reverse(),
                datasets: [{
                    label: 'Errors',
                    data: [${errorData.join(',')}],
                    borderColor: '#ef4444',
                    backgroundColor: '#ef444420',
                    tension: 0.4
                }, {
                    label: 'Warnings',
                    data: [${warningData.join(',')}],
                    borderColor: '#f59e0b',
                    backgroundColor: '#f59e0b20',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Auto-refresh
        setTimeout(() => {
            window.location.reload();
        }, ${this.config.refreshInterval});
    </script>
</body>
</html>`;
  }

  startServer() {
    const server = http.createServer(async (req, res) => {
      const parsedUrl = url.parse(req.url, true);
      
      if (parsedUrl.pathname === '/') {
        // Serve dashboard
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(this.generateDashboardHTML());
      } else if (parsedUrl.pathname === '/api/metrics') {
        // Serve JSON metrics
        const metrics = await this.collectMetrics();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(metrics, null, 2));
      } else if (parsedUrl.pathname === '/api/health') {
        // Health check endpoint
        const metrics = this.metricsHistory[this.metricsHistory.length - 1] || {};
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: metrics.systemHealth || 'unknown',
          score: metrics.qualityScore || 0,
          errors: metrics.failedChecks || 0,
          warnings: metrics.warningChecks || 0,
          timestamp: metrics.timestamp || new Date().toISOString()
        }));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    server.listen(this.config.port, () => {
      console.log(`🏥 Document System Monitor running on http://localhost:${this.config.port}`);
      console.log(`📊 API endpoint: http://localhost:${this.config.port}/api/metrics`);
      console.log(`🏥 Health check: http://localhost:${this.config.port}/api/health`);
    });

    // Start collecting metrics
    setInterval(() => {
      this.collectMetrics().catch(console.error);
    }, this.config.refreshInterval);

    // Initial metrics collection
    this.collectMetrics().catch(console.error);

    return server;
  }
}

// CLI execution
if (require.main === module) {
  const monitor = new DocumentSystemMonitor();
  monitor.startServer();
}

module.exports = DocumentSystemMonitor;