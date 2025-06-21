// src/lib/legal-updates/rss-parser.ts
import Parser from 'rss-parser';
import { adminDb } from '@/lib/firebase-admin';
import { 
  LegalUpdateSource, 
  RawLegalUpdate, 
  createUpdateId,
  COLLECTIONS,
  RawLegalUpdateSchema 
} from './schema';

interface RSSItem {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  guid?: string;
  category?: string[];
  content?: string;
  contentSnippet?: string;
  author?: string;
  [key: string]: any;
}

interface ParsedFeed {
  title?: string;
  description?: string;
  link?: string;
  items: RSSItem[];
}

class LegalUpdateRSSParser {
  private parser: Parser<{}, RSSItem>;
  private readonly maxRetries = 3;
  private readonly timeoutMs = 30000;

  constructor() {
    this.parser = new Parser({
      timeout: this.timeoutMs,
      maxRedirects: 5,
      headers: {
        'User-Agent': '123LegalDoc Legal Update Service 1.0 (+https://123legaldoc.com)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      },
      customFields: {
        item: [
          ['dc:creator', 'author'],
          ['dc:date', 'dcDate'],
          ['content:encoded', 'contentEncoded'],
          ['media:content', 'mediaContent'],
          ['category', 'categories']
        ]
      }
    });
  }

  async fetchUpdatesFromSource(source: LegalUpdateSource): Promise<RawLegalUpdate[]> {
    try {
      console.log(`Fetching legal updates from: ${source.name} (${source.rssUrl})`);
      
      const feed = await this.parseRSSFeed(source.rssUrl);
      const updates: RawLegalUpdate[] = [];

      for (const item of feed.items) {
        try {
          const rawUpdate = await this.convertRSSItemToUpdate(item, source);
          if (rawUpdate && await this.shouldProcessUpdate(rawUpdate)) {
            updates.push(rawUpdate);
          }
        } catch (error) {
          console.error(`Error processing RSS item from ${source.name}:`, error);
          // Continue processing other items
        }
      }

      // Update source last fetched timestamp
      await this.updateSourceLastFetched(source.id);

      console.log(`Fetched ${updates.length} new legal updates from ${source.name}`);
      return updates;

    } catch (error) {
      console.error(`Error fetching updates from ${source.name}:`, error);
      throw new Error(`Failed to fetch updates from ${source.name}: ${error}`);
    }
  }

  private async parseRSSFeed(url: string): Promise<ParsedFeed> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const feed = await this.parser.parseURL(url);
        return feed;
      } catch (error) {
        lastError = error as Error;
        console.warn(`RSS fetch attempt ${attempt}/${this.maxRetries} failed for ${url}:`, error);
        
        if (attempt < this.maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Failed to parse RSS feed after all retries');
  }

  private async convertRSSItemToUpdate(
    item: RSSItem, 
    source: LegalUpdateSource
  ): Promise<RawLegalUpdate | null> {
    if (!item.title || !item.link) {
      console.warn('RSS item missing required fields (title/link), skipping');
      return null;
    }

    const publishedDate = this.parsePublishedDate(item.pubDate || item.dcDate);
    if (!publishedDate) {
      console.warn('RSS item missing valid published date, skipping');
      return null;
    }

    // Extract and clean content
    const content = item.contentEncoded || item.content || item.description || '';
    const description = item.contentSnippet || item.description || '';

    // Extract tags from categories and content
    const tags = this.extractTags(item, source);

    const rawUpdate: RawLegalUpdate = {
      id: createUpdateId(),
      sourceId: source.id,
      title: this.cleanText(item.title),
      description: this.cleanText(description),
      url: item.link,
      publishedDate,
      content: this.cleanText(content),
      tags,
      rawData: {
        originalItem: item,
        sourceMetadata: {
          name: source.name,
          jurisdiction: source.jurisdiction,
          type: source.type,
          category: source.category
        }
      },
      processedAt: new Date(),
      status: 'pending'
    };

    // Validate the schema
    try {
      RawLegalUpdateSchema.parse(rawUpdate);
      return rawUpdate;
    } catch (error) {
      console.error('Raw update failed schema validation:', error);
      return null;
    }
  }

  private parsePublishedDate(dateString?: string): Date | null {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  private extractTags(item: RSSItem, source: LegalUpdateSource): string[] {
    const tags = new Set<string>();

    // Add source-based tags
    tags.add(source.jurisdiction);
    tags.add(source.type);
    tags.add(source.category);

    // Add category tags from RSS item
    if (item.category) {
      if (Array.isArray(item.category)) {
        item.category.forEach(cat => tags.add(cat.toLowerCase()));
      } else {
        tags.add(item.category.toLowerCase());
      }
    }

    if (item.categories) {
      if (Array.isArray(item.categories)) {
        item.categories.forEach(cat => tags.add(cat.toLowerCase()));
      }
    }

    // Extract legal keywords from title and description
    const text = `${item.title} ${item.description}`.toLowerCase();
    const legalKeywords = [
      'regulation', 'law', 'statute', 'compliance', 'requirement',
      'deadline', 'filing', 'amendment', 'repeal', 'effective',
      'notice', 'rule', 'order', 'decision', 'judgment',
      'business', 'employment', 'tax', 'real estate', 'contract',
      'liability', 'disclosure', 'privacy', 'data', 'security'
    ];

    legalKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        tags.add(keyword);
      }
    });

