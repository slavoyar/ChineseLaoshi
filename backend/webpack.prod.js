import { merge } from 'webpack-merge';

import baseConfig from './webpack.base.js';

export default merge(baseConfig, {
  mode: 'production',
  devtool: false,
});
