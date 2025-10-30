
/**
 * AudienceLab API Service
 * 
 * Handles all API communication with the AudienceLab platform
 * Base URL: https://api.audiencelab.io
 */

const API_BASE = 'https://api.audiencelab.io';

export interface EnrichmentRequest {
    emails: string[];
    columns?: string[];
    page_size?: number;
    cursor?: string;
}

export interface EnrichmentResponse {
    data: {
        contacts: any[];
        cursor?: string;
        has_more: boolean;
    };
    usage: {
        records_used_hour: number;
        records_limit_hour: number;
        records_used_day: number;
        records_limit_day: number;
        records_used_month: number;
        records_limit_month: number;
    };
}

export interface APIError {
    error: {
        code: string;
        message: string;
        details?: any;
    };
}

/**
 * Get API key from environment or localStorage
 */
function getAPIKey(): string {
    // Try environment variable first (for production)
    if (import.meta.env.VITE_AUDIENCELAB_API_KEY) {
        return import.meta.env.VITE_AUDIENCELAB_API_KEY;
    }
    
    // Fall back to localStorage (for development/testing)
    const storedKey = localStorage.getItem('audiencelab_api_key');
    if (storedKey) {
        return storedKey;
    }
    
    throw new Error('API key not found. Please set VITE_AUDIENCELAB_API_KEY or configure in settings.');
}

/**
 * Make an API request with proper headers and error handling
 */
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const apiKey = getAPIKey();
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'X-API-Key': apiKey,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error: APIError = await response.json();
        throw new Error(error.error.message || `API Error: ${response.status}`);
    }

    return response.json();
}

/**
 * Enrich a batch of contacts
 * 
 * @param emails - Array of email addresses (max 1,000)
 * @param fields - Array of field IDs to enrich
 * @returns Enrichment response with contacts and usage data
 */
export async function enrichContacts(
    emails: string[],
    fields: string[]
): Promise<EnrichmentResponse> {
    if (emails.length > 1000) {
        throw new Error('Maximum batch size is 1,000 emails');
    }

    const response = await apiRequest<EnrichmentResponse>('/enrich/v1/query', {
        method: 'POST',
        body: JSON.stringify({
            emails,
            columns: fields,
            page_size: 100,
        }),
    });

    return response;
}

/**
 * Enrich contacts with pagination support
 * 
 * @param emails - Array of email addresses
 * @param fields - Array of field IDs to enrich
 * @param onProgress - Callback for progress updates
 * @returns All enriched contacts
 */
export async function enrichContactsWithPagination(
    emails: string[],
    fields: string[],
    onProgress?: (current: number, total: number) => void
): Promise<any[]> {
    const allContacts: any[] = [];
    let cursor: string | undefined;
    let page = 0;
    const totalPages = Math.ceil(emails.length / 100);

    do {
        const response = await apiRequest<EnrichmentResponse>('/enrich/v1/query', {
            method: 'POST',
            body: JSON.stringify({
                emails: emails.slice(page * 100, (page + 1) * 100),
                columns: fields,
                page_size: 100,
                cursor,
            }),
        });

        allContacts.push(...response.data.contacts);
        cursor = response.data.cursor;
        page++;

        if (onProgress) {
            onProgress(page, totalPages);
        }
    } while (cursor);

    return allContacts;
}

/**
 * Enrich contacts in parallel batches
 * 
 * @param emails - Array of email addresses
 * @param fields - Array of field IDs to enrich
 * @param concurrency - Number of parallel batches (1-20)
 * @param batchSize - Emails per batch (100-1000)
 * @param onProgress - Callback for progress updates
 * @param onBatchComplete - Callback when a batch completes
 * @returns All enriched contacts
 */
export async function enrichContactsParallel(
    emails: string[],
    fields: string[],
    concurrency: number = 5,
    batchSize: number = 1000,
    onProgress?: (progress: {
        totalBatches: number;
        completedBatches: number;
        totalEmails: number;
        processedEmails: number;
        percentage: number;
        creditsUsed: number;
    }) => void,
    onBatchComplete?: (batchIndex: number, contacts: any[], usage: any) => void
): Promise<any[]> {
    // Validate parameters
    if (concurrency < 1 || concurrency > 20) {
        throw new Error('Concurrency must be between 1 and 20');
    }
    if (batchSize < 100 || batchSize > 1000) {
        throw new Error('Batch size must be between 100 and 1,000');
    }

    // Split emails into batches
    const batches: string[][] = [];
    for (let i = 0; i < emails.length; i += batchSize) {
        batches.push(emails.slice(i, i + batchSize));
    }

    const allContacts: any[] = [];
    let completedBatches = 0;
    let processedEmails = 0;
    let creditsUsed = 0;

    // Process batches in parallel with concurrency limit
    for (let i = 0; i < batches.length; i += concurrency) {
        const batchGroup = batches.slice(i, i + concurrency);
        
        const results = await Promise.all(
            batchGroup.map(async (batch, index) => {
                const batchIndex = i + index;
                try {
                    const response = await enrichContacts(batch, fields);
                    
                    // Call batch complete callback
                    if (onBatchComplete) {
                        onBatchComplete(batchIndex, response.data.contacts, response.usage);
                    }

                    return {
                        contacts: response.data.contacts,
                        usage: response.usage,
                    };
                } catch (error) {
                    console.error(`Batch ${batchIndex} failed:`, error);
                    return {
                        contacts: [],
                        usage: null,
                        error,
                    };
                }
            })
        );

        // Aggregate results
        results.forEach((result) => {
            if (result.contacts) {
                allContacts.push(...result.contacts);
                processedEmails += result.contacts.length;
            }
            if (result.usage) {
                creditsUsed = result.usage.records_used_month;
            }
        });

        completedBatches += batchGroup.length;

        // Call progress callback
        if (onProgress) {
            onProgress({
                totalBatches: batches.length,
                completedBatches,
                totalEmails: emails.length,
                processedEmails,
                percentage: Math.round((completedBatches / batches.length) * 100),
                creditsUsed,
            });
        }

        // Add a small delay between batch groups to avoid rate limiting
        if (i + concurrency < batches.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    return allContacts;
}

/**
 * Get usage statistics
 */
export async function getUsageStats(): Promise<any> {
    return apiRequest('/usage/v1/stats', {
        method: 'GET',
    });
}

/**
 * Test API connection
 */
export async function testConnection(): Promise<boolean> {
    try {
        await apiRequest('/core/v1/audiences', {
            method: 'GET',
        });
        return true;
    } catch (error) {
        console.error('API connection test failed:', error);
        return false;
    }
}

export default {
    enrichContacts,
    enrichContactsWithPagination,
    enrichContactsParallel,
    getUsageStats,
    testConnection,
};

