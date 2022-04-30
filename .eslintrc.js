// eslint-disable-next-line no-undef
module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    ignorePatterns: ['public/landing*', 'cypress/plugins/*'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@next/next/recommended',
        'plugin:cypress/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 13,
        sourceType: 'module'
    },
    plugins: [
        'react',
        '@typescript-eslint',
        'react-hooks'
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: [
                    '.js',
                    '.ts',
                    '.tsx',
                    '.jsx'
                ]
            }
        }
    },
    rules: {
        'arrow-body-style': 0,
        'arrow-parens': ['error', 'as-needed'],
        'class-methods-use-this': 0,
        'comma-dangle': ['error', 'never'],
        complexity: ['error', 20],
        'consistent-return': 0,
        'linebreak-style': 0,
        'max-len': ['error', 200],
        'max-lines': ['error', { max: 1000, skipComments: true }],
        'react/jsx-max-props-per-line': [2, { maximum: 3, when: 'always' }],
        'max-statements': ['error', 40, { ignoreTopLevelFunctions: true }],
        'no-case-declarations': 0,
        'no-continue': 0,
        'no-plusplus': 0,
        'no-underscore-dangle': 0,
        'no-unneeded-ternary': 0,
        'no-useless-rename': 0,
        'no-var': 0,
        'no-tabs': 0,
        'object-shorthand': 0,
        'operator-assignment': 0,
        'vars-on-top': 0,
        'import/prefer-default-export': 0,
        'no-multiple-empty-lines': [2, {
            max: 1,
            maxEOF: 0,
            maxBOF: 0
        }],
        indent: ['error', 4, {
            ignoredNodes: ['TSXElement *'],
            SwitchCase: 1
        }],
        'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        'react-hooks/exhaustive-deps': 'warn',
        'react/jsx-closing-bracket-location': [2, 'line-aligned'],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'no-param-reassign': ['error', { props: false }],
        '@typescript-eslint/no-empty-function': 'off'
    }
};
