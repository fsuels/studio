// src/lib/vector-search/export-service.ts
import { stringify } from 'csv-stringify/sync';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import pineconeService, {
  type SearchFilters,
  type SearchResult,
} from './pinecone-service';

interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  includeContent?: boolean;
  includeMetadata?: boolean;
  includeFacets?: boolean;
  maxResults?: number;
  customFields?: string[];
  groupBy?: 'category' | 'jurisdiction' | 'complexity' | 'none';
  sortBy?: 'relevance' | 'date' | 'title' | 'category';
  sortOrder?: 'asc' | 'desc';
}

interface ExportJob {
  id: string;
  userId: string;
  query: string;
  filters?: SearchFilters;
  options: ExportOptions;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalResults: number;
  downloadUrl?: string;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
  estimatedTime?: string;
}

interface ExportResult {
  data: Array<Record<string, unknown>>;
  metadata: {
    totalResults: number;
    exportedAt: string;
    query: string;
    filters?: SearchFilters;
    options: ExportOptions;
  };
  facets?: Record<string, unknown>;
}

export class ExportService {
  private readonly exportDir: string;
  private jobs: Map<string, ExportJob> = new Map();

  constructor() {
    this.exportDir = join(process.cwd(), 'temp', 'exports');
    this.ensureExportDirectory();
  }

  /**
   * Create a new export job
   */
  async createExportJob(
    userId: string,
    query: string,
    filters?: SearchFilters,
    options: ExportOptions = { format: 'csv' },
  ): Promise<ExportJob> {
    const jobId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const job: ExportJob = {
      id: jobId,
      userId,
      query,
      filters,
      options: {
        format: 'csv',
        includeContent: true,
        includeMetadata: true,
        includeFacets: false,
        maxResults: 10000,
        groupBy: 'none',
        sortBy: 'relevance',
        sortOrder: 'desc',
        ...options,
      },
      status: 'pending',
      progress: 0,
      totalResults: 0,
      createdAt: new Date().toISOString(),
      estimatedTime: this.estimateExportTime(options.maxResults || 1000),
    };

    this.jobs.set(jobId, job);

    // Start processing asynchronously
    this.processExportJob(jobId).catch((error) => {
      console.error(`Export job ${jobId} failed:`, error);
      this.updateJobStatus(jobId, 'failed', undefined, error.message);
    });

    return job;
  }

