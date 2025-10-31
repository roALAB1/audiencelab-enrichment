/**
 * Vercel Serverless Function - AudienceLab API Proxy
 * 
 * Proxies requests to the AudienceLab API to avoid CORS issues
 * Supports job-based enrichment workflow
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const AUDIENCELAB_API_BASE = 'https://api.audiencelab.io';
const API_KEY = process.env.AUDIENCELAB_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests (our proxy uses POST to send endpoint/method/body)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Only POST requests are allowed' } });
    }

    // Check API key
    if (!API_KEY) {
        console.error('AUDIENCELAB_API_KEY not configured');
        return res.status(500).json({ 
            error: { 
                code: 'CONFIG_ERROR', 
                message: 'API key not configured' 
            } 
        });
    }

    try {
        // Parse request body
        const { endpoint, method = 'POST', body } = req.body;

        if (!endpoint) {
            return res.status(400).json({ 
                error: { 
                    code: 'MISSING_ENDPOINT', 
                    message: 'Endpoint parameter is required' 
                } 
            });
        }

        // Build full URL
        const url = `${AUDIENCELAB_API_BASE}${endpoint}`;

        console.log(`[AudienceLab Proxy] ${method} ${url}`);

        // Make request to AudienceLab API
        const fetchOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': API_KEY,
            },
        };

        // Add body for POST requests
        if (method === 'POST' && body) {
            fetchOptions.body = JSON.stringify(body);
            console.log(`[AudienceLab Proxy] Request body size: ${JSON.stringify(body).length} bytes`);
        }

        const response = await fetch(url, fetchOptions);

        // Get response text first
        const responseText = await response.text();

        console.log(`[AudienceLab Proxy] Response status: ${response.status}`);
        console.log(`[AudienceLab Proxy] Response preview: ${responseText.substring(0, 200)}`);

        // Try to parse as JSON
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (parseError) {
            console.error('[AudienceLab Proxy] JSON parse error:', parseError);
            return res.status(500).json({ 
                error: { 
                    code: 'PARSE_ERROR', 
                    message: 'Failed to parse API response',
                    details: {
                        status: response.status,
                        preview: responseText.substring(0, 500)
                    }
                } 
            });
        }

        // Forward the response
        if (!response.ok) {
            console.error('[AudienceLab Proxy] API error:', responseData);
            return res.status(response.status).json({ 
                error: { 
                    code: 'API_ERROR', 
                    message: responseData.message || 'AudienceLab API error',
                    details: responseData
                } 
            });
        }

        // Success
        return res.status(response.status).json(responseData);

    } catch (error) {
        console.error('[AudienceLab Proxy] Unexpected error:', error);
        
        return res.status(500).json({ 
            error: { 
                code: 'INTERNAL_ERROR', 
                message: error instanceof Error ? error.message : 'Internal server error',
                details: error instanceof Error ? error.stack : undefined
            } 
        });
    }
}

