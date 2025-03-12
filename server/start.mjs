import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chatMiddleware } from './chat.mjs';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const middleware = chatMiddleware({ apiKey: process.env.OPENROUTER_API_KEY, model: process.env.OPENROUTER_MODEL || 'nex-agi/nex-n2.5-mini:free' });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
createServer((req, res) => middleware(req, res, async () => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!target.startsWith(resolve(root) + sep)) { res.writeHead(403); res.end(); return; }
    const data = await readFile(target);
    res.writeHead(200, { 'Content-Type': mime[extname(target)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' }); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
})).listen(Number(process.env.PORT || 3000), process.env.HOST || '127.0.0.1', () => console.log(`ChatMate: http://localhost:${process.env.PORT || 3000}`));
