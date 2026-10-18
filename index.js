import http from 'node:http';

const server = http.createServer();

server.on('request', (req, res) => {
  const url = new URL(`http://localhost:3000${req.url}`);
  const method = req.method;
  
  if (method !== 'GET') {
    res.writeHead(405, {'Content-Type': 'text/plain','Allow': 'GET'});
    res.end('Unsupported method');
  } else if (url.pathname === '/') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`Welcome to the WorkShop Inventory API!`);
  } else if (url.pathname === '/health') {
    res.writeHead(200, {'Content-Type': 'text/plain'
    });
    res.end('API is online');
  } else if (url.pathname === '/api/tools') {
    if (url.searchParams.size === 0) {
      let json = JSON.stringify(tools);
      res.writeHead(200, {'Content-Type': 'application/json',
      });
      res.end(json);
    } else if (url.searchParams.size === 1 && url.searchParams.has('category')) {
      let category = url.searchParams.get('category');

        let json = JSON.stringify(getToolsByCategory(category));
        res.writeHead(200, {'Content-Type': 'application/json',
        });
        res.end(json);
      
    } else {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('Non existent search parameter');
    }
  } else if (/^\/api\/tools\/\d+$/.test(url.pathname)) {
    let id = url.pathname.match(/\d+/g)[0];
    let tool = getToolById(Number(id));
    if (!tool) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Tool not found');
    } else {
    let json = JSON.stringify(tool);
    res.writeHead(200, {'Content-Type': 'application/json',
    });
    res.end(json);
    }
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end(`unknown path`);
  }
  
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