/**
 * AudienceLab API Service - Job-Based Enrichment
 * 
 * Handles all API communication with the AudienceLab platform
 * Base URL: https://api.audiencelab.io
 * 
 * API uses asynchronous job-based processing:
 * 1. Submit enrichment job → Get job ID
 * 2. Poll for job status → Wait for completion
 * 3. Download results → Parse CSV
 */

// Use Vercel serverless function proxy to avoid CORS issues
const API_BASE = '/api/audiencelab';

export interface EnrichmentJob {
    id: string;
    name: string;
    status: 'IN_QUEUE' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    csv_url?: string;
    total: number;
    created_at: string;
}

export interface EnrichmentJobsResponse {
    total_records: number;
    page_size: number;
    page: number;
    total_pages: number;
    data: EnrichmentJob[];
}

export interface CreateJobRequest {
    name: string;
    operator?: 'OR' | 'AND';
    columns: string[];
    records: Record<string, any>[];
}

export interface CreateJobResponse {
    jobId: string;
    status: string;
}

export interface APIError {
    error: {
        code: string;
        message: string;
        details?: any;
    };
}

/**
 * Make an API request through Vercel serverless proxy
 */
async function apiRequest<T>(
    endpoint: string,
    method: string = 'POST',
    body?: any
): Promise<T> {
    // Call Vercel serverless function which proxies to AudienceLab API
    const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            endpoint,
            method,
            body,
        }),
    });

    if (!response.ok) {
        const error: APIError = await response.json();
        throw new Error(error.error?.message || `API Error: ${response.status}`);
    }

    return response.json();
}

/**
 * Create an enrichment job
 * 
 * @param name - Job name for tracking
 * @param records - Array of contact records with input fields
 * @param columns - Array of column names being provided (e.g., ['EMAIL', 'FIRST_NAME'])
 * @param operator - Match operator: 'OR' or 'AND'
 * @returns Job ID and initial status
 */
export async function createEnrichmentJob(
    name: string,
    records: Record<string, string>[],
    columns: string[],
    operator: 'OR' | 'AND' = 'OR'
): Promise<CreateJobResponse> {
    const request: CreateJobRequest = {
        name,
        operator,
        columns,
        records,
    };

    const response = await apiRequest<CreateJobResponse>(
        '/enrichments',
        'POST',
        request
    );

    return response;
}

/**
 * Get all enrichment jobs
 * 
 * @param page - Page number (1-indexed)
 * @param pageSize - Items per page (max 1000)
 * @returns List of enrichment jobs
 */
export async function getEnrichmentJobs(
    page: number = 1,
    pageSize: number = 100
): Promise<EnrichmentJobsResponse> {
    const response = await apiRequest<EnrichmentJobsResponse>(
        `/enrichments?page=${page}&page_size=${pageSize}`,
        'GET'
    );

    return response;
}

/**
 * Get a specific enrichment job by ID
 * 
 * @param jobId - Job ID to look up
 * @returns Job details
 */
export async function getEnrichmentJob(jobId: string): Promise<EnrichmentJob | null> {
    const response = await getEnrichmentJobs(1, 1000);
    const job = response.data.find(j => j.id === jobId);
    return job || null;
}

/**
 * Poll for job completion
 * 
 * @param jobId - Job ID to poll
 * @param onProgress - Callback for status updates
 * @param pollInterval - Polling interval in milliseconds (default: 2000ms)
 * @param maxAttempts - Maximum polling attempts (default: 300 = 10 minutes)
 * @returns Completed job details
 */
export async function pollJobCompletion(
    jobId: string,
    onProgress?: (job: EnrichmentJob) => void,
    pollInterval: number = 2000,
    maxAttempts: number = 300
): Promise<EnrichmentJob> {
    let attempts = 0;

    while (attempts < maxAttempts) {
        const job = await getEnrichmentJob(jobId);

        if (!job) {
            throw new Error(`Job ${jobId} not found`);
        }

        // Call progress callback
        if (onProgress) {
            onProgress(job);
        }

        // Check if job is complete
        if (job.status === 'COMPLETED') {
            return job;
        }

        if (job.status === 'FAILED') {
            throw new Error(`Job ${jobId} failed`);
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        attempts++;
    }

    throw new Error(`Job ${jobId} polling timeout after ${maxAttempts} attempts`);
}

/**
 * Download and parse CSV results from completed job
 * 
 * @param csvUrl - CSV URL from completed job
 * @returns Parsed contact records
 */
export async function downloadJobResults(csvUrl: string): Promise<any[]> {
    // Proxy the CSV download through our Vercel function to avoid CORS issues
    const proxyUrl = `/api/audiencelab?url=${encodeURIComponent(csvUrl)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
        throw new Error(`Failed to download results: ${response.status}`);
    }

    const csvText = await response.text();
    
    // Use proper CSV parser that handles quoted values and commas
    const { parseCSV } = await import('../utils/csvParser');
    const parsed = parseCSV(csvText);
    
    return parsed.data;
}

/**
 * Complete enrichment workflow: submit job, poll for completion, download results
 * 
 * @param name - Job name
 * @param records - Array of contact records with input fields
 * @param columns - Array of column names being provided
 * @param operator - Match operator: 'OR' or 'AND'
 * @param fields - Fields to enrich (kept for compatibility, not used)
 * @param onProgress - Progress callback
 * @returns Enriched contact records
 */
export async function enrichContactsJobBased(
    name: string,
    records: Record<string, string>[],
    columns: string[],
    operator: 'OR' | 'AND',
    fields: string[],
    onProgress?: (status: {
        stage: 'submitting' | 'polling' | 'downloading' | 'complete';
        job?: EnrichmentJob;
        progress?: number;
    }) => void
): Promise<any[]> {
    // Stage 1: Submit job
    if (onProgress) {
        onProgress({ stage: 'submitting', progress: 0 });
    }

    const { jobId } = await createEnrichmentJob(name, records, columns, operator);

    // Stage 2: Poll for completion
    if (onProgress) {
        onProgress({ stage: 'polling', progress: 10 });
    }

    const completedJob = await pollJobCompletion(
        jobId,
        (job) => {
            if (onProgress) {
                // Estimate progress based on status
                let progress = 10;
                if (job.status === 'PROCESSING') progress = 50;
                if (job.status === 'COMPLETED') progress = 90;
                
                onProgress({ stage: 'polling', job, progress });
            }
        }
    );

    // Stage 3: Download results
    if (onProgress) {
        onProgress({ stage: 'downloading', job: completedJob, progress: 90 });
    }

    if (!completedJob.csv_url) {
        throw new Error('Job completed but no CSV URL provided');
    }

    const results = await downloadJobResults(completedJob.csv_url);

    // Stage 4: Complete
    if (onProgress) {
        onProgress({ stage: 'complete', job: completedJob, progress: 100 });
    }

    return results;
}

/**
 * Get usage statistics (if available)
 */
export async function getUsageStats(): Promise<any> {
    return apiRequest('/usage/v1/stats', 'GET');
}

export default {
    createEnrichmentJob,
    getEnrichmentJobs,
    getEnrichmentJob,
    pollJobCompletion,
    downloadJobResults,
    enrichContactsJobBased,
    getUsageStats,
};

