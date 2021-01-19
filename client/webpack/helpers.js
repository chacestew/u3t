const path = require('path');

const currentDir = process.cwd();
const resolvePath = (p) => path.resolve(currentDir, p);

const paths = {
  client: resolvePath('src/index.tsx'),
  dist: resolvePath('dist'),
};

const loaders = {
  JS: (options) => ({
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    use: [{ loader: 'babel-loader', options }],
  }),
  RHL: () => ({
    test: /\.(ts|js)x?$/,
    include: /node_modules/,
    use: ['react-hot-loader/webpack'],
  }),
  Images: (options = {}) => ({
    test: /\.(jpe?g|png|gif|ico)$/,
    use: [
      {
        loader: 'file-loader',
        options: { name: '[name].[ext]', outputPath: 'images', ...options },
      },
    ],
  }),
};

module.exports = {
  paths,
  loaders,
};
