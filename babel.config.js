module.exports = api => {
  api.cache(true);

  const presets = [
    '@babel/preset-typescript',
    '@babel/preset-react',
    ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
  ];

  const plugins = [
    'react-hot-loader/babel',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    [
      'babel-plugin-styled-components',
      {
        pure: true,
      },
    ],
  ];

  return {
    presets,
    plugins,
  };
};
