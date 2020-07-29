/* eslint-disable global-require */
import express = require('express');
import http = require('http');
import historyFallback = require('connect-history-api-fallback');

import attachSockets from './server/sockets';

const app = express();
const server = http.createServer(app);

const info = attachSockets(server);

app.get('/connections', (req, res) => {
  const { connections } = info();
  const cons = [...connections.connections.entries()];
  res.json(cons);
});

app.get('/lobbies', (req, res) => {
  const { lobbies } = info();
  // const lobs = transform(lobbies);
  const lobs = [...lobbies.lobbies.entries()].map(e => {
    for (const piece in e[1]) {
      if ((e[1][piece] as any) instanceof Map) {
      }
    }
    const players = [...e[1].players.entries()].map(o => {
      const sockets = [...o[1].sockets.entries()];
      return [o[0], { ...o[1], sockets }];
    });
    return [e[0], { ...e[1], players }];
  });
  res.json(lobs);
});

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
  const config = require('../webpack/config.dev');
  const compiler = webpack(config);

  const webpackDevServer = webpackDevMiddleware(compiler, {
    overlay: true,
    hot: true,
    stats: {
      warnings: true,
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
