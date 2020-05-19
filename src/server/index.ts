/* eslint-disable global-require */
import express = require('express');
import http = require('http');
import historyFallback = require('connect-history-api-fallback');

import attachSockets from './sockets';

const app = express();
const server = http.createServer(app);

attachSockets(server);

app.use(historyFallback({ index: '/public/index.html' }));

const start = () => {
  const mode = process.env.NODE_ENV;
  const port = 8000;
  server.listen(8000, () => {
    console.info(`[${mode}] server listening on :${port}`);
  });
};

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../../webpack/config.dev');
  const compiler = webpack(config);

  const webpackDevServer = webpackDevMiddleware(compiler, {
    overlay: true,
    hot: true,
    stats: {
      warnings: false,
      colors: true,
      timings: true,
    },
    publicPath: config.output.publicPath,
  });
  app.use(webpackDevServer);
  app.use(webpackHotMiddleware(compiler));

  webpackDevServer.waitUntilValid(start);
} else {
  const expressStaticGzip = require('express-static-gzip');

  app.use(
    '/public',
    expressStaticGzip('dist', {
      enableBrotli: true,
      index: false,
      orderPreference: ['br'],
    })
  );
  start();
}
