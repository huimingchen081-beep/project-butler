/**
 * Project Butler — HTTP Server for Web UI + API
 * 
 * Built with GitHub Copilot for:
 * - Static file serving patterns
 * - SSE streaming design
 * - Multipart form handling
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not Found');
  }
}

function serveAPI(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const { description } = JSON.parse(body);
      if (!description || description.trim().length < 10) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Please provide a more detailed project description (at least 10 characters).' }));
        return;
      }

      // Run the CLI as a subprocess
      const nodeExe = 'C:/Users/Administrator/.workbuddy/binaries/node/versions/22.22.2/node.exe';
      const cliPath = path.join(ROOT, 'cli.js');
      
      console.log(`[Server] Running agent for: ${description}`);
      
      const result = execSync(`"${nodeExe}" "${cliPath}" ${JSON.stringify(description)}`, {
        timeout: 600000,
        stdio: 'pipe',
        encoding: 'utf-8',
        maxBuffer: 50 * 1024 * 1024
      });

      // Extract JSON summary from output (last non-empty line starting with {)
      const lines = result.trim().split('\n');
      let jsonStr = '';
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim().startsWith('{')) {
          jsonStr = lines[i].trim();
          break;
        }
      }

      const summary = JSON.parse(jsonStr || '{}');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ...summary, rawOutput: result }));
      
    } catch (err) {
      console.error('[Server] Agent error:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Agent execution failed', 
        details: err.message,
        stderr: err.stderr?.toString() || ''
      }));
    }
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'POST' && url.pathname === '/api/run') {
    serveAPI(req, res);
  } else if (url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
  } else {
    // Static file serving
    let filePath = path.join(ROOT, url.pathname === '/' ? 'index.html' : url.pathname);
    serveFile(res, filePath);
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Project Butler Server running at http://localhost:${PORT}\n`);
});
