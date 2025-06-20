// Advanced AI Usage & Cost Analytics System
// Track token usage by model, success rate, latency, cost per doc
// Keeps OpenAI spend visible; optimizes prompt & model mix

export type AIModel = 
  | 'gpt-4' 
  | 'gpt-4-turbo' 
  | 'gpt-3.5-turbo' 
  | 'claude-3-opus' 
  | 'claude-3-sonnet' 
  | 'claude-3-haiku'
  | 'gemini-pro'
  | 'custom';

export type AIEndpoint = 
  | 'document_generation'
  | 'legal_review'
  | 'clause_explanation'
  | 'content_summarization'
  | 'form_validation'
  | 'document_analysis'
  | 'customer_support'
  | 'translation'
  | 'template_creation';

export type AIUsageMetric = {
  id: string;
  timestamp: string;
  model: AIModel;
  endpoint: AIEndpoint;
  documentId?: string;
  documentType?: string;
  customerId?: string;
  
  // Token usage
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  
  // Performance metrics
  latencyMs: number;
  success: boolean;
  errorType?: string;
  errorMessage?: string;
  retryCount: number;
  
  // Cost calculation
  promptCostUsd: number;
  completionCostUsd: number;
  totalCostUsd: number;
  
  // Quality metrics
  outputLength: number;
  userRating?: number; // 1-5 stars if user rates the output
  qualityScore?: number; // 0-100 automated quality score
  
  // Context
  promptLength: number;
  systemPromptLength: number;
  temperature: number;
  maxTokens: number;
  
  // Business metrics
  documentValue?: number;
  conversionContribution?: boolean; // Did this AI call contribute to a conversion?
  
  // Metadata
  version: string;
  environment: 'development' | 'staging' | 'production';
  userId?: string;
  sessionId?: string;
};

export interface AIModelCosts {
  [key: string]: {
    promptCostPer1000: number;
    completionCostPer1000: number;
    lastUpdated: string;
  };
}

export interface AIUsageAnalytics {
  overview: {
    totalRequests: number;
    totalCost: number;
    totalTokens: number;
    avgLatency: number;
    successRate: number;
    costPerDocument: number;
    mostExpensiveModel: AIModel;
    mostEfficientModel: AIModel;
    topEndpoint: AIEndpoint;
  };
  
  modelBreakdown: Array<{
    model: AIModel;
    requests: number;
    tokens: number;
    cost: number;
    avgLatency: number;
    successRate: number;
    costPerRequest: number;
    tokensPerRequest: number;
    efficiency: number; // Cost/success ratio
  }>;
  
  endpointAnalysis: Array<{
    endpoint: AIEndpoint;
    requests: number;
    cost: number;
    avgLatency: number;
    successRate: number;
    topModel: AIModel;
    conversionImpact: number;
    revenueAttribution: number;
  }>;
  
  trends: {
    dailyCosts: Array<{ date: string; cost: number; requests: number; tokens: number }>;
    modelTrends: Array<{ date: string; model: AIModel; cost: number; usage: number }>;
    latencyTrends: Array<{ date: string; avgLatency: number; p95Latency: number }>;
    qualityTrends: Array<{ date: string; avgQuality: number; userRating: number }>;
  };
  
  optimization: {
    costSavingOpportunities: Array<{
      description: string;
      currentCost: number;
      potentialSaving: number;
      effort: 'low' | 'medium' | 'high';
      impact: 'low' | 'medium' | 'high';
      recommendation: string;
    }>;
    
    modelRecommendations: Array<{
      endpoint: AIEndpoint;
      currentModel: AIModel;
      recommendedModel: AIModel;
      reasonning: string;
      costSaving: number;
      performanceImpact: string;
    }>;
    
    promptOptimizations: Array<{
      endpoint: AIEndpoint;
      issue: string;
      suggestion: string;
      estimatedTokenSaving: number;
      estimatedCostSaving: number;
    }>;
  };
  
  budgetTracking: {
    monthlyBudget: number;
    currentSpend: number;
    projectedSpend: number;
    budgetUtilization: number;
    daysRemaining: number;
    burnRate: number; // Daily average spend
    alertThresholds: {
      warning: number; // 80%
      critical: number; // 95%
    };
  };
}

