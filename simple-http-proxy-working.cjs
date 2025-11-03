const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3001;

// Backend API URL
const API_TARGET = 'https://drap-sandbox.digitnine.com';

// Enable CORS for all origins (development only)
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'sender', 'channel', 'company', 'branch']
}));

// Handle preflight requests
app.options('*', cors());

// Proxy configuration
const proxyOptions = {
  target: API_TARGET,
  changeOrigin: true,
  secure: true,
  followRedirects: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.url} -> ${API_TARGET}${req.url}`);
    
    // Set proper host header
    proxyReq.setHeader('Host', 'drap-sandbox.digitnine.com');
    
    // Log headers for debugging
    console.log('[PROXY] Request Headers:', req.headers);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY] Response Status: ${proxyRes.statusCode} for ${req.url}`);
    
    // Add CORS headers to response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, sender, channel, company, branch';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  },
  onError: (err, req, res) => {
    console.error('[PROXY] Error:', err.message);
    res.status(500).json({
      error: 'Proxy Error',
      message: err.message,
      target: API_TARGET
    });
  }
};

// Setup proxy middleware for /api routes
app.use('/api', createProxyMiddleware(proxyOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    proxy: 'running',
    port: PORT,
    target: API_TARGET,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RaaS Developer Portal - Proxy Server',
    status: 'running',
    port: PORT,
    target: API_TARGET,
    endpoints: {
      health: '/health',
      api: '/api/*'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   🚀 RaaS Developer Portal - Proxy Server Running     ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  📡 Proxy Server:  http://localhost:${PORT}`);
  console.log(`  🎯 Target API:    ${API_TARGET}`);
  console.log('');
  console.log('  Available Endpoints:');
  console.log(`    • Health Check:  http://localhost:${PORT}/health`);
  console.log(`    • API Proxy:     http://localhost:${PORT}/api/*`);
  console.log('');
  console.log('  Status: ✅ Ready to proxy requests');
  console.log('');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down proxy server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down proxy server...');
  process.exit(0);
});

