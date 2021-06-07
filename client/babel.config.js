module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  const presets = [
    '@babel/preset-typescript',
    '@babel/preset-react',
    ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
  ];

  const plugins = [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    [
      'babel-plugin-styled-components',
      {
        pure: true,
      },
    ],
    !api.env('production') && 'react-refresh/babel',
  ].filter(Boolean);

  return {
    presets,
    plugins,
  };
};
