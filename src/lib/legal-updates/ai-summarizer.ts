// src/lib/legal-updates/ai-summarizer.ts
import OpenAI from 'openai';
import { adminDb } from '@/lib/firebase-admin';
import {
  RawLegalUpdate,
  ProcessedLegalUpdate,
  LegalUpdateSource,
  createUpdateId,
  COLLECTIONS,
  ProcessedLegalUpdateSchema,
} from './schema';

interface SummarizationResult {
  summary: string;
  keyPoints: string[];
  actionItems: Array<{
    description: string;
    deadline?: Date;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    category: string;
  }>;
  affectedDocuments: string[];
  urgency: 'critical' | 'high' | 'medium' | 'low';
  compliance: {
    hasDeadline: boolean;
    deadline?: Date;
    requiresAction: boolean;
    riskLevel: 'high' | 'medium' | 'low';
  };
  confidence: number;
  tags: string[];
}

class LegalUpdateAISummarizer {
  private openai: OpenAI;
  private readonly model = 'gpt-4o';
  private readonly maxTokens = 4000;
  private readonly temperature = 0.1; // Low temperature for consistency

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processRawUpdate(
    rawUpdate: RawLegalUpdate,
    source: LegalUpdateSource,
  ): Promise<ProcessedLegalUpdate | null> {
    try {
      console.log(`Processing raw update: ${rawUpdate.title}`);

      const startTime = Date.now();
      const summarization = await this.summarizeUpdate(rawUpdate, source);
      const processingTime = Date.now() - startTime;

      if (!summarization) {
        console.warn(`Failed to summarize update: ${rawUpdate.id}`);
        return null;
      }

      const processedUpdate: ProcessedLegalUpdate = {
        id: createUpdateId(),
        rawUpdateId: rawUpdate.id,
        sourceId: rawUpdate.sourceId,
        title: rawUpdate.title,
        summary: summarization.summary,
        keyPoints: summarization.keyPoints,
        actionItems: summarization.actionItems,
        affectedDocuments: summarization.affectedDocuments,
        jurisdiction: source.jurisdiction,
        category: source.category,
        urgency: summarization.urgency,
        compliance: summarization.compliance,
        metadata: {
          aiModel: this.model,
          processingTime,
          confidence: summarization.confidence,
          tags: summarization.tags,
          relatedUpdates: [], // Will be populated later by similarity matching
        },
        publishedDate: rawUpdate.publishedDate,
        processedAt: new Date(),
        status: 'active',
        notificationStatus: {
          emailSent: false,
          dashboardShown: false,
        },
      };

      // Validate the schema
      ProcessedLegalUpdateSchema.parse(processedUpdate);

      // Save to Firestore
      await this.saveProcessedUpdate(processedUpdate);

      // Update raw update status
      await this.updateRawUpdateStatus(rawUpdate.id, 'processed');

      console.log(`Successfully processed update: ${processedUpdate.id}`);
      return processedUpdate;
    } catch (error) {
      console.error(`Error processing raw update ${rawUpdate.id}:`, error);
      await this.updateRawUpdateStatus(rawUpdate.id, 'failed');
      return null;
    }
  }

  private async summarizeUpdate(
    rawUpdate: RawLegalUpdate,
    source: LegalUpdateSource,
  ): Promise<SummarizationResult | null> {
    try {
      const prompt = this.buildSummarizationPrompt(rawUpdate, source);

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const result = JSON.parse(content);
      return this.validateAndTransformResult(result);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return null;
    }
  }

  private getSystemPrompt(): string {
    return `You are a legal AI assistant specializing in analyzing legal updates for a legal document platform. Your job is to:

1. Summarize complex legal updates into clear, actionable insights
2. Identify key points that matter to small business owners and individuals
3. Extract specific action items with deadlines when applicable
4. Determine which document types might be affected
5. Assess urgency and compliance requirements

Focus on practical implications rather than legal jargon. Consider users who create:
- Employment contracts and policies
- Real estate agreements and leases  
- Business formation documents
- Consumer contracts and terms
- Estate planning documents
- Compliance forms and notices

Provide responses in JSON format with high confidence scores for actionable items.`;
  }

  private buildSummarizationPrompt(
    rawUpdate: RawLegalUpdate,
    source: LegalUpdateSource,
  ): string {
    return `Analyze this legal update and provide a structured summary:

**Source Information:**
- Name: ${source.name}
- Jurisdiction: ${source.jurisdiction}
- Type: ${source.type}
- Category: ${source.category}

**Update Details:**
- Title: ${rawUpdate.title}
- Published: ${rawUpdate.publishedDate.toLocaleDateString()}
- Description: ${rawUpdate.description}
- Content: ${rawUpdate.content?.substring(0, 2000) || 'No additional content'}
- Tags: ${rawUpdate.tags.join(', ')}

**Required JSON Response Format:**
{
  "summary": "2-3 sentence executive summary of the legal update",
  "keyPoints": ["list", "of", "3-5", "key", "points"],
  "actionItems": [
    {
      "description": "specific action required",
      "deadline": "YYYY-MM-DD or null",
      "priority": "urgent|high|medium|low",
      "category": "compliance|filing|update|review"
    }
  ],
  "affectedDocuments": ["document-type-1", "document-type-2"],
  "urgency": "critical|high|medium|low",
  "compliance": {
    "hasDeadline": true/false,
    "deadline": "YYYY-MM-DD or null",
    "requiresAction": true/false,
    "riskLevel": "high|medium|low"
  },
  "confidence": 0.85,
  "tags": ["actionable", "tags", "for", "categorization"]
}

Guidelines:
- Use plain English, avoid legal jargon
- Focus on practical business implications
- Set urgency based on potential impact and deadlines
- Include deadline dates when mentioned in the content
- Map to common document types: employment-contract, lease-agreement, privacy-policy, terms-of-service, etc.
- Confidence should reflect how actionable and clear the update is (0.0-1.0)`;
  }

