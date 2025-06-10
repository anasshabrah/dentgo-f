// .eslintrc.cjs
module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: './tsconfig.json',
  },

  env: {
    browser: true,
    node: true,
    es2021: true,
  },

  settings: {
    react: { version: 'detect' },
  },

  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  plugins: ['react', '@typescript-eslint', 'react-hooks'],

  rules: {
    // allow explicit any everywhere
    '@typescript-eslint/no-explicit-any': 'off',

    // turn off unused vars (TypeScript already warns)
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',

    // disable the react-hooks plugin missing rule error
    'react-hooks/exhaustive-deps': 'off',

    // your other overrides here...
  },
};
