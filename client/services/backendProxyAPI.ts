/**
 * Backend Proxy API Service
 * Calls the backend server which then calls AudienceLab API
 * This bypasses CORS issues by using server-to-server communication
 */

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
 * Enrich contacts via backend proxy
 * The backend server calls AudienceLab API with proper authentication
 */
export async function enrichContactsViaBackend(
  emails: string[],
  fields: string[],
  concurrency: number = 5,
  batchSize: number = 100,
  onProgress?: (progress: ProgressData) => void,
  onBatchComplete?: (batchIndex: number, contacts: EnrichmentContact[], usage: BatchUsage) => void
): Promise<EnrichmentContact[]> {
  
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
          console.log(`📦 Processing batch ${actualBatchIndex + 1}/${totalBatches} via backend...`);
          
          // Call backend API proxy endpoint
          const response = await fetch('/api/trpc/audienceLab.enrichContacts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              emails: batch,
              fields: fields,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Batch ${actualBatchIndex + 1} failed:`, response.status, errorText);
            throw new Error(`Backend API error: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          const result = data.result?.data;
          
          if (!result) {
            throw new Error('Invalid response format from backend');
          }

          const contacts = result.data || [];
          const usage = result.usage || { credits_used: 0, emails_processed: batch.length };

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

          console.log(`✅ Batch ${actualBatchIndex + 1} complete: ${contacts.length} contacts enriched`);
          return contacts;
        } catch (error) {
          console.error(`❌ Batch ${actualBatchIndex + 1} failed:`, error);
          // Return empty array for failed batch instead of throwing
          return [];
        }
      });

    const batchResults = await Promise.all(batchPromises);
    allResults.push(...batchResults.flat());
  }

  console.log(`🎉 All batches complete! Total enriched: ${allResults.length}`);
  return allResults;
}