export interface AIQualityMetrics {
  endpoint: AIEndpoint;
  model: AIModel;
  avgUserRating: number;
  avgQualityScore: number;
  outputConsistency: number;
  errorRate: number;
  retryRate: number;
  userSatisfaction: number;
}

class AIUsageAnalyticsEngine {
  private metrics: Map<string, AIUsageMetric> = new Map();
  private modelCosts: AIModelCosts;

  constructor() {
    this.modelCosts = this.initializeModelCosts();
    this.startPeriodicTasks();
  }

  // Track AI usage
  async trackAIUsage(
    model: AIModel,
    endpoint: AIEndpoint,
    promptTokens: number,
    completionTokens: number,
    latencyMs: number,
    success: boolean,
    metadata: Partial<AIUsageMetric> = {}
  ): Promise<string> {
    const metricId = this.generateMetricId();
    const now = new Date().toISOString();
    
    const totalTokens = promptTokens + completionTokens;
    const costs = this.calculateCosts(model, promptTokens, completionTokens);
    
    const metric: AIUsageMetric = {
      id: metricId,
      timestamp: now,
      model,
      endpoint,
      promptTokens,
      completionTokens,
      totalTokens,
      latencyMs,
      success,
      retryCount: metadata.retryCount || 0,
      promptCostUsd: costs.promptCost,
      completionCostUsd: costs.completionCost,
      totalCostUsd: costs.totalCost,
      outputLength: metadata.outputLength || 0,
      promptLength: metadata.promptLength || 0,
      systemPromptLength: metadata.systemPromptLength || 0,
      temperature: metadata.temperature || 0.7,
      maxTokens: metadata.maxTokens || 4096,
      version: metadata.version || '1.0',
      environment: (process.env.NODE_ENV as any) || 'development',
      ...metadata
    };

    this.metrics.set(metricId, metric);
    
    // Persist to database
    await this.persistMetric(metric);
    
    // Check budget alerts
    await this.checkBudgetAlerts();
    
    // Update real-time aggregations
    await this.updateRealTimeAggregations(metric);
    
    return metricId;
  }

  // Track AI error
  async trackAIError(
    model: AIModel,
    endpoint: AIEndpoint,
    errorType: string,
    errorMessage: string,
    latencyMs: number,
    metadata: Partial<AIUsageMetric> = {}
  ): Promise<string> {
    return this.trackAIUsage(
      model,
      endpoint,
      metadata.promptTokens || 0,
      0, // No completion tokens on error
      latencyMs,
      false,
      {
        ...metadata,
        errorType,
        errorMessage
      }
    );
  }

  // Get usage analytics
  generateUsageAnalytics(timeframe: string = '30d'): AIUsageAnalytics {
    const metrics = this.getMetricsInTimeframe(timeframe);
    
    if (metrics.length === 0) {
      return this.getEmptyAnalytics();
    }

    const overview = this.calculateOverviewMetrics(metrics);
    const modelBreakdown = this.calculateModelBreakdown(metrics);
    const endpointAnalysis = this.calculateEndpointAnalysis(metrics);
    const trends = this.calculateTrends(metrics, timeframe);
    const optimization = this.generateOptimizationSuggestions(metrics);
    const budgetTracking = this.calculateBudgetTracking(metrics);

    return {
      overview,
      modelBreakdown,
      endpointAnalysis,
      trends,
      optimization,
      budgetTracking
    };
  }

  // Get model performance comparison
  getModelPerformanceComparison(endpoint?: AIEndpoint): Array<{
    model: AIModel;
    avgCost: number;
    avgLatency: number;
    successRate: number;
    qualityScore: number;
    efficiency: number;
    usage: number;
  }> {
    let metrics = Array.from(this.metrics.values());
    
    if (endpoint) {
      metrics = metrics.filter(m => m.endpoint === endpoint);
    }

    const modelGroups = this.groupBy(metrics, 'model');
    
    return Object.entries(modelGroups).map(([model, modelMetrics]) => {
      const successfulMetrics = modelMetrics.filter(m => m.success);
      const totalCost = modelMetrics.reduce((sum, m) => sum + m.totalCostUsd, 0);
      const avgLatency = modelMetrics.reduce((sum, m) => sum + m.latencyMs, 0) / modelMetrics.length;
      const successRate = (successfulMetrics.length / modelMetrics.length) * 100;
      const avgQuality = successfulMetrics
        .filter(m => m.qualityScore)
        .reduce((sum, m) => sum + (m.qualityScore || 0), 0) / 
        (successfulMetrics.filter(m => m.qualityScore).length || 1);

      return {
        model: model as AIModel,
        avgCost: totalCost / modelMetrics.length,
        avgLatency,
        successRate,
        qualityScore: avgQuality,
        efficiency: successRate / (totalCost + 0.001), // Avoid division by zero
        usage: modelMetrics.length
      };
    }).sort((a, b) => b.efficiency - a.efficiency);
  }

