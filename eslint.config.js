import js from '@eslint/js';
import airbnb from 'eslint-config-airbnb';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  {
    ignores: [
      'legacy/**',
      'build/**',
      'switcher.js',
      'theme.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      react,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    settings: {
      'react': {
        version: 'detect'
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      },
    },
    rules: {
      ...airbnb.rules,
      'max-len': 'off',
      'no-shadow': 'off',
      'no-return-assign': 'off',
      'no-param-reassign': 'off',
      'no-prototype-builtins': 'off',
      'object-curly-newline': ['warn', {
        ObjectExpression: { minProperties: 8, multiline: true, consistent: true },
        ObjectPattern: { minProperties: 8, multiline: true, consistent: true },
        ImportDeclaration: { minProperties: 4, multiline: true, consistent: true },
        ExportDeclaration: { minProperties: 4, multiline: true, consistent: true }
      }],
      'import/no-unresolved': ['warn', {
        ignore: ['\\.svg', 'virtual:']
      }],
      'react/function-component-definition': ['warn', {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }],
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-uses-vars': 'error',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'react/prop-types': 'off',
    },
  },
];
