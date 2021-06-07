const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');

const { loaders } = require('./helpers');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  entry: {
    main: ['webpack-hot-middleware/client', path.resolve(process.cwd(), 'src/index.tsx')],
  },
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    filename: 'js/[name].js',
    publicPath: '/public/',
  },
  module: {
    rules: [loaders.JS({ cacheDirectory: true }), loaders.Images()],
  },
  plugins: [
    new HtmlWebpackPlugin({ title: 'U3T', template: 'index.html' }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({ overlay: { sockIntegration: 'whm' } }),
  ],
};