  // Get cost optimization opportunities
  getCostOptimizationOpportunities(): AIUsageAnalytics['optimization']['costSavingOpportunities'] {
    const metrics = Array.from(this.metrics.values());
    const opportunities: AIUsageAnalytics['optimization']['costSavingOpportunities'] = [];

    // Find expensive low-value operations
    const expensiveOperations = metrics
      .filter(m => m.totalCostUsd > 0.1 && !m.conversionContribution)
      .sort((a, b) => b.totalCostUsd - a.totalCostUsd)
      .slice(0, 10);

    if (expensiveOperations.length > 0) {
      const totalCost = expensiveOperations.reduce((sum, m) => sum + m.totalCostUsd, 0);
      opportunities.push({
        description: 'Expensive operations with low business value',
        currentCost: totalCost,
        potentialSaving: totalCost * 0.7,
        effort: 'medium',
        impact: 'high',
        recommendation: 'Review prompt efficiency and consider switching to cheaper models for non-critical operations'
      });
    }

    // Find models with high retry rates
    const modelRetryRates = this.groupBy(metrics, 'model');
    for (const [model, modelMetrics] of Object.entries(modelRetryRates)) {
      const retryRate = modelMetrics.filter(m => m.retryCount > 0).length / modelMetrics.length;
      if (retryRate > 0.15) { // More than 15% retry rate
        const retryCost = modelMetrics
          .filter(m => m.retryCount > 0)
          .reduce((sum, m) => sum + m.totalCostUsd * m.retryCount, 0);
        
        opportunities.push({
          description: `High retry rate for ${model}`,
          currentCost: retryCost,
          potentialSaving: retryCost * 0.5,
          effort: 'medium',
          impact: 'medium',
          recommendation: 'Optimize prompts to reduce model confusion and improve success rate'
        });
      }
    }

    // Find oversized prompts
    const longPrompts = metrics.filter(m => m.promptLength > 8000);
    if (longPrompts.length > 10) {
      const promptCost = longPrompts.reduce((sum, m) => sum + m.promptCostUsd, 0);
      opportunities.push({
        description: 'Oversized prompts consuming excess tokens',
        currentCost: promptCost,
        potentialSaving: promptCost * 0.3,
        effort: 'low',
        impact: 'medium',
        recommendation: 'Optimize prompt templates to reduce token usage while maintaining quality'
      });
    }

    return opportunities.sort((a, b) => b.potentialSaving - a.potentialSaving);
  }

  // Private helper methods
  private initializeModelCosts(): AIModelCosts {
    return {
      'gpt-4': {
        promptCostPer1000: 0.03,
        completionCostPer1000: 0.06,
        lastUpdated: '2024-01-15'
      },
      'gpt-4-turbo': {
        promptCostPer1000: 0.01,
        completionCostPer1000: 0.03,
        lastUpdated: '2024-01-15'
      },
      'gpt-3.5-turbo': {
        promptCostPer1000: 0.0015,
        completionCostPer1000: 0.002,
        lastUpdated: '2024-01-15'
      },
      'claude-3-opus': {
        promptCostPer1000: 0.015,
        completionCostPer1000: 0.075,
        lastUpdated: '2024-01-15'
      },
      'claude-3-sonnet': {
        promptCostPer1000: 0.003,
        completionCostPer1000: 0.015,
        lastUpdated: '2024-01-15'
      },
      'claude-3-haiku': {
        promptCostPer1000: 0.00025,
        completionCostPer1000: 0.00125,
        lastUpdated: '2024-01-15'
      },
      'gemini-pro': {
        promptCostPer1000: 0.0005,
        completionCostPer1000: 0.0015,
        lastUpdated: '2024-01-15'
      },
      'custom': {
        promptCostPer1000: 0.001,
        completionCostPer1000: 0.002,
        lastUpdated: '2024-01-15'
      }
    };
  }

