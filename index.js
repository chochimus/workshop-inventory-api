import http from 'node:http';

const server = http.createServer();

const routeMap = new Map([
  ['GET /', handleGetRoot],
  ['GET /health', handleGetHealth],
  ['GET /api/tools', handleGetTools],
]);

function handleGetRoot(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Welcome to the Workshop Inventory API!');
}

function handleGetHealth(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('API is online');
}

function handleGetTools(req, res, url) {
  const category = url.searchParams.get('category');

  const result = category === null ? tools : getToolsByCategory(category);
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(result));
}

function handleGetTool(req, res, id) {
  let tool = getToolById(id);
  if (tool) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(tool));
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end(`No tool with id: ${id}`);
  }
}

function handleBadMethod(req, res) {
  res.writeHead(405, {'Content-Type': 'text/plain','Allow': 'GET'});
  res.end('Unsupported method');
}

function handleNotFound(req, res) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('Not Found');
}

server.on('request', (req, res) => {
  const url = new URL(`http://localhost:3000${req.url}`);
  const route = routeMap.get(`${req.method} ${url.pathname}`);

  if (req.method !== 'GET') {
    handleBadMethod(req, res);
    return;
  }
  
  if (route) {
    route(req, res, url);
    return;
  }

  const match = url.pathname.match(/^\/api\/tools\/(\d+)$/);

  if (match) {
    handleGetTool(req, res, Number(match[1]));
    return;
  }

  handleNotFound(req, res);
  return;
  
});

function getToolById(id) {
  return tools.find(tool => tool.id === id);
}

function getToolsByCategory(category) {
  return tools.filter(tool => tool.category === category);
}

let tools = [
  { id: 1, name: 'shovel', category: 'digging', condition: 'new', availability: 'available' },
  { id: 2, name: 'garden rake', category: 'gardening', condition: 'good', availability: 'available' },
  { id: 3, name: 'multimeter', category: 'electronics', condition: 'good', availability: 'available' },
  { id: 4, name: 'soldering iron', category: 'electronics', condition: 'fair', availability: 'unavailable' },
  { id: 5, name: 'cordless drill', category: 'power tools', condition: 'good', availability: 'available' },
  { id: 6, name: 'circular saw', category: 'power tools', condition: 'fair', availability: 'unavailable' },
  { id: 7, name: 'adjustable wrench', category: 'hand tools', condition: 'good', availability: 'available' },
  { id: 8, name: 'hammer', category: 'hand tools', condition: 'worn', availability: 'available' },
  { id: 9, name: 'wire stripper', category: 'electronics', condition: 'new', availability: 'available' },
  { id: 10, name: 'wheelbarrow', category: 'gardening', condition: 'poor', availability: 'unavailable' }
];

server.listen(3000);