const express = require('express');
const http = require('http');
const historyFallback = require('connect-history-api-fallback');

const app = express();
const server = http.createServer(app);

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
  const config = require('./webpack/config.dev');
  const compiler = webpack(config);
  console.log('ayo');

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
}