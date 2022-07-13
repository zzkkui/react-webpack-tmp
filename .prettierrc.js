module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  proseWrap: 'never',
  // endOfLine: 'lf',
  endOfLine: 'auto',
  semi: false,
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
    {
      files: '*.less',
      options: {
        parser: 'less',
      },
    },
  ],
  parser: 'typescript',
}
