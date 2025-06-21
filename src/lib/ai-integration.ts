// AI Integration Helper
// Easy integration for tracking AI usage across the application

import {
  trackAICall,
  trackAIError,
  type AIModel,
  type AIEndpoint,
} from '@/lib/ai-usage-analytics';

export interface AICallOptions {
  model: AIModel;
  endpoint: AIEndpoint;
  documentId?: string;
  documentType?: string;
  customerId?: string;
  temperature?: number;
  maxTokens?: number;
  userId?: string;
  sessionId?: string;
  documentValue?: number;
  metadata?: Record<string, any>;
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency: number;
  metricId?: string;
}

class AIIntegrationManager {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  // Main AI call wrapper with automatic usage tracking
  async callAI<T = any>(
    prompt: string,
    options: AICallOptions,
    aiFunction: (prompt: string, options: any) => Promise<T>,
  ): Promise<AIResponse<T>> {
    const startTime = Date.now();

    try {
      // Estimate prompt tokens (rough approximation)
      const promptTokens = this.estimateTokens(prompt);

      // Call the actual AI function
      const result = await aiFunction(prompt, options);

      const endTime = Date.now();
      const latency = endTime - startTime;

      // Estimate completion tokens (rough approximation)
      const completionTokens = this.estimateTokens(JSON.stringify(result));

      // Track successful AI usage
      const metricId = await trackAICall(
        options.model,
        options.endpoint,
        promptTokens,
        completionTokens,
        latency,
        true,
        {
          documentId: options.documentId,
          documentType: options.documentType,
          customerId: options.customerId,
          temperature: options.temperature || 0.7,
          maxTokens: options.maxTokens || 4096,
          userId: options.userId,
          sessionId: this.sessionId,
          documentValue: options.documentValue,
          promptLength: prompt.length,
          outputLength: JSON.stringify(result).length,
          conversionContribution: !!options.documentValue,
          ...options.metadata,
        },
      );

      return {
        success: true,
        data: result,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
        },
        latency,
        metricId,
      };
    } catch (error) {
      const endTime = Date.now();
      const latency = endTime - startTime;
      const promptTokens = this.estimateTokens(prompt);

      // Track AI error
      const metricId = await trackAIError(
        options.model,
        options.endpoint,
        this.categorizeError(error),
        (error as Error).message,
        latency,
        {
          documentId: options.documentId,
          documentType: options.documentType,
          customerId: options.customerId,
          userId: options.userId,
          sessionId: this.sessionId,
          promptTokens,
          promptLength: prompt.length,
          ...options.metadata,
        },
      );

      return {
        success: false,
        error: (error as Error).message,
        usage: {
          promptTokens,
          completionTokens: 0,
          totalTokens: promptTokens,
        },
        latency,
        metricId,
      };
    }
  }

  // Specialized methods for common AI endpoints
  async generateDocument(
    prompt: string,
    documentType: string,
    model: AIModel = 'gpt-3.5-turbo',
    options: Partial<AICallOptions> = {},
  ): Promise<AIResponse<{ content: string; metadata?: any }>> {
    return this.callAI(
      prompt,
      {
        model,
        endpoint: 'document_generation',
        documentType,
        temperature: 0.7,
        maxTokens: 4096,
        ...options,
      },
      async (prompt) => {
        // In production, this would call the actual AI service
        return this.simulateAICall(prompt, 'document_generation');
      },
    );
  }

  async reviewLegalDocument(
    documentContent: string,
    model: AIModel = 'gpt-4',
    options: Partial<AICallOptions> = {},
  ): Promise<AIResponse<{ issues: any[]; suggestions: any[]; score: number }>> {
    return this.callAI(
      `Review this legal document for issues and provide suggestions:\n\n${documentContent}`,
      {
        model,
        endpoint: 'legal_review',
        temperature: 0.3,
        maxTokens: 2048,
        ...options,
      },
      async (prompt) => {
        return this.simulateAICall(prompt, 'legal_review');
      },
    );
  }

  async explainClause(
    clause: string,
    context: string,
    model: AIModel = 'gpt-3.5-turbo',
    options: Partial<AICallOptions> = {},
  ): Promise<
    AIResponse<{ explanation: string; plainLanguage: string; risks: string[] }>
  > {
    return this.callAI(
      `Explain this legal clause in plain language:\n\nClause: ${clause}\nContext: ${context}`,
      {
        model,
        endpoint: 'clause_explanation',
        temperature: 0.5,
        maxTokens: 1024,
        ...options,
      },
      async (prompt) => {
        return this.simulateAICall(prompt, 'clause_explanation');
      },
    );
  }

  async summarizeContent(
    content: string,
    model: AIModel = 'gpt-3.5-turbo',
    options: Partial<AICallOptions> = {},
  ): Promise<AIResponse<{ summary: string; keyPoints: string[] }>> {
    return this.callAI(
      `Summarize this content and extract key points:\n\n${content}`,
      {
        model,
        endpoint: 'content_summarization',
        temperature: 0.3,
        maxTokens: 512,
        ...options,
      },
      async (prompt) => {
        return this.simulateAICall(prompt, 'content_summarization');
      },
    );
  }

  async validateForm(
    formData: Record<string, any>,
    formType: string,
    model: AIModel = 'gpt-3.5-turbo',
    options: Partial<AICallOptions> = {},
  ): Promise<
    AIResponse<{ isValid: boolean; errors: any[]; suggestions: any[] }>
  > {
    return this.callAI(
      `Validate this ${formType} form data:\n\n${JSON.stringify(formData, null, 2)}`,
      {
        model,
        endpoint: 'form_validation',
        temperature: 0.2,
        maxTokens: 1024,
        ...options,
      },
      async (prompt) => {
        return this.simulateAICall(prompt, 'form_validation');
      },
    );
  }

  async analyzeDocument(
    documentContent: string,
    analysisType: string,
    model: AIModel = 'gpt-4',
    options: Partial<AICallOptions> = {},
  ): Promise<
    AIResponse<{ analysis: any; insights: any[]; recommendations: any[] }>
  > {
    return this.callAI(
      `Perform ${analysisType} analysis on this document:\n\n${documentContent}`,
      {
        model,
        endpoint: 'document_analysis',
        temperature: 0.4,
        maxTokens: 2048,
        ...options,
      },
      async (prompt) => {
        return this.simulateAICall(prompt, 'document_analysis');
      },
    );
  }

  async provideSupportResponse(
    customerMessage: string,
    context: string,
    model: AIModel = 'gpt-3.5-turbo',
    options: Partial<AICallOptions> = {},
  ): Promise<
    AIResponse<{
      response: string;
      category: string;
      urgency: 'low' | 'medium' | 'high';
    }>
  > {
    return this.callAI(
      `Provide customer support response to: "${customerMessage}"\nContext: ${context}`,
      {
        model,
        endpoint: 'customer_support',
        temperature: 0.6,
        maxTokens: 1024,
        ...options,
      },
      async (prompt) => {
        return this.simulateAICall(prompt, 'customer_support');
      },
    );
  }

  async translateContent(
    content: string,
    targetLanguage: string,
    model: AIModel = 'gpt-3.5-turbo',
    options: Partial<AICallOptions> = {},
  ): Promise<AIResponse<{ translatedContent: string; confidence: number }>> {
    return this.callAI(
      `Translate this content to ${targetLanguage}:\n\n${content}`,
      {
        model,
        endpoint: 'translation',
        temperature: 0.3,
        maxTokens: Math.max(1024, content.length * 1.5),
        ...options,
      },
      async (prompt) => {
        return this.simulateAICall(prompt, 'translation');
      },
    );
  }

  async createTemplate(
    templateType: string,
    requirements: string,
    model: AIModel = 'gpt-4',
    options: Partial<AICallOptions> = {},
  ): Promise<
    AIResponse<{ template: string; variables: any[]; instructions: string }>
  > {
    return this.callAI(
      `Create a ${templateType} template with these requirements:\n\n${requirements}`,
      {
        model,
        endpoint: 'template_creation',
        temperature: 0.5,
        maxTokens: 3072,
        ...options,
      },
      async (prompt) => {
        return this.simulateAICall(prompt, 'template_creation');
      },
    );
  }

  // Batch AI operations
  async batchProcess<T>(
    operations: Array<{
      prompt: string;
      options: AICallOptions;
      processor: (prompt: string, options: any) => Promise<T>;
    }>,
  ): Promise<AIResponse<T>[]> {
    const results = await Promise.allSettled(
      operations.map((op) => this.callAI(op.prompt, op.options, op.processor)),
    );

    return results.map((result) =>
      result.status === 'fulfilled'
        ? result.value
        : {
            success: false,
            error: 'Batch operation failed',
            usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
            latency: 0,
          },
    );
  }

  // Quality tracking methods
  async trackUserFeedback(
    metricId: string,
    rating: number,
    feedback?: string,
  ): Promise<void> {
    // In production, update the AI metric with user feedback
    console.log(
      `User feedback for metric ${metricId}: ${rating}/5 - ${feedback}`,
    );
  }

  async trackConversion(
    metricId: string,
    documentValue: number,
    conversionType: string,
  ): Promise<void> {
    // In production, update the AI metric with conversion data
    console.log(
      `Conversion tracked for metric ${metricId}: ${conversionType} - $${documentValue}`,
    );
  }

  // Private helper methods
  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token for English
    return Math.ceil(text.length / 4);
  }

  private categorizeError(error: any): string {
    const message = (error as Error).message.toLowerCase();

    if (message.includes('rate limit')) return 'rate_limit';
    if (message.includes('context') || message.includes('length'))
      return 'context_length';
    if (message.includes('timeout')) return 'timeout';
    if (message.includes('auth')) return 'authentication';
    if (message.includes('quota')) return 'quota_exceeded';
    if (message.includes('model')) return 'model_error';
    if (message.includes('network')) return 'network_error';

    return 'unknown_error';
  }

  private generateSessionId(): string {
    return `ai_session_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private async simulateAICall(
    prompt: string,
    endpoint: AIEndpoint,
  ): Promise<any> {
    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 2000 + 500),
    );

    // Simulate occasional errors (5% failure rate)
    if (Math.random() < 0.05) {
      throw new Error('Simulated AI service error');
    }

    // Return mock responses based on endpoint
    switch (endpoint) {
      case 'document_generation':
        return {
          content: `Generated document content for prompt: ${prompt.substring(0, 100)}...`,
          metadata: { sections: 3, wordCount: 1250, confidence: 0.92 },
        };

      case 'legal_review':
        return {
          issues: [
            {
              type: 'missing_clause',
              severity: 'medium',
              description: 'Liability limitation clause missing',
            },
            {
              type: 'unclear_terms',
              severity: 'low',
              description: 'Payment terms could be more specific',
            },
          ],
          suggestions: [
            { type: 'add_clause', description: 'Add force majeure clause' },
            { type: 'clarify', description: 'Specify delivery timeline' },
          ],
          score: 85,
        };

      case 'clause_explanation':
        return {
          explanation:
            'This clause establishes the terms under which the agreement can be terminated.',
          plainLanguage:
            'Either party can end this contract with 30 days written notice.',
          risks: ['Unexpected termination', 'Short notice period'],
        };

      case 'content_summarization':
        return {
          summary:
            'This document outlines the key terms and conditions for the service agreement.',
          keyPoints: [
            'Service scope and deliverables',
            'Payment terms and schedule',
            'Termination conditions',
            'Liability limitations',
          ],
        };

      case 'form_validation':
        return {
          isValid: Math.random() > 0.3,
          errors:
            Math.random() > 0.5
              ? []
              : [
                  { field: 'email', message: 'Invalid email format' },
                  { field: 'phone', message: 'Phone number required' },
                ],
          suggestions: [
            {
              field: 'address',
              message: 'Consider adding ZIP+4 code for accuracy',
            },
          ],
        };

      case 'document_analysis':
        return {
          analysis: {
            documentType: 'Contract',
            complexity: 'Medium',
            riskLevel: 'Low',
            completeness: '95%',
          },
          insights: [
            'Standard commercial contract structure',
            'Favorable terms for both parties',
            'Clear termination clauses',
          ],
          recommendations: [
            'Add intellectual property clause',
            'Include data protection terms',
          ],
        };

      case 'customer_support':
        return {
          response:
            'Thank you for contacting us. I understand your concern and will help resolve this issue.',
          category: 'general_inquiry',
          urgency:
            Math.random() > 0.8
              ? 'high'
              : Math.random() > 0.5
                ? 'medium'
                : 'low',
        };

      case 'translation':
        return {
          translatedContent: `[Translated content for: ${prompt.substring(0, 50)}...]`,
          confidence: Math.random() * 0.2 + 0.8, // 80-100% confidence
        };

      case 'template_creation':
        return {
          template: `# ${prompt.includes('contract') ? 'Contract' : 'Document'} Template\n\n[Template content here]`,
          variables: [
            { name: 'party1_name', type: 'text', required: true },
            { name: 'party2_name', type: 'text', required: true },
            { name: 'effective_date', type: 'date', required: true },
          ],
          instructions:
            'Fill in the required variables and customize as needed.',
        };

      default:
        return { result: 'Generic AI response', confidence: 0.85 };
    }
  }
}

// Singleton instance
export const aiIntegration = new AIIntegrationManager();

// Convenience exports
export const {
  callAI,
  generateDocument,
  reviewLegalDocument,
  explainClause,
  summarizeContent,
  validateForm,
  analyzeDocument,
  provideSupportResponse,
  translateContent,
  createTemplate,
  batchProcess,
  trackUserFeedback,
  trackConversion,
} = aiIntegration;

// Usage examples:
/*
// Basic document generation
const docResult = await generateDocument(
  "Create a simple rental agreement for a 2-bedroom apartment",
  "rental-agreement",
  "gpt-4",
  {
    customerId: "cust_123",
    documentValue: 89.99,
    userId: "user_456"
  }
);

// Legal review with tracking
const reviewResult = await reviewLegalDocument(
  documentContent,
  "gpt-4",
  {
    documentId: "doc_789",
    documentType: "contract",
    customerId: "cust_123"
  }
);

// Track user feedback
if (reviewResult.metricId) {
  await trackUserFeedback(reviewResult.metricId, 4, "Very helpful analysis");
}

// Track conversion if document leads to purchase
if (documentPurchased && reviewResult.metricId) {
  await trackConversion(reviewResult.metricId, 89.99, "document_purchase");
}
*/
