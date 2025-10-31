import type { VercelRequest, VercelResponse } from '@vercel/node';

const AUDIENCELAB_API_KEY = process.env.AUDIENCELAB_API_KEY;
const AUDIENCELAB_API_URL = 'https://api.audiencelab.io/v1';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!AUDIENCELAB_API_KEY) {
    console.error('API key not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { endpoint, method = 'POST', body } = req.body;

  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  try {
    const apiUrl = `${AUDIENCELAB_API_URL}${endpoint}`;
    
    console.log('Calling AudienceLab API:', { apiUrl, method, bodySize: body ? JSON.stringify(body).length : 0 });
    
    const response = await fetch(apiUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': AUDIENCELAB_API_KEY,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log('AudienceLab API response:', { status: response.status, statusText: response.statusText });

    // Get response text first
    const responseText = await response.text();
    console.log('Response text (first 200 chars):', responseText.substring(0, 200));

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      return res.status(500).json({
        error: 'Invalid API response',
        message: 'API returned non-JSON response',
        responsePreview: responseText.substring(0, 500),
      });
    }

    if (!response.ok) {
      console.error('API request failed:', data);
      return res.status(response.status).json({
        error: data.error || 'API request failed',
        details: data,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('AudienceLab API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

