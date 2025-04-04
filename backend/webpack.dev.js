import { merge } from 'webpack-merge';

import baseConfig from './webpack.base.js';

export default merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true, // Auto-rebuild on changes
});