  private calculateCosts(model: AIModel, promptTokens: number, completionTokens: number) {
    const costs = this.modelCosts[model];
    if (!costs) {
      console.warn(`No cost data for model ${model}, using default`);
      const defaultCosts = this.modelCosts['custom'];
      const promptCost = (promptTokens / 1000) * defaultCosts.promptCostPer1000;
      const completionCost = (completionTokens / 1000) * defaultCosts.completionCostPer1000;
      return {
        promptCost,
        completionCost,
        totalCost: promptCost + completionCost
      };
    }

    const promptCost = (promptTokens / 1000) * costs.promptCostPer1000;
    const completionCost = (completionTokens / 1000) * costs.completionCostPer1000;
    
    return {
      promptCost,
      completionCost,
      totalCost: promptCost + completionCost
    };
  }

  private calculateOverviewMetrics(metrics: AIUsageMetric[]) {
    const totalRequests = metrics.length;
    const totalCost = metrics.reduce((sum, m) => sum + m.totalCostUsd, 0);
    const totalTokens = metrics.reduce((sum, m) => sum + m.totalTokens, 0);
    const avgLatency = metrics.reduce((sum, m) => sum + m.latencyMs, 0) / totalRequests;
    const successRate = (metrics.filter(m => m.success).length / totalRequests) * 100;
    
    // Documents with AI usage
    const documentsWithAI = new Set(metrics.filter(m => m.documentId).map(m => m.documentId)).size;
    const costPerDocument = documentsWithAI > 0 ? totalCost / documentsWithAI : 0;

    // Find most expensive and efficient models
    const modelCosts = this.groupBy(metrics, 'model');
    let mostExpensiveModel: AIModel = 'gpt-4';
    let mostEfficientModel: AIModel = 'gpt-3.5-turbo';
    let highestCost = 0;
    let bestEfficiency = 0;

    for (const [model, modelMetrics] of Object.entries(modelCosts)) {
      const modelCost = modelMetrics.reduce((sum, m) => sum + m.totalCostUsd, 0);
      const modelSuccess = modelMetrics.filter(m => m.success).length / modelMetrics.length;
      const efficiency = modelSuccess / (modelCost + 0.001);

      if (modelCost > highestCost) {
        highestCost = modelCost;
        mostExpensiveModel = model as AIModel;
      }

      if (efficiency > bestEfficiency) {
        bestEfficiency = efficiency;
        mostEfficientModel = model as AIModel;
      }
    }

    // Find top endpoint
    const endpointUsage = this.groupBy(metrics, 'endpoint');
    const topEndpoint = Object.entries(endpointUsage)
      .sort(([,a], [,b]) => b.length - a.length)[0]?.[0] as AIEndpoint || 'document_generation';

    return {
      totalRequests,
      totalCost,
      totalTokens,
      avgLatency,
      successRate,
      costPerDocument,
      mostExpensiveModel,
      mostEfficientModel,
      topEndpoint
    };
  }

  private calculateModelBreakdown(metrics: AIUsageMetric[]) {
    const modelGroups = this.groupBy(metrics, 'model');
    
    return Object.entries(modelGroups).map(([model, modelMetrics]) => {
      const requests = modelMetrics.length;
      const tokens = modelMetrics.reduce((sum, m) => sum + m.totalTokens, 0);
      const cost = modelMetrics.reduce((sum, m) => sum + m.totalCostUsd, 0);
      const avgLatency = modelMetrics.reduce((sum, m) => sum + m.latencyMs, 0) / requests;
      const successRate = (modelMetrics.filter(m => m.success).length / requests) * 100;
      const costPerRequest = cost / requests;
      const tokensPerRequest = tokens / requests;
      const efficiency = successRate / (costPerRequest + 0.001);

      return {
        model: model as AIModel,
        requests,
        tokens,
        cost,
        avgLatency,
        successRate,
        costPerRequest,
        tokensPerRequest,
        efficiency
      };
    }).sort((a, b) => b.cost - a.cost);
  }

