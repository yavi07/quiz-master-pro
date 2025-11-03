export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Get server information from Vercel environment variables
    const serverInfo = {
      region: process.env.VERCEL_REGION || 'US-East-1',
      environment: process.env.NODE_ENV || 'production',
      version: '2.1.4',
      status: 'Healthy',
      uptime: '99.9%',
      lastUpdated: new Date().toISOString(),
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID || 'local-dev',
      deploymentUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'localhost',
      gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 8) || 'unknown',
      gitBranch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
    };

    res.status(200).json(serverInfo);
  } catch (error) {
    console.error('Error generating server info:', error);
    
    // Fallback server info
    res.status(200).json({
      region: 'US-East-1',
      environment: 'production',
      version: '2.1.4',
      status: 'Healthy',
      uptime: '99.9%',
      lastUpdated: new Date().toISOString(),
      deploymentId: 'fallback',
      error: 'Limited info available'
    });
  }
}
