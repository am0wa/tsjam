import tsEslint from 'typescript-eslint';
import globals from 'globals';

const recommended = {
  rules: {
    'no-param-reassign': 'error',
    'no-nested-ternary': 'warn',
    'linebreak-style': 'off',
    'no-plusplus': 'off',
    'class-methods-use-this': 'off',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 0,
      },
    ],
    'no-underscore-dangle': 'off',
  }
}

const recommendedImport = {
  rules: {
    // this rule dramatically increases lint time
    'import/extensions': 'off',
    // don't process import order - too heavy and not flexible enough (use prettier)
    "import/order": "off",
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'no-restricted-imports': [
      'error',
      {
        // don't import from dist / use absolute imports / avoid parent imports
        patterns: ['../lib/*', '../dist/*', '../src/*', '../../*'],
      },
    ],
  }
}

const recommendedTypeChecked = {
  rules: {
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true, allowShortCircuit: true }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/unbound-method': ["error", { "ignoreStatic": true }],
    // do not allow as T type casting
    '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
    '@typescript-eslint/explicit-function-return-type': ['error'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
      },
    ],
    // with default arrays its more convenient to off
    "@typescript-eslint/default-param-last": "off",
    // rather off - very misbehaving rule
    "@typescript-eslint/member-ordering": "off",
  }
}

const recommendedJSX = {
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  }
}

const recommendedTS = [
  // inclues 'typescript-eslint/base'
  // inclues 'typescript-eslint/eslint-recommended'
  // inclues 'typescript-eslint/recommended-type-checked'
  ...tsEslint.configs.recommendedTypeChecked,
  {
    ignores: ['node_modules', 'lib', 'dist'],
    languageOptions: { globals: globals.browser },
    rules: {
      ...recommended.rules,
      ...recommendedTypeChecked.rules,
    }
  }
]

const configs = {
  recommendedTS,
}

export {
  configs,
  recommended,
  recommendedTypeChecked,
  recommendedImport,
  recommendedJSX
};
