module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'no-tabs': ['error', { allowIndentationTabs: true }],
    'max-len': [
      'warn',
      {
        code: 180,
        tabWidth: 2,
        comments: 180,
        ignoreComments: false,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-use-before-define': 'off', // We must disable the base rule (since it can report incorrect errors) and replace it (https://stackoverflow.com/a/64024916/)
    'max-lines-per-function': ['error', { max: 70, skipBlankLines: true, skipComments: true }], // https://eslint.org/docs/rules/max-lines-per-function
    'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }], // https://eslint.org/docs/rules/max-lines
    'no-console': 'off', // Console logging is super helpful for development, and we can have our build process strip out all of those statements for production.
    'no-else-return': 'off',
  },
};
