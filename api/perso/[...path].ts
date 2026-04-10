import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path, ...queryParams } = req.query;
  const persoPath = Array.isArray(path) ? path.join('/') : path || '';
  const baseUrl = process.env.PERSO_API_BASE_URL || 'https://api.perso.ai';
  const apiKey = process.env.XP_API_KEY;

  // Build query string from remaining params (excluding 'path')
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    const v = Array.isArray(value) ? value[0] : value;
    if (v) qs.append(key, v);
  }
  const qsStr = qs.toString();
  const fullUrl = qsStr ? `${baseUrl}/${persoPath}?${qsStr}` : `${baseUrl}/${persoPath}`;

  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['XP-API-KEY'] = apiKey;
  }
  if (req.headers['content-type']) {
    headers['Content-Type'] = req.headers['content-type'];
  }

  try {
    const fetchOptions: RequestInit = {
      method: req.method || 'GET',
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(fullUrl, fetchOptions);
    const data = await response.text();

    res.status(response.status);
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    res.send(data);
  } catch (e) {
    res.status(502).json({ error: e instanceof Error ? e.message : 'Proxy error' });
  }
}