  private validateAndTransformResult(result: any): SummarizationResult {
    // Transform deadline strings to Date objects
    if (result.actionItems) {
      result.actionItems = result.actionItems.map((item: any) => ({
        ...item,
        deadline: item.deadline ? new Date(item.deadline) : undefined,
      }));
    }

    if (result.compliance?.deadline) {
      result.compliance.deadline = new Date(result.compliance.deadline);
    }

    // Validate required fields
    if (
      !result.summary ||
      !result.keyPoints ||
      !Array.isArray(result.keyPoints)
    ) {
      throw new Error('Invalid summarization result structure');
    }

    // Ensure confidence is within bounds
    result.confidence = Math.max(0, Math.min(1, result.confidence || 0.5));

    return result as SummarizationResult;
  }

  private async saveProcessedUpdate(
    update: ProcessedLegalUpdate,
  ): Promise<void> {
    try {
      await adminDb
        .collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES)
        .doc(update.id)
        .set(update);
    } catch (error) {
      console.error('Failed to save processed update:', error);
      throw error;
    }
  }

  private async updateRawUpdateStatus(
    rawUpdateId: string,
    status: 'processed' | 'failed',
  ): Promise<void> {
    try {
      await adminDb
        .collection(COLLECTIONS.RAW_LEGAL_UPDATES)
        .doc(rawUpdateId)
        .update({ status });
    } catch (error) {
      console.error('Failed to update raw update status:', error);
    }
  }

  async processPendingUpdates(): Promise<{
    processed: number;
    failed: number;
    results: Array<{
      id: string;
      title: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const results = {
      processed: 0,
      failed: 0,
      results: [] as any[],
    };

    try {
      // Get pending raw updates
      const pendingSnapshot = await adminDb
        .collection(COLLECTIONS.RAW_LEGAL_UPDATES)
        .where('status', '==', 'pending')
        .orderBy('publishedDate', 'desc')
        .limit(20) // Process in batches
        .get();

      console.log(
        `Found ${pendingSnapshot.docs.length} pending updates to process`,
      );

      for (const doc of pendingSnapshot.docs) {
        const rawUpdate = { id: doc.id, ...doc.data() } as RawLegalUpdate;

        try {
          // Get source information
          const sourceDoc = await adminDb
            .collection(COLLECTIONS.LEGAL_UPDATE_SOURCES)
            .doc(rawUpdate.sourceId)
            .get();

          if (!sourceDoc.exists) {
            throw new Error(`Source ${rawUpdate.sourceId} not found`);
          }

          const source = {
            id: sourceDoc.id,
            ...sourceDoc.data(),
          } as LegalUpdateSource;
          const processedUpdate = await this.processRawUpdate(
            rawUpdate,
            source,
          );

          if (processedUpdate) {
            results.processed++;
            results.results.push({
              id: rawUpdate.id,
              title: rawUpdate.title,
              success: true,
            });
          } else {
            results.failed++;
            results.results.push({
              id: rawUpdate.id,
              title: rawUpdate.title,
              success: false,
              error: 'Processing failed',
            });
          }
        } catch (error) {
          results.failed++;
          results.results.push({
            id: rawUpdate.id,
            title: rawUpdate.title,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          console.error(`Failed to process update ${rawUpdate.id}:`, error);
        }

        // Add delay between API calls to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Error processing pending updates:', error);
      throw error;
    }

    console.log(
      `Processing complete: ${results.processed} successful, ${results.failed} failed`,
    );
    return results;
  }

  async reprocessUpdate(
    updateId: string,
  ): Promise<ProcessedLegalUpdate | null> {
    try {
      // Get the raw update
      const rawDoc = await adminDb
        .collection(COLLECTIONS.RAW_LEGAL_UPDATES)
        .doc(updateId)
        .get();

      if (!rawDoc.exists) {
        throw new Error(`Raw update ${updateId} not found`);
      }

      const rawUpdate = { id: rawDoc.id, ...rawDoc.data() } as RawLegalUpdate;

      // Get source information
      const sourceDoc = await adminDb
        .collection(COLLECTIONS.LEGAL_UPDATE_SOURCES)
        .doc(rawUpdate.sourceId)
        .get();

      if (!sourceDoc.exists) {
        throw new Error(`Source ${rawUpdate.sourceId} not found`);
      }

      const source = {
        id: sourceDoc.id,
        ...sourceDoc.data(),
      } as LegalUpdateSource;

      // Reprocess
      return await this.processRawUpdate(rawUpdate, source);
    } catch (error) {
      console.error(`Error reprocessing update ${updateId}:`, error);
      return null;
    }
  }
}

export const legalUpdateAISummarizer = new LegalUpdateAISummarizer();
