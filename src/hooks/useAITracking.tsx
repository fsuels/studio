// React Hook for AI Usage Tracking
'use client';

import { useState, useCallback, useRef } from 'react';
import {
  aiIntegration,
  type AICallOptions,
  type AIResponse,
} from '@/lib/ai-integration';
import { type AIModel, type AIEndpoint } from '@/lib/ai-usage-analytics';

export interface UseAITrackingOptions {
  defaultModel?: AIModel;
  customerId?: string;
  documentId?: string;
  documentType?: string;
  userId?: string;
  sessionId?: string;
  onSuccess?: (response: AIResponse) => void;
  onError?: (error: string) => void;
}

export interface AICallState {
  loading: boolean;
  error: string | null;
  response: AIResponse | null;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    totalCost?: number;
  } | null;
}

export function useAITracking(options: UseAITrackingOptions = {}) {
  const [state, setState] = useState<AICallState>({
    loading: false,
    error: null,
    response: null,
    usage: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      response: null,
      usage: null,
    });
  }, []);

  const callAI = useCallback(
    async <T = any,>(
      prompt: string,
      endpoint: AIEndpoint,
      model: AIModel = options.defaultModel || 'gpt-3.5-turbo',
      additionalOptions: Partial<AICallOptions> = {},
    ): Promise<AIResponse<T> | null> => {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        response: null,
      }));

      try {
        const callOptions: AICallOptions = {
          model,
          endpoint,
          customerId: options.customerId,
          documentId: options.documentId,
          documentType: options.documentType,
          userId: options.userId,
          sessionId: options.sessionId,
          ...additionalOptions,
        };

        const response = await aiIntegration.callAI<T>(
          prompt,
          callOptions,
          async (prompt) => {
            // This would be replaced with actual AI service calls
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 + Math.random() * 2000),
            );
            return {
              result: `AI response for: ${prompt.substring(0, 50)}...`,
            } as T;
          },
        );

        if (abortControllerRef.current?.signal.aborted) {
          return null;
        }

        setState({
          loading: false,
          error: response.success ? null : response.error || 'Unknown error',
          response,
          usage: response.usage
            ? {
                ...response.usage,
                totalCost: estimateCost(response.usage, model),
              }
            : null,
        });

        if (response.success && options.onSuccess) {
          options.onSuccess(response);
        } else if (!response.success && options.onError) {
          options.onError(response.error || 'Unknown error');
        }

        return response;
      } catch (error) {
        if (abortControllerRef.current?.signal.aborted) {
          return null;
        }

        const errorMessage = (error as Error).message;
        setState({
          loading: false,
          error: errorMessage,
          response: null,
          usage: null,
        });

        if (options.onError) {
          options.onError(errorMessage);
        }

        return null;
      }
    },
    [options],
  );

  // Specialized AI call methods
  const generateDocument = useCallback(
    async (
      prompt: string,
      documentType: string,
      model: AIModel = options.defaultModel || 'gpt-3.5-turbo',
      additionalOptions: Partial<AICallOptions> = {},
    ) => {
      return callAI(prompt, 'document_generation', model, {
        documentType,
        ...additionalOptions,
      });
    },
    [callAI, options.defaultModel],
  );

  const reviewDocument = useCallback(
    async (
      documentContent: string,
      model: AIModel = 'gpt-4',
      additionalOptions: Partial<AICallOptions> = {},
    ) => {
      return callAI(
        `Review this legal document for issues and provide suggestions:\n\n${documentContent}`,
        'legal_review',
        model,
        additionalOptions,
      );
    },
    [callAI],
  );

  const explainClause = useCallback(
    async (
      clause: string,
      context: string = '',
      model: AIModel = options.defaultModel || 'gpt-3.5-turbo',
      additionalOptions: Partial<AICallOptions> = {},
    ) => {
      return callAI(
        `Explain this legal clause in plain language:\n\nClause: ${clause}\nContext: ${context}`,
        'clause_explanation',
        model,
        additionalOptions,
      );
    },
    [callAI, options.defaultModel],
  );

  const summarizeContent = useCallback(
    async (
      content: string,
      model: AIModel = options.defaultModel || 'gpt-3.5-turbo',
      additionalOptions: Partial<AICallOptions> = {},
    ) => {
      return callAI(
        `Summarize this content and extract key points:\n\n${content}`,
        'content_summarization',
        model,
        additionalOptions,
      );
    },
    [callAI, options.defaultModel],
  );

  const validateForm = useCallback(
    async (
      formData: Record<string, any>,
      formType: string,
      model: AIModel = options.defaultModel || 'gpt-3.5-turbo',
      additionalOptions: Partial<AICallOptions> = {},
    ) => {
      return callAI(
        `Validate this ${formType} form data:\n\n${JSON.stringify(formData, null, 2)}`,
        'form_validation',
        model,
        additionalOptions,
      );
    },
    [callAI, options.defaultModel],
  );

  const provideSupportResponse = useCallback(
    async (
      customerMessage: string,
      context: string = '',
      model: AIModel = options.defaultModel || 'gpt-3.5-turbo',
      additionalOptions: Partial<AICallOptions> = {},
    ) => {
      return callAI(
        `Provide customer support response to: "${customerMessage}"\nContext: ${context}`,
        'customer_support',
        model,
        additionalOptions,
      );
    },
    [callAI, options.defaultModel],
  );

  // Quality tracking methods
  const trackFeedback = useCallback(
    async (rating: number, feedback?: string) => {
      if (state.response?.metricId) {
        await aiIntegration.trackUserFeedback(
          state.response.metricId,
          rating,
          feedback,
        );
      }
    },
    [state.response?.metricId],
  );

  const trackConversion = useCallback(
    async (
      documentValue: number,
      conversionType: string = 'document_purchase',
    ) => {
      if (state.response?.metricId) {
        await aiIntegration.trackConversion(
          state.response.metricId,
          documentValue,
          conversionType,
        );
      }
    },
    [state.response?.metricId],
  );

  // Cancel ongoing request
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, []);

  return {
    // State
    loading: state.loading,
    error: state.error,
    response: state.response,
    usage: state.usage,

    // Methods
    callAI,
    generateDocument,
    reviewDocument,
    explainClause,
    summarizeContent,
    validateForm,
    provideSupportResponse,
    trackFeedback,
    trackConversion,
    cancel,
    resetState,
  };
}