  private calculateEndpointAnalysis(metrics: AIUsageMetric[]) {
    const endpointGroups = this.groupBy(metrics, 'endpoint');
    
    return Object.entries(endpointGroups).map(([endpoint, endpointMetrics]) => {
      const requests = endpointMetrics.length;
      const cost = endpointMetrics.reduce((sum, m) => sum + m.totalCostUsd, 0);
      const avgLatency = endpointMetrics.reduce((sum, m) => sum + m.latencyMs, 0) / requests;
      const successRate = (endpointMetrics.filter(m => m.success).length / requests) * 100;
      
      // Find top model for this endpoint
      const modelUsage = this.groupBy(endpointMetrics, 'model');
      const topModel = Object.entries(modelUsage)
        .sort(([,a], [,b]) => b.length - a.length)[0]?.[0] as AIModel || 'gpt-3.5-turbo';
      
      // Calculate business impact
      const conversions = endpointMetrics.filter(m => m.conversionContribution).length;
      const conversionImpact = (conversions / requests) * 100;
      const revenueAttribution = endpointMetrics
        .filter(m => m.documentValue)
        .reduce((sum, m) => sum + (m.documentValue || 0), 0);

      return {
        endpoint: endpoint as AIEndpoint,
        requests,
        cost,
        avgLatency,
        successRate,
        topModel,
        conversionImpact,
        revenueAttribution
      };
    }).sort((a, b) => b.cost - a.cost);
  }

