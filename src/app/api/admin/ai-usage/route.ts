// AI Usage & Cost Analytics API
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { aiUsageAnalytics, type AIModel, type AIEndpoint } from '@/lib/ai-usage-analytics';

export async function GET(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'overview';
    const timeframe = url.searchParams.get('timeframe') || '30d';
    const model = url.searchParams.get('model') as AIModel;
    const endpoint = url.searchParams.get('endpoint') as AIEndpoint;

    switch (type) {
      case 'overview':
        const analytics = aiUsageAnalytics.generateUsageAnalytics(timeframe);
        return NextResponse.json({
          success: true,
          data: {
            overview: analytics.overview,
            budgetTracking: analytics.budgetTracking,
            topModels: analytics.modelBreakdown.slice(0, 5),
            topEndpoints: analytics.endpointAnalysis.slice(0, 5),
            criticalAlerts: getCriticalAlerts(analytics)
          }
        });

      case 'model_analysis':
        const modelAnalytics = aiUsageAnalytics.generateUsageAnalytics(timeframe);
        return NextResponse.json({
          success: true,
          data: {
            modelBreakdown: modelAnalytics.modelBreakdown,
            modelComparison: aiUsageAnalytics.getModelPerformanceComparison(endpoint),
            modelTrends: modelAnalytics.trends.modelTrends
          }
        });

      case 'endpoint_analysis':
        const endpointAnalytics = aiUsageAnalytics.generateUsageAnalytics(timeframe);
        return NextResponse.json({
          success: true,
          data: {
            endpointAnalysis: endpointAnalytics.endpointAnalysis,
            endpointComparison: getEndpointComparison(endpointAnalytics, model)
          }
        });

      case 'cost_optimization':
        const optimizationData = aiUsageAnalytics.generateUsageAnalytics(timeframe);
        return NextResponse.json({
          success: true,
          data: {
            costSavingOpportunities: optimizationData.optimization.costSavingOpportunities,
            modelRecommendations: optimizationData.optimization.modelRecommendations,
            promptOptimizations: optimizationData.optimization.promptOptimizations,
            totalPotentialSaving: optimizationData.optimization.costSavingOpportunities
              .reduce((sum, opp) => sum + opp.potentialSaving, 0)
          }
        });

      case 'budget_monitoring':
        const budgetData = aiUsageAnalytics.generateUsageAnalytics(timeframe);
        return NextResponse.json({
          success: true,
          data: {
            budgetTracking: budgetData.budgetTracking,
            dailyCosts: budgetData.trends.dailyCosts,
            spendingPatterns: getSpendingPatterns(budgetData),
            forecastData: generateCostForecast(budgetData.trends.dailyCosts)
          }
        });

      case 'performance_metrics':
        const performanceData = aiUsageAnalytics.generateUsageAnalytics(timeframe);
        return NextResponse.json({
          success: true,
          data: {
            latencyTrends: performanceData.trends.latencyTrends,
            qualityTrends: performanceData.trends.qualityTrends,
            modelPerformance: aiUsageAnalytics.getModelPerformanceComparison(),
            performanceAlerts: getPerformanceAlerts(performanceData)
          }
        });

      case 'realtime_status':
        const realtimeData = await getRealtimeAIStatus();
        return NextResponse.json({
          success: true,
          data: realtimeData
        });

      case 'usage_details':
        const detailsData = await getUsageDetails(timeframe, model, endpoint);
        return NextResponse.json({
          success: true,
          data: detailsData
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('AI usage analytics API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve AI usage analytics'
    }, { status: 500 });
  }
}

// Track new AI usage
export async function POST(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const body = await request.json();
    const {
      model,
      endpoint,
      promptTokens,
      completionTokens,
      latencyMs,
      success,
      metadata
    } = body;

    if (!model || !endpoint || promptTokens === undefined || completionTokens === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: model, endpoint, promptTokens, completionTokens'
      }, { status: 400 });
    }

    const metricId = await aiUsageAnalytics.trackAIUsage(
      model,
      endpoint,
      promptTokens,
      completionTokens,
      latencyMs || 0,
      success !== false,
      metadata || {}
    );

    return NextResponse.json({
      success: true,
      data: {
        metricId,
        tracked: true
      }
    });

  } catch (error) {
    console.error('AI usage tracking error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to track AI usage'
    }, { status: 500 });
  }
}

// Batch AI usage tracking
export async function PUT(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const body = await request.json();
    const { usageRecords } = body;

    if (!Array.isArray(usageRecords)) {
      return NextResponse.json({
        success: false,
        error: 'usageRecords must be an array'
      }, { status: 400 });
    }

    const results = [];
    for (const record of usageRecords) {
      try {
        const metricId = await aiUsageAnalytics.trackAIUsage(
          record.model,
          record.endpoint,
          record.promptTokens,
          record.completionTokens,
          record.latencyMs || 0,
          record.success !== false,
          record.metadata || {}
        );
        results.push({ success: true, metricId });
      } catch (error) {
        results.push({ 
          success: false, 
          error: (error as Error).message,
          record: record
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      data: {
        total: usageRecords.length,
        successful,
        failed,
        results
      }
    });

  } catch (error) {
    console.error('Batch AI usage tracking error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to track batch AI usage'
    }, { status: 500 });
  }
}

