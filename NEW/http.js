const http = require('http');

const server = http.createServer((request, response) => {
  // 'request' = what the client sent (URL, method, headers)
  // 'response' = what we send back
  
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ message: "Hello from Node.js!", time: new Date() }));
});

server.listen(4000, () => {
  console.log("🚀 Server running at http://localhost:4000");
});