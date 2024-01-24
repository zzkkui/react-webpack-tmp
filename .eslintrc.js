module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'prettier'],
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
        'no-unused-expressions': 0,
        '@typescript-eslint/no-unused-expressions': 2,
        '@typescript-eslint/explicit-module-boundary-types': 0,
      },
    },
    {
      files: ['*.ts', '*.ts', '*.tsx', '*.jsx', '*.test.jsx', '*.test.js', '*.test.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 0,
        'no-use-before-define': 0,
        '@typescript-eslint/no-use-before-define': 0,
      },
    },
    {
      // enable the rule specifically for TypeScript files
      files: ['*.js', '*.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
      },
    },
  ],
  rules: {
    'no-console': 0,
    'react/jsx-filename-extension': 0,
    'lines-between-class-members': [1, 'always'],
    'keyword-spacing': [1, { before: true, after: true }],
    'object-curly-spacing': [1, 'always'],
    'space-before-blocks': 1,
    'space-infix-ops': 1,
    'arrow-spacing': 1,
    'no-var': 1,
    'prefer-const': 1,
    'array-bracket-newline': [1, { multiline: true }],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'no-unused-expressions': 0,
    '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true, allowShortCircuit: true }],
    'react/prop-types': 0,
    'react/display-name': 0,
    'no-self-assign': 0,
    camelcase: 0,
    'array-callback-return': 0,
    '@typescript-eslint/ban-types': 0,
    'react-hooks/exhaustive-deps': 0,
    'no-debugger': 0,
  },
}
