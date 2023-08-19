module.exports = {
  extends: 'airbnb',
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: [
    'react',
  ],
  ignorePatterns: ['switcher.js', 'theme.js'],
  rules: {
    'max-len': [0],
    'no-shadow': [0],
    'no-return-assign': [0],
    'no-param-reassign': [0],
    'no-prototype-builtins': [0],
    'no-nested-ternary': [0],
    'operator-linebreak': [0],
    'import/no-unresolved': [0],
    'object-curly-newline': [1, {
      ObjectExpression: { minProperties: 8, multiline: true, consistent: true },
      ObjectPattern: { minProperties: 8, multiline: true, consistent: true },
      ImportDeclaration: { minProperties: 4, multiline: true, consistent: true },
      ExportDeclaration: { minProperties: 4, multiline: true, consistent: true },
    }],
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'react/function-component-definition': [1, { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' }],
    'react/prop-types': [0],
    'react/jsx-props-no-spreading': [0],
    'jsx-a11y/anchor-is-valid': [0],
  },
};