// Helper functions
function getCriticalAlerts(analytics: any) {
  const alerts = [];

  // Budget alerts
  if (analytics.budgetTracking.budgetUtilization > 95) {
    alerts.push({
      type: 'budget_critical',
      severity: 'critical',
      message: 'AI spending has exceeded 95% of monthly budget',
      value: analytics.budgetTracking.currentSpend,
      threshold: analytics.budgetTracking.alertThresholds.critical
    });
  } else if (analytics.budgetTracking.budgetUtilization > 80) {
    alerts.push({
      type: 'budget_warning',
      severity: 'warning',
      message: 'AI spending has exceeded 80% of monthly budget',
      value: analytics.budgetTracking.currentSpend,
      threshold: analytics.budgetTracking.alertThresholds.warning
    });
  }

  // High cost models
  const expensiveModels = analytics.modelBreakdown.filter((m: any) => m.cost > 50);
  if (expensiveModels.length > 0) {
    alerts.push({
      type: 'expensive_models',
      severity: 'info',
      message: `${expensiveModels.length} models have high monthly costs`,
      models: expensiveModels.map((m: any) => m.model)
    });
  }

  // Low success rates
  const lowSuccessModels = analytics.modelBreakdown.filter((m: any) => m.successRate < 90);
  if (lowSuccessModels.length > 0) {
    alerts.push({
      type: 'low_success_rate',
      severity: 'warning',
      message: `${lowSuccessModels.length} models have success rates below 90%`,
      models: lowSuccessModels.map((m: any) => ({ model: m.model, rate: m.successRate }))
    });
  }

  return alerts;
}

function getEndpointComparison(analytics: any, model?: AIModel) {
  let comparison = analytics.endpointAnalysis;
  
  if (model) {
    // Filter data for specific model (this would need to be implemented in the analytics engine)
    comparison = comparison.map((endpoint: any) => ({
      ...endpoint,
      modelSpecific: true,
      filterModel: model
    }));
  }

  return comparison;
}

function getSpendingPatterns(analytics: any) {
  const dailyCosts = analytics.trends.dailyCosts;
  if (dailyCosts.length === 0) return {};

  // Calculate spending patterns
  const totalCost = dailyCosts.reduce((sum: number, day: any) => sum + day.cost, 0);
  const avgDailyCost = totalCost / dailyCosts.length;
  
  // Find peak spending days
  const peakDays = dailyCosts
    .filter((day: any) => day.cost > avgDailyCost * 1.5)
    .sort((a: any, b: any) => b.cost - a.cost)
    .slice(0, 5);

  // Identify spending trends
  const recentDays = dailyCosts.slice(-7);
  const olderDays = dailyCosts.slice(-14, -7);
  const recentAvg = recentDays.reduce((sum: number, day: any) => sum + day.cost, 0) / recentDays.length;
  const olderAvg = olderDays.reduce((sum: number, day: any) => sum + day.cost, 0) / olderDays.length;
  const trend = recentAvg > olderAvg ? 'increasing' : 'decreasing';
  const trendPercentage = Math.abs((recentAvg - olderAvg) / olderAvg * 100);

  return {
    avgDailyCost,
    peakDays,
    trend,
    trendPercentage,
    totalCost,
    daysWithData: dailyCosts.length
  };
}

function generateCostForecast(dailyCosts: any[]) {
  if (dailyCosts.length < 7) return { forecast: [], confidence: 'low' };

  // Simple linear regression for cost forecasting
  const recent = dailyCosts.slice(-7);
  const avgCost = recent.reduce((sum, day) => sum + day.cost, 0) / recent.length;
  
  // Generate 7-day forecast
  const forecast = [];
  const baseDate = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const forecastDate = new Date(baseDate);
    forecastDate.setDate(baseDate.getDate() + i);
    
    // Simple trend continuation with some randomness
    const trendFactor = 1 + (Math.random() - 0.5) * 0.2; // ±10% variation
    const predictedCost = avgCost * trendFactor;
    
    forecast.push({
      date: forecastDate.toISOString().split('T')[0],
      predictedCost,
      confidence: i <= 3 ? 'high' : i <= 5 ? 'medium' : 'low'
    });
  }

  return {
    forecast,
    confidence: 'medium',
    baseAvg: avgCost
  };
}

