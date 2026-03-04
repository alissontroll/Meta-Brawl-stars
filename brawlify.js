export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  const endpoint = Array.isArray(path) ? path.join('/') : (path || 'brawlers');

  try {
    const response = await fetch(`https://api.brawlapi.com/${endpoint}`, {
      headers: { 'User-Agent': 'BrawlMetaAI/1.0' }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Brawlify API error', status: response.status });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
