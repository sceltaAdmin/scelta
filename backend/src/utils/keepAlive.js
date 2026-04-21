const https = require('https');

const BACKEND_URL = process.env.RENDER_EXTERNAL_URL || 'https://scelta-backend.onrender.com';

function ping() {
  https.get(`${BACKEND_URL}/health`, (res) => {
    console.log(`Keep-alive ping: ${res.statusCode} at ${new Date().toISOString()}`);
  }).on('error', (err) => {
    console.log('Keep-alive ping failed:', err.message);
  });
}

function startKeepAlive() {
  if (process.env.NODE_ENV !== 'production') return;
  console.log('Starting keep-alive pings every 14 minutes');
  setInterval(ping, 14 * 60 * 1000);
}

module.exports = startKeepAlive;
