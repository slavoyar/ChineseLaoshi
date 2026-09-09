import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginTailwindCSS from 'eslint-plugin-tailwindcss';

import { createConfig } from '../eslintConfig.mjs';

export default createConfig([
  {
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      tailwindcss: eslintPluginTailwindCSS,
    },
    rules: {},
  },
]);
