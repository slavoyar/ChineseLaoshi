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
        'react/function-component-definition': [
            2,
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
    },
}
