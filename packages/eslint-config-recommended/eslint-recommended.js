module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    es6: true,
  },
  ignorePatterns: ['node_modules', 'lib', 'dist'],
  plugins: ['import', 'eslint-comments'],
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  rules: {
    'linebreak-style': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'no-restricted-imports': [
      'error',
      {
        // don't import from dist / use absolute imports / avoid parent imports
        patterns: ['../lib/*', '../dist/*', '../src/*', '../../*'],
      },
    ],
    "sort-imports": [
      "error",
      { ignoreDeclarationSort: true, ignoreCase: true }
    ],
    '@typescript-eslint/no-namespace': 'off',
    'no-plusplus': 'off',
    'class-methods-use-this': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 0,
      },
    ],
    'no-underscore-dangle': 0,
    '@typescript-eslint/restrict-template-expressions': 0,
    // Makes no sense to allow type inference for expression parameters, but require typing the response
    '@typescript-eslint/explicit-function-return-type': [
      "error",
      { allowExpressions: true, allowTypedFunctionExpressions: true }
    ],
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    "import/order": [
      "error",
      { ["newlines-between"]: "always", alphabetize: { "order": "asc" } }
    ],
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    '@typescript-eslint/member-ordering': ['error'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
      },
    ],
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true }
    ],
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['error'],
      },
    },
  ],
};
