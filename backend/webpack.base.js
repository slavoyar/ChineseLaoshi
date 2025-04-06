import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: './src/index.ts', // Entry point of your application
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve these file extensions
    fullySpecified: false,
    extensionAlias: { '.js': ['.ts', '.js'] },
    alias: {
      '@configs': path.resolve(__dirname, 'src/configs/'),
      '@conrollers': path.resolve(__dirname, 'src/controllers/'),
      '@dtos': path.resolve(__dirname, 'src/dtos/'),
      '@middlewares': path.resolve(__dirname, 'src/middlewares/'),
      '@repositories': path.resolve(__dirname, 'src/repositories/'),
      '@routes': path.resolve(__dirname, 'src/routes/'),
      '@services': path.resolve(__dirname, 'src/services/'),
      '@shared': path.resolve(__dirname, '../shared/'),
      '@utils': path.resolve(__dirname, 'utils/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\/__mocks__\/.*\.(ts|js|tsx|jsx)$/,
        use: 'ignore-loader',
      },
    ],
  },
  target: 'node', // Specify that this build is for Node.js
  externals: [nodeExternals()], // Exclude node_modules from the bundle
};
