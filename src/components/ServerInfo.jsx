import React from 'react';
import { useState, useEffect } from 'react';

const ServerInfo = () => {
  const [serverInfo, setServerInfo] = useState({
    region: 'Loading...',
    environment: 'Loading...',
    version: 'Loading...',
    status: 'Loading...',
    uptime: 'Loading...',
    lastUpdated: 'Loading...',
    deploymentId: 'Loading...'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServerInfo = async () => {
      try {
        const response = await fetch('/api/server-info');
        if (response.ok) {
          const data = await response.json();
          setServerInfo(data);
        } else {
          throw new Error('API request failed');
        }
      } catch (error) {
        console.error('Failed to fetch server info:', error);
        // Fallback data for development/local environment
        setServerInfo({
          region: process.env.VERCEL_REGION || 'US-East-1',
          environment: import.meta.env.MODE || 'development',
          version: '2.1.4',
          status: 'Healthy',
          uptime: '99.9%',
          deploymentId: 'local-dev',
          lastUpdated: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServerInfo();
    
    // Refresh server info every 30 seconds
    const interval = setInterval(fetchServerInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="server-info card">
        <h3>🖥️ Server Status</h3>
        <div className="loading">Loading server information...</div>
      </div>
    );
  }

  return (
    <div className="server-info card">
      <h3>🖥️ Server Status</h3>
      <div className="server-grid">
        <div className="server-metric">
          <span className="metric-label">Region</span>
          <span className="metric-value">{serverInfo.region}</span>
        </div>
        <div className="server-metric">
          <span className="metric-label">Environment</span>
          <span className="metric-value">{serverInfo.environment}</span>
        </div>
        <div className="server-metric">
          <span className="metric-label">Version</span>
          <span className="metric-value">v{serverInfo.version}</span>
        </div>
        <div className="server-metric">
          <span className="metric-label">Status</span>
          <span className={`metric-value status-${serverInfo.status.toLowerCase()}`}>
            <span className="status-dot"></span>
            {serverInfo.status}
          </span>
        </div>
        <div className="server-metric">
          <span className="metric-label">Uptime</span>
          <span className="metric-value">{serverInfo.uptime}</span>
        </div>
        <div className="server-metric">
          <span className="metric-label">Deployment</span>
          <span className="metric-value">
            {serverInfo.deploymentId?.substring(0, 8) || 'N/A'}
          </span>
        </div>
      </div>
      <div className="last-updated">
        Last updated: {new Date(serverInfo.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};

export default ServerInfo;