function getPerformanceAlerts(analytics: any) {
  const alerts = [];

  // High latency alerts
  const recentLatency = analytics.trends.latencyTrends.slice(-7);
  if (recentLatency.length > 0) {
    const avgLatency = recentLatency.reduce((sum: number, day: any) => sum + day.avgLatency, 0) / recentLatency.length;
    if (avgLatency > 5000) { // > 5 seconds
      alerts.push({
        type: 'high_latency',
        severity: 'warning',
        message: 'Average AI response latency exceeds 5 seconds',
        value: avgLatency,
        threshold: 5000
      });
    }
  }

  // Quality degradation
  const recentQuality = analytics.trends.qualityTrends.slice(-7);
  if (recentQuality.length > 0) {
    const avgQuality = recentQuality.reduce((sum: number, day: any) => sum + day.avgQuality, 0) / recentQuality.length;
    if (avgQuality < 70) { // Quality score below 70
      alerts.push({
        type: 'quality_degradation',
        severity: 'warning',
        message: 'AI output quality has degraded below 70%',
        value: avgQuality,
        threshold: 70
      });
    }
  }

  return alerts;
}

async function getRealtimeAIStatus() {
  // In production, this would fetch real-time data from Redis or similar
  return {
    activeRequests: 12,
    avgLatency: 1840, // ms
    requestsPerMinute: 45,
    errorRate: 2.3, // %
    topModels: [
      { model: 'gpt-3.5-turbo', usage: 60 },
      { model: 'gpt-4', usage: 25 },
      { model: 'claude-3-haiku', usage: 15 }
    ],
    recentErrors: [
      {
        timestamp: new Date(Date.now() - 300000).toISOString(),
        model: 'gpt-4',
        endpoint: 'document_generation',
        error: 'Rate limit exceeded'
      },
      {
        timestamp: new Date(Date.now() - 600000).toISOString(),
        model: 'claude-3-opus',
        endpoint: 'legal_review',
        error: 'Context length exceeded'
      }
    ],
    costPerHour: 12.45,
    estimatedMonthlyCost: 8967.20
  };
}

async function getUsageDetails(timeframe: string, model?: AIModel, endpoint?: AIEndpoint) {
  // In production, this would fetch detailed usage records from database
  return {
    totalRecords: 1247,
    records: generateMockUsageRecords(50, model, endpoint),
    aggregations: {
      byHour: generateHourlyAggregations(),
      byModel: generateModelAggregations(),
      byEndpoint: generateEndpointAggregations()
    },
    pagination: {
      page: 1,
      limit: 50,
      total: 1247,
      totalPages: 25
    }
  };
}

function generateMockUsageRecords(count: number, model?: AIModel, endpoint?: AIEndpoint) {
  const models: AIModel[] = ['gpt-4', 'gpt-3.5-turbo', 'claude-3-haiku', 'claude-3-sonnet'];
  const endpoints: AIEndpoint[] = [
    'document_generation',
    'legal_review',
    'clause_explanation',
    'content_summarization'
  ];

  const records = [];
  for (let i = 0; i < count; i++) {
    const selectedModel = model || models[Math.floor(Math.random() * models.length)];
    const selectedEndpoint = endpoint || endpoints[Math.floor(Math.random() * endpoints.length)];
    
    records.push({
      id: `ai_${Date.now() - i * 60000}_${Math.random().toString(36).substr(2, 8)}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      model: selectedModel,
      endpoint: selectedEndpoint,
      promptTokens: Math.floor(Math.random() * 2000) + 500,
      completionTokens: Math.floor(Math.random() * 1000) + 200,
      latencyMs: Math.floor(Math.random() * 3000) + 500,
      success: Math.random() > 0.05, // 95% success rate
      totalCostUsd: (Math.random() * 0.5) + 0.05,
      documentId: Math.random() > 0.3 ? `doc_${Math.random().toString(36).substr(2, 9)}` : null,
      customerId: `cust_${Math.random().toString(36).substr(2, 9)}`
    });
  }

  return records.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

function generateHourlyAggregations() {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push({
      hour: i,
      requests: Math.floor(Math.random() * 100) + 20,
      cost: (Math.random() * 10) + 2,
      avgLatency: Math.floor(Math.random() * 2000) + 500
    });
  }
  return hours;
}

function generateModelAggregations() {
  return [
    { model: 'gpt-3.5-turbo', requests: 450, cost: 45.67, avgLatency: 1200 },
    { model: 'gpt-4', requests: 180, cost: 89.32, avgLatency: 2100 },
    { model: 'claude-3-haiku', requests: 320, cost: 23.45, avgLatency: 800 },
    { model: 'claude-3-sonnet', requests: 120, cost: 67.89, avgLatency: 1800 }
  ];
}

function generateEndpointAggregations() {
  return [
    { endpoint: 'document_generation', requests: 380, cost: 78.23, avgLatency: 1800 },
    { endpoint: 'legal_review', requests: 290, cost: 56.78, avgLatency: 1400 },
    { endpoint: 'clause_explanation', requests: 220, cost: 34.56, avgLatency: 1000 },
    { endpoint: 'content_summarization', requests: 180, cost: 23.45, avgLatency: 900 }
  ];
}