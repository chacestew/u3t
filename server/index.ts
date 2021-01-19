import express = require('express');
import http = require('http');

import attachSockets from './src/sockets';

const app = express();
const server = http.createServer(app);

attachSockets(server);

app.get('/health', (req, res) => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`The script uses approximately ${used} MB`);
  res.json({
    status: 'OK',
    mem: `${used} MB`,
  });
});

const mode = process.env.NODE_ENV;
const port = 8001;
server.listen(8001, () => {
  console.info(`[${mode}] server listening on :${port}`);
});
