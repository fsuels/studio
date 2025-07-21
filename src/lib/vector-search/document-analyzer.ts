// src/lib/vector-search/document-analyzer.ts
import { getDocMeta } from '@/config/doc-meta';
import { embeddingService } from './embedding-service';
import { pineconeService } from './pinecone-service';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface DocumentAnalysis {
  docId: string;
  extractedText: string;
  entities: {
    parties: string[];
    amounts: string[];
    dates: string[];
    jurisdictions: string[];
    governingLaws: string[];
    keyTerms: string[];
  };
  metadata: {
    title: string;
    category: string;
    complexity: string;
    jurisdiction?: string;
    governingLaw?: string;
    createdAt: string;
    lastModified: string;
    tags: string[];
    wordCount: number;
    readingTime: number;
    documentType: string;
  };
  contentSections: {
    title: string;
    definitions: string;
    mainContent: string;
    clauses: string[];
    signatures: string;
  };
}

export class DocumentAnalyzer {
  private readonly templateBasePath: string;

  constructor() {
    this.templateBasePath = join(process.cwd(), 'public', 'templates');
  }

  /**
   * Analyze a single document and extract structured information
   */
  async analyzeDocument(
    docId: string,
    locale: 'en' | 'es' = 'en',
  ): Promise<DocumentAnalysis> {
    try {
      // Read document content
      const content = await this.readDocumentContent(docId, locale);

      // Get document metadata
      const meta = await getDocMeta(docId);
      if (!meta) {
        throw new Error(`No metadata found for document: ${docId}`);
      }

      // Extract text and analyze structure
      const extractedText = this.extractPlainText(content);
      const contentSections = this.extractContentSections(content);
      const entities = await this.extractEntities(extractedText);

      // Calculate additional metadata
      const wordCount = this.calculateWordCount(extractedText);
      const readingTime = this.estimateReadingTime(wordCount);
      const documentType = this.identifyDocumentType(
        extractedText,
        meta.category,
      );

      return {
        docId,
        extractedText,
        entities,
        metadata: {
          title: meta.title,
          category: meta.category,
          complexity: meta.complexity,
          jurisdiction: entities.jurisdictions[0], // Take primary jurisdiction
          governingLaw: entities.governingLaws[0], // Take primary governing law
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          tags: this.generateTags(extractedText, meta.category),
          wordCount,
          readingTime,
          documentType,
        },
        contentSections,
      };
    } catch (error) {
      console.error(`Error analyzing document ${docId}:`, error);
      throw error;
    }
  }

