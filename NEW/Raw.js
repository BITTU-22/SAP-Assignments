const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: "Welcome to our API!" }));
    
  } else if (req.url === '/products' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ products: ["Laptop", "Mouse", "Keyboard"] }));
    
  } else if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "healthy", uptime: process.uptime() }));
    
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(4000, () => console.log("Server on port 4000"));