  private calculateTrends(metrics: AIUsageMetric[], timeframe: string) {
    // Group metrics by day
    const dailyGroups = this.groupBy(metrics, m => m.timestamp.split('T')[0]);
    
    const dailyCosts = Object.entries(dailyGroups).map(([date, dayMetrics]) => ({
      date,
      cost: dayMetrics.reduce((sum, m) => sum + m.totalCostUsd, 0),
      requests: dayMetrics.length,
      tokens: dayMetrics.reduce((sum, m) => sum + m.totalTokens, 0)
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Model trends
    const modelTrends: any[] = [];
    for (const [date, dayMetrics] of Object.entries(dailyGroups)) {
      const modelGroups = this.groupBy(dayMetrics, 'model');
      for (const [model, modelDayMetrics] of Object.entries(modelGroups)) {
        modelTrends.push({
          date,
          model: model as AIModel,
          cost: modelDayMetrics.reduce((sum, m) => sum + m.totalCostUsd, 0),
          usage: modelDayMetrics.length
        });
      }
    }

    // Latency trends
    const latencyTrends = Object.entries(dailyGroups).map(([date, dayMetrics]) => {
      const latencies = dayMetrics.map(m => m.latencyMs).sort((a, b) => a - b);
      const avgLatency = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
      const p95Index = Math.floor(latencies.length * 0.95);
      const p95Latency = latencies[p95Index] || avgLatency;

      return { date, avgLatency, p95Latency };
    }).sort((a, b) => a.date.localeCompare(b.date));

    // Quality trends
    const qualityTrends = Object.entries(dailyGroups).map(([date, dayMetrics]) => {
      const qualityMetrics = dayMetrics.filter(m => m.qualityScore && m.userRating);
      const avgQuality = qualityMetrics.length > 0 
        ? qualityMetrics.reduce((sum, m) => sum + (m.qualityScore || 0), 0) / qualityMetrics.length
        : 0;
      const userRating = qualityMetrics.length > 0
        ? qualityMetrics.reduce((sum, m) => sum + (m.userRating || 0), 0) / qualityMetrics.length
        : 0;

      return { date, avgQuality, userRating };
    }).sort((a, b) => a.date.localeCompare(b.date));

    return {
      dailyCosts,
      modelTrends,
      latencyTrends,
      qualityTrends
    };
  }

  private generateOptimizationSuggestions(metrics: AIUsageMetric[]): AIUsageAnalytics['optimization'] {
    return {
      costSavingOpportunities: this.getCostOptimizationOpportunities(),
      modelRecommendations: this.getModelRecommendations(metrics),
      promptOptimizations: this.getPromptOptimizations(metrics)
    };
  }

  private getModelRecommendations(metrics: AIUsageMetric[]) {
    const recommendations: any[] = [];
    const endpointGroups = this.groupBy(metrics, 'endpoint');

    for (const [endpoint, endpointMetrics] of Object.entries(endpointGroups)) {
      const modelPerformance = this.getModelPerformanceComparison(endpoint as AIEndpoint);
      
      if (modelPerformance.length >= 2) {
        const current = modelPerformance.find(m => m.usage > 0);
        const recommended = modelPerformance[0]; // Most efficient

        if (current && recommended && current.model !== recommended.model) {
          const costSaving = (current.avgCost - recommended.avgCost) * current.usage;
          
          if (costSaving > 1) { // More than $1 saving
            recommendations.push({
              endpoint: endpoint as AIEndpoint,
              currentModel: current.model,
              recommendedModel: recommended.model,
              reasonning: `${recommended.model} shows ${(recommended.efficiency / current.efficiency * 100).toFixed(0)}% better efficiency`,
              costSaving,
              performanceImpact: recommended.avgLatency < current.avgLatency ? 'Faster' : 'Slightly slower'
            });
          }
        }
      }
    }

    return recommendations.sort((a, b) => b.costSaving - a.costSaving);
  }

  private getPromptOptimizations(metrics: AIUsageMetric[]) {
    const optimizations: any[] = [];
    const endpointGroups = this.groupBy(metrics, 'endpoint');

    for (const [endpoint, endpointMetrics] of Object.entries(endpointGroups)) {
      const avgPromptLength = endpointMetrics.reduce((sum, m) => sum + m.promptLength, 0) / endpointMetrics.length;
      const avgSystemPromptLength = endpointMetrics.reduce((sum, m) => sum + m.systemPromptLength, 0) / endpointMetrics.length;
      
      // Long prompts
      if (avgPromptLength > 6000) {
        const tokenSaving = Math.floor(avgPromptLength * 0.2); // 20% reduction
        const costSaving = endpointMetrics.reduce((sum, m) => sum + m.promptCostUsd, 0) * 0.2;
        
        optimizations.push({
          endpoint: endpoint as AIEndpoint,
          issue: 'Prompts are longer than optimal',
          suggestion: 'Review prompt templates for redundant instructions and examples',
          estimatedTokenSaving: tokenSaving,
          estimatedCostSaving: costSaving
        });
      }

      // Long system prompts
      if (avgSystemPromptLength > 2000) {
        const tokenSaving = Math.floor(avgSystemPromptLength * 0.3);
        const costSaving = endpointMetrics.reduce((sum, m) => sum + m.promptCostUsd * 0.3, 0);
        
        optimizations.push({
          endpoint: endpoint as AIEndpoint,
          issue: 'System prompts contain excessive boilerplate',
          suggestion: 'Streamline system prompts to essential instructions only',
          estimatedTokenSaving: tokenSaving,
          estimatedCostSaving: costSaving
        });
      }
    }

    return optimizations.sort((a, b) => b.estimatedCostSaving - a.estimatedCostSaving);
  }

  private calculateBudgetTracking(metrics: AIUsageMetric[]) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter to current month
    const currentMonthMetrics = metrics.filter(m => {
      const metricDate = new Date(m.timestamp);
      return metricDate.getMonth() === currentMonth && metricDate.getFullYear() === currentYear;
    });

    const currentSpend = currentMonthMetrics.reduce((sum, m) => sum + m.totalCostUsd, 0);
    const monthlyBudget = 1000; // Default $1000 budget
    
    // Calculate daily burn rate
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysPassed = now.getDate();
    const daysRemaining = daysInMonth - daysPassed;
    const burnRate = currentSpend / daysPassed;
    const projectedSpend = burnRate * daysInMonth;
    
    return {
      monthlyBudget,
      currentSpend,
      projectedSpend,
      budgetUtilization: (currentSpend / monthlyBudget) * 100,
      daysRemaining,
      burnRate,
      alertThresholds: {
        warning: monthlyBudget * 0.8,
        critical: monthlyBudget * 0.95
      }
    };
  }

  private getEmptyAnalytics(): AIUsageAnalytics {
    return {
      overview: {
        totalRequests: 0,
        totalCost: 0,
        totalTokens: 0,
        avgLatency: 0,
        successRate: 0,
        costPerDocument: 0,
        mostExpensiveModel: 'gpt-4',
        mostEfficientModel: 'gpt-3.5-turbo',
        topEndpoint: 'document_generation'
      },
      modelBreakdown: [],
      endpointAnalysis: [],
      trends: {
        dailyCosts: [],
        modelTrends: [],
        latencyTrends: [],
        qualityTrends: []
      },
      optimization: {
        costSavingOpportunities: [],
        modelRecommendations: [],
        promptOptimizations: []
      },
      budgetTracking: {
        monthlyBudget: 1000,
        currentSpend: 0,
        projectedSpend: 0,
        budgetUtilization: 0,
        daysRemaining: 30,
        burnRate: 0,
        alertThresholds: { warning: 800, critical: 950 }
      }
    };
  }

  private getMetricsInTimeframe(timeframe: string): AIUsageMetric[] {
    const now = new Date();
    let cutoffDate: Date;

    switch (timeframe) {
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return Array.from(this.metrics.values())
      .filter(m => new Date(m.timestamp) >= cutoffDate);
  }

  private groupBy<T>(array: T[], keyFunc: string | ((item: T) => string)): Record<string, T[]> {
    const groups: Record<string, T[]> = {};
    
    for (const item of array) {
      const key = typeof keyFunc === 'string' ? (item as any)[keyFunc] : keyFunc(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    }
    
    return groups;
  }

  private generateMetricId(): string {
    return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private async persistMetric(metric: AIUsageMetric): Promise<void> {
    // In production, save to database
    console.log(`Persisting AI metric ${metric.id}:`, {
      model: metric.model,
      endpoint: metric.endpoint,
      cost: metric.totalCostUsd,
      tokens: metric.totalTokens,
      success: metric.success
    });
  }

  private async checkBudgetAlerts(): Promise<void> {
    const budgetData = this.calculateBudgetTracking(Array.from(this.metrics.values()));
    
    if (budgetData.currentSpend >= budgetData.alertThresholds.critical) {
      console.error('🚨 CRITICAL: AI spending has exceeded 95% of monthly budget!');
      // In production, send alert emails/notifications
    } else if (budgetData.currentSpend >= budgetData.alertThresholds.warning) {
      console.warn('⚠️ WARNING: AI spending has exceeded 80% of monthly budget');
      // In production, send warning notifications
    }
  }

  private async updateRealTimeAggregations(metric: AIUsageMetric): Promise<void> {
    // In production, update Redis cache for real-time dashboard
    console.log(`Updating real-time aggregations for ${metric.endpoint} with ${metric.model}`);
  }

  private startPeriodicTasks(): void {
    // Check budget alerts every hour
    setInterval(() => {
      this.checkBudgetAlerts();
    }, 3600000);

    // Generate daily optimization reports
    setInterval(() => {
      this.generateDailyOptimizationReport();
    }, 24 * 3600000);
  }

  private generateDailyOptimizationReport(): void {
    const analytics = this.generateUsageAnalytics('1d');
    console.log('Daily AI Usage Report:', {
      totalCost: analytics.overview.totalCost,
      requests: analytics.overview.totalRequests,
      topSavingOpportunity: analytics.optimization.costSavingOpportunities[0]
    });
  }
}

// Singleton instance
export const aiUsageAnalytics = new AIUsageAnalyticsEngine();

// Utility functions for easy integration
export function trackAICall(
  model: AIModel,
  endpoint: AIEndpoint,
  promptTokens: number,
  completionTokens: number,
  latencyMs: number,
  success: boolean,
  metadata?: Partial<AIUsageMetric>
): Promise<string> {
  return aiUsageAnalytics.trackAIUsage(
    model,
    endpoint,
    promptTokens,
    completionTokens,
    latencyMs,
    success,
    metadata
  );
}

export function trackAIError(
  model: AIModel,
  endpoint: AIEndpoint,
  errorType: string,
  errorMessage: string,
  latencyMs: number,
  metadata?: Partial<AIUsageMetric>
): Promise<string> {
  return aiUsageAnalytics.trackAIError(
    model,
    endpoint,
    errorType,
    errorMessage,
    latencyMs,
    metadata
  );
}

export function getAIAnalytics(timeframe?: string): AIUsageAnalytics {
  return aiUsageAnalytics.generateUsageAnalytics(timeframe);
}

export function getModelComparison(endpoint?: AIEndpoint) {
  return aiUsageAnalytics.getModelPerformanceComparison(endpoint);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4
  }).format(amount);
}

export function formatTokens(tokens: number): string {
  if (tokens < 1000) return `${tokens}`;
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`;
  return `${(tokens / 1000000).toFixed(1)}M`;
}