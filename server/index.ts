import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import http from 'http';

import contact, { schema } from './src/contact';
import logger from './src/logger';
import attachSockets from './src/sockets';

const app = express();
const server = http.createServer(app);
attachSockets(server);

if (process.env.NODE_ENV === 'development') app.use(cors());

const jsonParser = json();
const validator = createValidator();

app.post('/contact', jsonParser, validator.body(schema), contact);

const mode = process.env.NODE_ENV;
const port = 8001;
server.listen(8001, () => {
  logger.info(`Server listening on :${port} [${mode}]`);
});
