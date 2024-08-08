module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: [
        'plugin:react/recommended',
        'airbnb',
        'airbnb-typescript',
        'prettier',
    ],
    parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
            jsx: true,
        },
    },
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react', 'react-refresh', 'prettier'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            {allowConstantExport: true},
        ],
        'react/react-in-jsx-scope': 'off',
        "prettier/prettier": ["error", {
            endOfLine: 'lf',
            jsxSingleQuote: true,
            printWidth: 100,
            proseWrap: 'never',
            quoteProps: 'as-needed',
            semi: true,
            singleQuote: true,
            tabWidth: 2,
            trailingComma: 'es5',
            useTabs: false,
        }],
        "react/jsx-props-no-spreading": 'off',
        'import/extensions': 'off',
        'import/no-absolute-path': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/prefer-default-export': 'off',
        'react/no-unstable-nested-components': ['error', {
           allowAsProps: true, 
        }],
        'react/require-default-props': 'off',
        'react/function-component-definition': [
            2,
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
    },
}
