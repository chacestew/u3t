const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { loaders } = require('./helpers');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash].js',
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [loaders.JS(), loaders.Images({ name: '[contenthash].[ext]' })],
  },
  plugins: [
    new Dotenv({ systemvars: true }),
    new HtmlWebpackPlugin({ template: '/public/index.ejs' }),
    new CopyPlugin({
      patterns: [{ from: 'public', to: '.', filter: (f) => !f.includes('index.ejs') }],
    }),
    new CompressionPlugin({
      test: /\.(js|css)$/,
    }),
    // new BrotliPlugin({
    //   test: /\.(js|css)$/,
    // }),
    new InjectManifest({
      swSrc: '/src/service-worker.ts',
      dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
      exclude: [/\.map$/, /LICENSE/],
      manifestTransforms: [
        async (manifestEntries) => {
          const manifest = manifestEntries.map((entry) => {
            if (entry.url === '/index.html') {
              // Rewrite cached asset because react-snap will rename app shell to 200.html
              entry.url = '/200.html';
            }
            return entry;
          });
          return { manifest, warnings: [] };
        },
      ],
    }),
    // new BundleAnalyzerPlugin(),
  ],
};