  /**
   * Get export job status
   */
  getExportJob(jobId: string): ExportJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all export jobs for a user
   */
  getUserExportJobs(userId: string): ExportJob[] {
    return Array.from(this.jobs.values())
      .filter((job) => job.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  /**
   * Process export job
   */
  private async processExportJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    try {
      this.updateJobStatus(jobId, 'processing', 10);

      // Perform search with high limit for export
      const searchOptions = {
        topK: job.options.maxResults || 10000,
        minScore: 0.5, // Lower threshold for exports
        includeMetadata: true,
        includeFacets: job.options.includeFacets,
      };

      this.updateJobStatus(jobId, 'processing', 30);

      const searchResponse = await pineconeService.semanticSearch(
        job.query,
        job.filters,
        searchOptions,
      );

      this.updateJobStatus(jobId, 'processing', 60);

      // Sort and group results
      const processedResults = this.processSearchResults(
        searchResponse.results,
        job.options,
      );

      job.totalResults = processedResults.length;
      this.updateJobStatus(jobId, 'processing', 80);

      // Generate export file
      const exportResult: ExportResult = {
        data: processedResults,
        metadata: {
          totalResults: job.totalResults,
          exportedAt: new Date().toISOString(),
          query: job.query,
          filters: job.filters,
          options: job.options,
        },
        facets: job.options.includeFacets ? searchResponse.facets : undefined,
      };

      const downloadUrl = await this.generateExportFile(jobId, exportResult);

      this.updateJobStatus(jobId, 'completed', 100, undefined, downloadUrl);
    } catch (error) {
      console.error(`Export job ${jobId} processing failed:`, error);
      this.updateJobStatus(
        jobId,
        'failed',
        undefined,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  /**
   * Process and transform search results for export
   */
  private processSearchResults(
    results: SearchResult[],
    options: ExportOptions,
  ): Array<Record<string, unknown>> {
    const processedResults = [...results];

    // Sort results
    if (options.sortBy && options.sortBy !== 'relevance') {
      processedResults.sort((a, b) => {
        let aValue: number | string;
        let bValue: number | string;

        switch (options.sortBy) {
          case 'date':
            aValue = new Date(a.metadata.createdAt).getTime();
            bValue = new Date(b.metadata.createdAt).getTime();
            break;
          case 'title':
            aValue = a.metadata.title.toLowerCase();
            bValue = b.metadata.title.toLowerCase();
            break;
          case 'category':
            aValue = a.metadata.category.toLowerCase();
            bValue = b.metadata.category.toLowerCase();
            break;
          default:
            return 0;
        }

        if (options.sortOrder === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
      });
    }

    // Transform results based on export options
    return processedResults.map((result) => {
      const exportRow: Record<string, unknown> = {
        'Document ID': result.id,
        'Relevance Score': result.score.toFixed(3),
      };

      if (options.includeMetadata) {
        exportRow['Title'] = result.metadata.title;
        exportRow['Category'] = result.metadata.category;
        exportRow['Complexity'] = result.metadata.complexity;
        exportRow['Jurisdiction'] = result.metadata.jurisdiction || '';
        exportRow['Governing Law'] = result.metadata.governingLaw || '';
        exportRow['Created Date'] = result.metadata.createdAt;
        exportRow['Last Modified'] = result.metadata.lastModified;
        exportRow['Tags'] = Array.isArray(result.metadata.tags)
          ? result.metadata.tags.join('; ')
          : '';
        exportRow['Parties'] = Array.isArray(result.metadata.parties)
          ? result.metadata.parties.join('; ')
          : '';
        exportRow['Amounts'] = Array.isArray(result.metadata.amounts)
          ? result.metadata.amounts.join('; ')
          : '';
        exportRow['Key Dates'] = Array.isArray(result.metadata.dates)
          ? result.metadata.dates.join('; ')
          : '';
        exportRow['Match Explanation'] = result.explanation || '';
      }

      if (options.includeContent) {
        exportRow['Content Preview'] =
          result.metadata.content?.slice(0, 500) + '...' || '';
      }

      // Add custom fields if specified
      if (options.customFields) {
        options.customFields.forEach((field) => {
          if (result.metadata[field] !== undefined) {
            exportRow[field] = result.metadata[field];
          }
        });
      }

      return exportRow;
    });
  }

  /**
   * Generate export file
   */
  private async generateExportFile(
    jobId: string,
    exportResult: ExportResult,
  ): Promise<string> {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error('Job not found');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `search-export-${jobId}-${timestamp}.${job.options.format}`;
    const filepath = join(this.exportDir, filename);

    switch (job.options.format) {
      case 'csv':
        await this.generateCSVFile(filepath, exportResult);
        break;
      case 'json':
        await this.generateJSONFile(filepath, exportResult);
        break;
      case 'xlsx':
        await this.generateXLSXFile(filepath, exportResult);
        break;
      default:
        throw new Error(`Unsupported export format: ${job.options.format}`);
    }

    // Return download URL (in production, this would be a signed URL or CDN link)
    return `/api/exports/download/${filename}`;
  }

  /**
   * Generate CSV file
   */
  private async generateCSVFile(
    filepath: string,
    exportResult: ExportResult,
  ): Promise<void> {
    const csvContent = stringify(exportResult.data, {
      header: true,
      quoted: true,
      quotedString: true,
    });

    await writeFile(filepath, csvContent, 'utf-8');
  }

  /**
   * Generate JSON file
   */
  private async generateJSONFile(
    filepath: string,
    exportResult: ExportResult,
  ): Promise<void> {
    const jsonContent = JSON.stringify(exportResult, null, 2);
    await writeFile(filepath, jsonContent, 'utf-8');
  }

  /**
   * Generate XLSX file (placeholder - would need xlsx library)
   */
  private async generateXLSXFile(
    filepath: string,
    exportResult: ExportResult,
  ): Promise<void> {
    // For now, generate CSV as fallback
    // In production, implement with xlsx library
    await this.generateCSVFile(filepath.replace('.xlsx', '.csv'), exportResult);
  }

  /**
   * Update job status
   */
  private updateJobStatus(
    jobId: string,
    status: ExportJob['status'],
    progress?: number,
    errorMessage?: string,
    downloadUrl?: string,
  ): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = status;
    if (progress !== undefined) job.progress = progress;
    if (errorMessage) job.errorMessage = errorMessage;
    if (downloadUrl) job.downloadUrl = downloadUrl;
    if (status === 'completed' || status === 'failed') {
      job.completedAt = new Date().toISOString();
    }

    this.jobs.set(jobId, job);
  }

  /**
   * Estimate export time based on result count
   */
  private estimateExportTime(maxResults: number): string {
    if (maxResults <= 100) return '30 seconds';
    if (maxResults <= 1000) return '2-3 minutes';
    if (maxResults <= 5000) return '5-8 minutes';
    return '10-15 minutes';
  }

  /**
   * Ensure export directory exists
   */
  private async ensureExportDirectory(): Promise<void> {
    try {
      await mkdir(this.exportDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create export directory:', error);
    }
  }

  /**
   * Cleanup old export files (run periodically)
   */
  async cleanupOldExports(maxAgeHours: number = 24): Promise<void> {
    const cutoffTime = Date.now() - maxAgeHours * 60 * 60 * 1000;

    // Remove old jobs from memory
    for (const [jobId, job] of this.jobs.entries()) {
      const jobTime = new Date(job.createdAt).getTime();
      if (jobTime < cutoffTime) {
        this.jobs.delete(jobId);
      }
    }

    // TODO: Also cleanup physical files from disk
    console.log(`Cleaned up export jobs older than ${maxAgeHours} hours`);
  }

  /**
   * Get export statistics
   */
  getExportStats(): {
    totalJobs: number;
    completedJobs: number;
    failedJobs: number;
    pendingJobs: number;
    averageExportSize: number;
  } {
    const allJobs = Array.from(this.jobs.values());

    return {
      totalJobs: allJobs.length,
      completedJobs: allJobs.filter((job) => job.status === 'completed').length,
      failedJobs: allJobs.filter((job) => job.status === 'failed').length,
      pendingJobs: allJobs.filter(
        (job) => job.status === 'pending' || job.status === 'processing',
      ).length,
      averageExportSize:
        allJobs.reduce((sum, job) => sum + job.totalResults, 0) /
          allJobs.length || 0,
    };
  }
}

export const exportService = new ExportService();
