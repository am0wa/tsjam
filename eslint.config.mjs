import ourEslint from '@tsjam/eslint-config-recommended';

console.info('Linting..🕵️', ourEslint.configs.recommendedTS);

/**
 * @see https://typescript-eslint.io/users/configs/#recommended
 */
export default [
  {
    ignores: ['node_modules', 'lib', 'dist', '*.config.js'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // inclues 'typescript-eslint/base'
  // inclues 'typescript-eslint/eslint-recommended'
  // inclues 'typescript-eslint/recommended-type-checked'
  // ...tsEslint.configs.recommendedTypeChecked, // + our TS rules
  ...ourEslint.configs.recommendedTS,
  {
    rules: {
      'no-param-reassign': 'error',
      '@typescript-eslint/unbound-method': 'error',
      '@typescript-eslint/default-param-last': 'warn',
      '@typescript-eslint/no-base-to-string': 'off',
    },
  },
];
