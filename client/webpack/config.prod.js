const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const { loaders } = require('./helpers');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash:8].js',
    publicPath: '/',
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
    new HtmlWebpackPlugin({ title: 'React Sweet Spot', template: 'index.html' }),
    new CompressionPlugin({
      test: /\.(js|css)$/,
    }),
    new BrotliPlugin({
      test: /\.(js|css)$/,
    }),
  ],
};
