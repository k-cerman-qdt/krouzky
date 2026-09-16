const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.ttf':'font/ttf', '.txt':'text/plain; charset=utf-8' };
http.createServer((req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Bad request'); return; }
  if (pathname === '/') pathname = '/index.html';
  if (pathname === '/abeceda') { res.writeHead(302, { Location:'/abeceda/' }); res.end(); return; }
  if (pathname === '/abeceda/') pathname = '/abeceda/index.html';
  if (pathname !== '/index.html' && !/^\/abeceda\/(?:index\.html|style\.css|app\.js|data\.js|favicon\.svg|assets\/[\w.-]+)$/.test(pathname)) {
    res.writeHead(404); res.end('Not found'); return;
  }
  const file = path.join(__dirname, '..', pathname);
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(data);
  });
}).listen(Number(process.env.PORT || 4174),'127.0.0.1',() => console.log(`Preview: http://127.0.0.1:${process.env.PORT || 4174}`));
