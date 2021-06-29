module.exports = {
  apps: [
    {
      name: 'u3t',
      script: './build/index.js',
      cwd: './server/',
      env: {
        NODE_ENV: 'production',
      },
      node_args: '-r dotenv/config',
    },
  ],
};
