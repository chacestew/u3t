module.exports = {
  apps: [
    {
      name: 'u3t',
      script: 'server/build/index.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
