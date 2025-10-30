/**
 * Real AudienceLab API Integration
 * Calls the actual AudienceLab API with user's API key
 */

const API_KEY = import.meta.env.VITE_AUDIENCELAB_API_KEY || '';
const API_BASE_URL = 'https://api.audiencelab.io';

interface EnrichmentContact {
  email: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  company?: string;
  company_domain?: string;
  [key: string]: unknown;
}

interface ProgressData {
  completed: number;
  total: number;
  percentage: number;
  currentBatch: number;
  totalBatches: number;
}

interface BatchUsage {
  credits_used: number;
  emails_processed: number;
}

/**
 * Enrich contacts using real AudienceLab API
 * Processes in batches with progress tracking
 */
export async function enrichContactsWithRealAPI(
  emails: string[],
  fields: string[],
  concurrency: number = 5,
  batchSize: number = 100,
  onProgress?: (progress: ProgressData) => void,
  onBatchComplete?: (batchIndex: number, contacts: EnrichmentContact[], usage: BatchUsage) => void
): Promise<EnrichmentContact[]> {
  
  if (!API_KEY) {
    throw new Error('API key not found. Please set VITE_AUDIENCELAB_API_KEY in .env.local');
  }

  // Split emails into batches
  const batches: string[][] = [];
  for (let i = 0; i < emails.length; i += batchSize) {
    batches.push(emails.slice(i, i + batchSize));
  }

  const totalBatches = batches.length;
  let completed = 0;
  const allResults: EnrichmentContact[] = [];

  // Process batches with concurrency control
  for (let i = 0; i < batches.length; i += concurrency) {
    const batchPromises = batches
      .slice(i, i + concurrency)
      .map(async (batch, batchIndex) => {
        const actualBatchIndex = i + batchIndex;
        
        try {
          console.log(`Processing batch ${actualBatchIndex + 1}/${totalBatches}...`);
          
          // Call AudienceLab API
          const response = await fetch(`${API_BASE_URL}/enrich/v1/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
              emails: batch,
              fields: fields,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Batch ${actualBatchIndex} failed:`, response.status, errorText);
            throw new Error(`API error: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          const contacts = data.data || [];
          const usage = data.usage || { credits_used: 0, emails_processed: batch.length };

          completed += batch.length;
          
          // Report progress
          if (onProgress) {
            onProgress({
              completed,
              total: emails.length,
              percentage: Math.round((completed / emails.length) * 100),
              currentBatch: actualBatchIndex + 1,
              totalBatches,
            });
          }

          // Report batch completion
          if (onBatchComplete) {
            onBatchComplete(actualBatchIndex, contacts, usage);
          }

          return contacts;
        } catch (error) {
          console.error(`Batch ${actualBatchIndex} failed:`, error);
          // Return empty array for failed batch instead of throwing
          return [];
        }
      });

    const batchResults = await Promise.all(batchPromises);
    allResults.push(...batchResults.flat());
  }

  return allResults;
}

