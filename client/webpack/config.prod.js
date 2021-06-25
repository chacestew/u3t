const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const { loaders } = require('./helpers');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash:8].js',
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [loaders.JS(), loaders.Images()],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: '/public/index.html' }),
    new CopyPlugin({
      patterns: [{ from: 'public', to: '.', filter: (f) => !f.includes('index.html') }],
    }),
    new CompressionPlugin({
      test: /\.(js|css)$/,
    }),
    new BrotliPlugin({
      test: /\.(js|css)$/,
    }),
    new InjectManifest({
      swSrc: '/src/service-worker.ts',
      dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
      exclude: [/\.map$/, /LICENSE/],
    }),
  ],
};
