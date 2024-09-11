const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.ts', // Entry point of your application
  output: {
    filename: 'index.js', // Output bundle file
    path: path.resolve(__dirname, 'dist'), // Output directory
    libraryTarget: 'commonjs2', // CommonJS2 for Node.js applications
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve these file extensions
    alias: {
      '@configs': path.resolve(__dirname, 'src/configs/'),
      '@conrollers': path.resolve(__dirname, 'src/controllers/'),
      '@dtos': path.resolve(__dirname, 'src/dtos/'),
      '@middlewares': path.resolve(__dirname, 'src/middlewares/'),
      '@repositories': path.resolve(__dirname, 'src/repositories/'),
      '@routes': path.resolve(__dirname, 'src/routes/'),
      '@services': path.resolve(__dirname, 'src/services/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Apply this rule to TypeScript files
        use: 'ts-loader', // Use ts-loader to compile TypeScript
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node', // Specify that this build is for Node.js
  externals: [nodeExternals()], // Exclude node_modules from the bundle
};
