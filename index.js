/* eslint-disable global-require */
// import express from 'express';
// import http from 'http';
// import socketIO from 'socket.io';
// import ignoreFavicon from 'express-no-favicons';
// import history from 'connect-history-api-fallback';
// import attachSockets from './sockets.mjs';
// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
const app = require('express')();
const server = require('http').createServer(app);
const ignoreFavicon = require('express-no-favicons');
const history = require('connect-history-api-fallback');

// Attach sockets
require('./sockets').default(server);

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

app.use(ignoreFavicon());
app.use(history({ index: '/public/index.html' }));

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
  const config = require('./webpack/config.dev');
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
