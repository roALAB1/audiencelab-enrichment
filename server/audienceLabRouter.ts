import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';

const AUDIENCELAB_API_URL = 'https://api.audiencelab.io/enrich/v1/query';
const API_KEY = process.env.VITE_AUDIENCELAB_API_KEY || '';

interface EnrichmentContact {
  email: string;
  [key: string]: unknown;
}

interface EnrichmentResponse {
  data: EnrichmentContact[];
  usage: {
    credits_used: number;
    emails_processed: number;
  };
}

/**
 * Proxy endpoint for AudienceLab API to solve CORS issues
 * Calls the real AudienceLab API from the backend
 */
export const audienceLabRouter = router({
  enrichContacts: publicProcedure
    .input(
      z.object({
        emails: z.array(z.string().email()),
        fields: z.array(z.string()),
      })
    )
    .mutation(async ({ input }): Promise<EnrichmentResponse> => {
      const { emails, fields } = input;

      if (!API_KEY) {
        throw new Error('AudienceLab API key not configured');
      }

      try {
        const response = await fetch(AUDIENCELAB_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            emails,
            fields,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`AudienceLab API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data as EnrichmentResponse;
      } catch (error) {
        console.error('AudienceLab API proxy error:', error);
        throw error;
      }
    }),
});

