import globals from 'globals';
import tsEslint from 'typescript-eslint';

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
  },
};

const restrictedImportPatterns = [
  {
    // use absolute imports / avoid far parent imports
    group: ['../../../*'],
    message: 'Deep relative imports are not allowed. Use path aliases @/* instead',
  },
  // Ban self-barrel imports: a module must not import from its own directory's
  // `./index.js`. It re-exports the importer, creating a circular dependency.
  // Import the concrete sibling module directly instead.
  {
    regex: '^\\.\\.?\/?(index(\\.js)?)?$',
    message:
      "Do not import own ('./index') or parent ('../index') — it causes circular dependency. Import the concrete sibling module directly.",
  },
];

/**
 * Builds a complete 'no-restricted-imports' rules fragment: shared patterns + project extras.
 * Flat config replaces rule entries wholesale on override (no pattern merging),
 * so every scoped block must be rebuilt from the full set — this factory does that.
 */
const restrictedImportsRule = (...extraPatterns) => ({
  'no-restricted-imports': ['error', { patterns: [...restrictedImportPatterns, ...extraPatterns] }],
});

// kept for zero-config consumers / backwards compat — now derived, not duplicated                                                                                                                       
const restrictedImports = { rules: restrictedImportsRule() };

const recommendedTypeChecked = {
  rules: {
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true, allowShortCircuit: true }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
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
    '@typescript-eslint/default-param-last': 'off',
    // rather off - very misbehaving rule
    '@typescript-eslint/member-ordering': 'off',
  },
};

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
    },
  },
];

const configs = {
  recommendedTS,
};

export { 
  configs, 
  recommended, 
  recommendedTypeChecked,  
  restrictedImports,
  restrictedImportPatterns,
  restrictedImportsRule, 
};