    return Array.from(tags);
  }

  private cleanText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, ' ') // Remove HTML entities
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  private async shouldProcessUpdate(update: RawLegalUpdate): Promise<boolean> {
    // Check if we already have this update (by URL or title)
    const existingByUrl = await adminDb
      .collection(COLLECTIONS.RAW_LEGAL_UPDATES)
      .where('url', '==', update.url)
      .limit(1)
      .get();

    if (!existingByUrl.empty) {
      console.log(`Update already exists with URL: ${update.url}`);
      return false;
    }

    // Check by title and source (in case URL changes)
    const existingByTitle = await adminDb
      .collection(COLLECTIONS.RAW_LEGAL_UPDATES)
      .where('sourceId', '==', update.sourceId)
      .where('title', '==', update.title)
      .limit(1)
      .get();

    if (!existingByTitle.empty) {
      console.log(`Update already exists with title: ${update.title}`);
      return false;
    }

    // Check if update is too old (configurable threshold)
    const maxAge = 90; // days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAge);

    if (update.publishedDate < cutoffDate) {
      console.log(`Update too old: ${update.title} (${update.publishedDate})`);
      return false;
    }

    return true;
  }

  private async updateSourceLastFetched(sourceId: string): Promise<void> {
    try {
      await adminDb
        .collection(COLLECTIONS.LEGAL_UPDATE_SOURCES)
        .doc(sourceId)
        .update({
          lastFetched: new Date(),
          updatedAt: new Date()
        });
    } catch (error) {
      console.error(`Failed to update lastFetched for source ${sourceId}:`, error);
    }
  }

  async saveRawUpdates(updates: RawLegalUpdate[]): Promise<void> {
    if (updates.length === 0) return;

    const batch = adminDb.batch();
    
    updates.forEach(update => {
      const docRef = adminDb
        .collection(COLLECTIONS.RAW_LEGAL_UPDATES)
        .doc(update.id);
      batch.set(docRef, update);
    });

    try {
      await batch.commit();
      console.log(`Saved ${updates.length} raw legal updates to Firestore`);
    } catch (error) {
      console.error('Failed to save raw updates:', error);
      throw error;
    }
  }

  async fetchAllActiveSources(): Promise<LegalUpdateSource[]> {
    try {
      const snapshot = await adminDb
        .collection(COLLECTIONS.LEGAL_UPDATE_SOURCES)
        .where('isActive', '==', true)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LegalUpdateSource[];
    } catch (error) {
      console.error('Failed to fetch active sources:', error);
      throw error;
    }
  }

  async processAllSources(): Promise<{
    totalUpdates: number;
    sourceResults: Array<{
      sourceId: string;
      sourceName: string;
      updateCount: number;
      success: boolean;
      error?: string;
    }>;
  }> {
    const sources = await this.fetchAllActiveSources();
    const results = {
      totalUpdates: 0,
      sourceResults: [] as any[]
    };

    for (const source of sources) {
      try {
        const updates = await this.fetchUpdatesFromSource(source);
        await this.saveRawUpdates(updates);

        results.sourceResults.push({
          sourceId: source.id,
          sourceName: source.name,
          updateCount: updates.length,
          success: true
        });

        results.totalUpdates += updates.length;

      } catch (error) {
        console.error(`Failed to process source ${source.name}:`, error);
        results.sourceResults.push({
          sourceId: source.id,
          sourceName: source.name,
          updateCount: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }
}

export const legalUpdateRSSParser = new LegalUpdateRSSParser();