// Utility hook for AI cost estimation
export function useAICostEstimation() {
  const estimatePromptCost = useCallback(
    (text: string, model: AIModel): number => {
      const tokens = Math.ceil(text.length / 4); // Rough estimation
      return estimateCost(
        { promptTokens: tokens, completionTokens: 0, totalTokens: tokens },
        model,
      );
    },
    [],
  );

  const estimateCallCost = useCallback(
    (
      promptText: string,
      expectedResponseLength: number,
      model: AIModel,
    ): number => {
      const promptTokens = Math.ceil(promptText.length / 4);
      const completionTokens = Math.ceil(expectedResponseLength / 4);
      return estimateCost(
        {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
        },
        model,
      );
    },
    [],
  );

  return {
    estimatePromptCost,
    estimateCallCost,
  };
}

// Utility hook for AI performance monitoring
export function useAIPerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    totalCalls: 0,
    totalCost: 0,
    averageLatency: 0,
    successRate: 100,
    recentCalls: [] as Array<{
      timestamp: Date;
      model: AIModel;
      endpoint: AIEndpoint;
      cost: number;
      latency: number;
      success: boolean;
    }>,
  });

  const recordCall = useCallback(
    (
      model: AIModel,
      endpoint: AIEndpoint,
      cost: number,
      latency: number,
      success: boolean,
    ) => {
      setMetrics((prev) => {
        const newCall = {
          timestamp: new Date(),
          model,
          endpoint,
          cost,
          latency,
          success,
        };

        const recentCalls = [...prev.recentCalls, newCall].slice(-50); // Keep last 50 calls
        const totalCalls = prev.totalCalls + 1;
        const totalCost = prev.totalCost + cost;
        const averageLatency =
          (prev.averageLatency * prev.totalCalls + latency) / totalCalls;
        const successCount = recentCalls.filter((call) => call.success).length;
        const successRate = (successCount / recentCalls.length) * 100;

        return {
          totalCalls,
          totalCost,
          averageLatency,
          successRate,
          recentCalls,
        };
      });
    },
    [],
  );

  const getMetricsForModel = useCallback(
    (model: AIModel) => {
      const modelCalls = metrics.recentCalls.filter(
        (call) => call.model === model,
      );
      if (modelCalls.length === 0) return null;

      return {
        calls: modelCalls.length,
        totalCost: modelCalls.reduce((sum, call) => sum + call.cost, 0),
        averageLatency:
          modelCalls.reduce((sum, call) => sum + call.latency, 0) /
          modelCalls.length,
        successRate:
          (modelCalls.filter((call) => call.success).length /
            modelCalls.length) *
          100,
      };
    },
    [metrics.recentCalls],
  );

  const getMetricsForEndpoint = useCallback(
    (endpoint: AIEndpoint) => {
      const endpointCalls = metrics.recentCalls.filter(
        (call) => call.endpoint === endpoint,
      );
      if (endpointCalls.length === 0) return null;

      return {
        calls: endpointCalls.length,
        totalCost: endpointCalls.reduce((sum, call) => sum + call.cost, 0),
        averageLatency:
          endpointCalls.reduce((sum, call) => sum + call.latency, 0) /
          endpointCalls.length,
        successRate:
          (endpointCalls.filter((call) => call.success).length /
            endpointCalls.length) *
          100,
      };
    },
    [metrics.recentCalls],
  );

  return {
    metrics,
    recordCall,
    getMetricsForModel,
    getMetricsForEndpoint,
  };
}

// Helper function to estimate costs
function estimateCost(
  usage: { promptTokens: number; completionTokens: number },
  model: AIModel,
): number {
  const costs: Record<AIModel, { prompt: number; completion: number }> = {
    'gpt-4': { prompt: 0.03, completion: 0.06 },
    'gpt-4-turbo': { prompt: 0.01, completion: 0.03 },
    'gpt-3.5-turbo': { prompt: 0.0015, completion: 0.002 },
    'claude-3-opus': { prompt: 0.015, completion: 0.075 },
    'claude-3-sonnet': { prompt: 0.003, completion: 0.015 },
    'claude-3-haiku': { prompt: 0.00025, completion: 0.00125 },
    'gemini-pro': { prompt: 0.0005, completion: 0.0015 },
    custom: { prompt: 0.001, completion: 0.002 },
  };

  const modelCosts = costs[model] || costs.custom;
  return (
    (usage.promptTokens / 1000) * modelCosts.prompt +
    (usage.completionTokens / 1000) * modelCosts.completion
  );
}
