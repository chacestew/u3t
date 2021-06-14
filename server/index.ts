import express = require('express');
import http = require('http');
import logger from './src/logger';

import attachSockets from './src/sockets';

const app = express();
const server = http.createServer(app);

attachSockets(server);

const mode = process.env.NODE_ENV;
const port = 8001;
server.listen(8001, () => {
  logger.info(`Server listening on :${port} [${mode}]`);
});