  /**
   * Process and index multiple documents
   */
  async processDocumentBatch(
    docIds: string[],
    locale: 'en' | 'es' = 'en',
    batchSize: number = 10,
  ): Promise<{
    successful: string[];
    failed: Array<{ docId: string; error: string }>;
  }> {
    const successful: string[] = [];
    const failed: Array<{ docId: string; error: string }> = [];

    // Process in batches to avoid overwhelming the API
    for (let i = 0; i < docIds.length; i += batchSize) {
      const batch = docIds.slice(i, i + batchSize);

      const batchResults = await Promise.allSettled(
        batch.map(async (docId) => {
          const analysis = await this.analyzeDocument(docId, locale);
          await this.indexDocumentAnalysis(analysis);
          return docId;
        }),
      );

      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successful.push(result.value);
        } else {
          failed.push({
            docId: batch[index],
            error: result.reason?.message || 'Unknown error',
          });
        }
      });

      // Rate limiting between batches
      if (i + batchSize < docIds.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    return { successful, failed };
  }

  /**
   * Index analyzed document in Pinecone
   */
  async indexDocumentAnalysis(analysis: DocumentAnalysis): Promise<void> {
    try {
      await pineconeService.indexDocument(
        analysis.docId,
        analysis.extractedText,
        {
          title: analysis.metadata.title,
          category: analysis.metadata.category,
          complexity: analysis.metadata.complexity,
          jurisdiction: analysis.metadata.jurisdiction,
          governingLaw: analysis.metadata.governingLaw,
          createdAt: analysis.metadata.createdAt,
          lastModified: analysis.metadata.lastModified,
          tags: analysis.metadata.tags,
          parties: analysis.entities.parties,
          amounts: analysis.entities.amounts,
          dates: analysis.entities.dates,
        },
      );

      console.log(`Successfully indexed document analysis: ${analysis.docId}`);
    } catch (error) {
      console.error(
        `Failed to index document analysis ${analysis.docId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Read document content from file system
   */
  private async readDocumentContent(
    docId: string,
    locale: 'en' | 'es',
  ): Promise<string> {
    try {
      const filePath = join(this.templateBasePath, locale, `${docId}.md`);
      return await readFile(filePath, 'utf-8');
    } catch (error) {
      throw new Error(
        `Failed to read document ${docId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Extract plain text from markdown content
   */
  private extractPlainText(content: string): string {
    // Remove markdown formatting
    let text = content
      .replace(/^#+\s*/gm, '') // Headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/`(.*?)`/g, '$1') // Code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
      .replace(/^[-*+]\s+/gm, '') // List items
      .replace(/^\d+\.\s+/gm, '') // Numbered lists
      .replace(/^>\s+/gm, '') // Quotes
      .replace(/\n{3,}/g, '\n\n') // Multiple newlines
      .trim();

    return text;
  }

  /**
   * Extract structured content sections
   */
  private extractContentSections(
    content: string,
  ): DocumentAnalysis['contentSections'] {
    const sections = {
      title: '',
      definitions: '',
      mainContent: '',
      clauses: [] as string[],
      signatures: '',
    };

    // Extract title (first header)
    const titleMatch = content.match(/^#\s*(.*?)$/m);
    if (titleMatch) {
      sections.title = titleMatch[1].trim();
    }

    // Extract definitions section
    const definitionsMatch = content.match(
      /##?\s*(?:definitions?|defined terms?)\s*\n(.*?)(?=\n##|\n#|$)/is,
    );
    if (definitionsMatch) {
      sections.definitions = definitionsMatch[1].trim();
    }

    // Extract clauses (numbered or lettered sections)
    const clauseMatches = content.match(
      /(?:^|\n)(?:\d+\.|\w\))\s+.*?(?=\n\d+\.|\n\w\)|$)/gis,
    );
    if (clauseMatches) {
      sections.clauses = clauseMatches
        .map((clause) => clause.trim())
        .filter(Boolean);
    }

    // Extract signature section
    const signatureMatch = content.match(
      /(?:signature|executed|witness|notary).*?$/is,
    );
    if (signatureMatch) {
      sections.signatures = signatureMatch[0].trim();
    }

    // Main content is everything else
    sections.mainContent = content
      .replace(titleMatch?.[0] || '', '')
      .replace(definitionsMatch?.[0] || '', '')
      .replace(signatureMatch?.[0] || '', '')
      .trim();

    return sections;
  }

  /**
   * Extract entities from document text
   */
  private async extractEntities(
    text: string,
  ): Promise<DocumentAnalysis['entities']> {
    const entities = {
      parties: [] as string[],
      amounts: [] as string[],
      dates: [] as string[],
      jurisdictions: [] as string[],
      governingLaws: [] as string[],
      keyTerms: [] as string[],
    };

    // Extract monetary amounts
    const amountRegex =
      /\$[\d,]+(?:\.\d{2})?|\b\d+(?:,\d{3})*(?:\.\d{2})?\s*dollars?\b/gi;
    const amounts = text.match(amountRegex);
    if (amounts) {
      entities.amounts = [...new Set(amounts.slice(0, 10))];
    }

    // Extract dates
    const dateRegex =
      /\b(?:\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/gi;
    const dates = text.match(dateRegex);
    if (dates) {
      entities.dates = [...new Set(dates.slice(0, 10))];
    }

    // Extract party names (companies, LLCs, etc.)
    const partyRegex =
      /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:LLC|Inc|Corp|Corporation|Company|Co\.|Ltd|Limited)\b/g;
    const parties = text.match(partyRegex);
    if (parties) {
      entities.parties = [...new Set(parties.slice(0, 10))];
    }

    // Extract jurisdictions
    const jurisdictionRegex =
      /\b(?:state of |province of )?(?:alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)\b/gi;
    const jurisdictions = text.match(jurisdictionRegex);
    if (jurisdictions) {
      entities.jurisdictions = [
        ...new Set(
          jurisdictions
            .slice(0, 5)
            .map((j) => j.replace(/^(state of |province of )/i, '').trim()),
        ),
      ];
    }

    // Extract governing law mentions
    const governingLawRegex =
      /governed by|subject to.*?law|laws of\s+([^,\n.]+)/gi;
    const governingLaws = text.match(governingLawRegex);
    if (governingLaws) {
      entities.governingLaws = [...new Set(governingLaws.slice(0, 5))];
    }

    // Extract key legal terms
    const keyTermRegex =
      /\b(?:contract|agreement|consideration|breach|damages|liability|indemnity|warranty|guarantee|covenant|term|condition|clause|provision|party|obligation|right|remedy|force majeure|arbitration|mediation|jurisdiction|venue)\b/gi;
    const keyTerms = text.match(keyTermRegex);
    if (keyTerms) {
      entities.keyTerms = [
        ...new Set(keyTerms.slice(0, 20).map((term) => term.toLowerCase())),
      ];
    }

    return entities;
  }

  /**
   * Generate tags based on content and category
   */
  private generateTags(text: string, category: string): string[] {
    const tags = new Set<string>();

    // Add category as base tag
    tags.add(category);

    // Common legal document tags
    const tagPatterns = {
      employment: /employment|employee|employer|job|work|salary|wage/i,
      'real-estate': /property|real estate|lease|rent|landlord|tenant/i,
      business: /business|company|corporation|LLC|partnership/i,
      contract: /contract|agreement|deal|terms|conditions/i,
      financial: /loan|money|payment|financial|bank|credit/i,
      'intellectual-property':
        /patent|trademark|copyright|IP|intellectual property/i,
      family: /family|marriage|divorce|custody|child|spouse/i,
      'estate-planning': /will|estate|trust|inheritance|beneficiary/i,
      liability: /liability|indemnity|insurance|risk|damages/i,
      compliance: /compliance|regulation|law|legal|statute/i,
    };

    // Check text against patterns
    Object.entries(tagPatterns).forEach(([tag, pattern]) => {
      if (pattern.test(text)) {
        tags.add(tag);
      }
    });

    // Add complexity-based tags
    const wordCount = this.calculateWordCount(text);
    if (wordCount < 500) {
      tags.add('simple');
    } else if (wordCount > 2000) {
      tags.add('comprehensive');
    }

    // Add urgency tags based on common terms
    if (/urgent|immediate|emergency|asap/i.test(text)) {
      tags.add('urgent');
    }

    if (/template|form|blank/i.test(text)) {
      tags.add('template');
    }

    return Array.from(tags).slice(0, 10);
  }

  /**
   * Calculate word count
   */
  private calculateWordCount(text: string): number {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  /**
   * Estimate reading time in minutes
   */
  private estimateReadingTime(wordCount: number): number {
    const wordsPerMinute = 200; // Average reading speed
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Identify document type based on content and category
   */
  private identifyDocumentType(text: string, category: string): string {
    const typePatterns = {
      agreement: /agreement|contract|deal/i,
      notice: /notice|notification|inform/i,
      application: /application|apply|request/i,
      letter: /letter|correspondence|communication/i,
      form: /form|template|blank|fill/i,
      policy: /policy|procedure|guideline/i,
      waiver: /waiver|release|discharge/i,
      affidavit: /affidavit|sworn|declare under oath/i,
      deed: /deed|convey|transfer|grant/i,
      will: /will|testament|bequest|inherit/i,
    };

    // Check text against patterns
    for (const [type, pattern] of Object.entries(typePatterns)) {
      if (pattern.test(text)) {
        return type;
      }
    }

    // Fallback to category
    return category.replace(/-/g, ' ');
  }

  /**
   * Get all available document IDs for processing
   */
  async getAllDocumentIds(locale: 'en' | 'es' = 'en'): Promise<string[]> {
    try {
      const templateDir = join(this.templateBasePath, locale);
      const files = await readdir(templateDir);

      return files
        .filter((file) => file.endsWith('.md'))
        .map((file) => file.replace('.md', ''));
    } catch (error) {
      console.error(`Error reading template directory for ${locale}:`, error);
      return [];
    }
  }

  /**
   * Check if document needs reprocessing
   */
  async needsReprocessing(
    docId: string,
    locale: 'en' | 'es' = 'en',
  ): Promise<boolean> {
    try {
      // Check if document exists in Pinecone
      const stats = await pineconeService.getIndexStats();

      // This is a simplified check - in production, you'd compare
      // file modification times, version numbers, etc.
      return true; // For now, always reprocess
    } catch (error) {
      return true; // If we can't check, assume it needs processing
    }
  }
}

export const documentAnalyzer = new DocumentAnalyzer();
