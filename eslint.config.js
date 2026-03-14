import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import importPlugin from 'eslint-plugin-import-x';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  {
    ignores: ['build/**', 'switcher.js', 'theme.js', 'vite.config.js'],
  },
  js.configs.recommended,
  eslintReact.configs.recommended,
  importPlugin.configs['flat/recommended'],
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    settings: {
      'import-x/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.json'],
        },
      },
    },
    rules: {
      'no-prototype-builtins': 'off',
      'import-x/no-unresolved': [
        'warn',
        {
          ignore: ['\\.svg', 'virtual:'],
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  prettierRecommended,
];
