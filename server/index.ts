import 'dotenv/config';

import * as Sentry from '@sentry/node';
import cors from 'cors';
import express from 'express';
import http from 'http';

import logger from './src/logger';
import attachSockets from './src/sockets';

Sentry.init({ dsn: process.env.SENTRY_DSN });

const app = express();
const server = http.createServer(app);
attachSockets(server);

if (process.env.NODE_ENV === 'development') app.use(cors());

app.use(Sentry.Handlers.requestHandler());

app.get('/marco', (_, res) => {
  res.status(200).send('polo');
});

app.use(Sentry.Handlers.errorHandler());

const mode = process.env.NODE_ENV;
const port = 8001;
server.listen(8001, () => {
  logger.info(`Server listening on :${port} [${mode}]`);
});
