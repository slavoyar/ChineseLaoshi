module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        project: './tsconfig.json', // Specify it only for TypeScript projects
    },
    extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'airbnb-typescript/base', // Uses the recommended rules from eslint-config-airbnb-typescript
    ],
    plugins: [
        '@typescript-eslint',
        'prettier',
        'simple-import-sort',
        'import',
    ],
    rules: {
        "prettier/prettier": ["error", {
            endOfLine: 'lf',
            jsxSingleQuote: true,
            printWidth: 100,
            proseWrap: 'never',
            quoteProps: 'as-needed',
            semi: true,
            singleQuote: true,
            tabWidth: 2,
            trailingComma: 'all',
            useTabs: false,
            vueIndentScriptAndStyle: false,
        }],
        'import/extensions': [
            'warn',
            'ignorePackages',
            {
                'ts': 'never',
            }
        ],
        'simple-import-sort/imports': 'error', // Ensures that imports are sorted
        'simple-import-sort/exports': 'error', // Ensures that exports are sorted
        '@typescript-eslint/explicit-module-boundary-types': 'off', // Example rule customization
        '@typescript-eslint/no-explicit-any': 'off', // Example rule customization
        'import/prefer-default-export': 'off', // Example rule customization
        'class-methods-use-this': 'off', // Example rule customization
    },
};
