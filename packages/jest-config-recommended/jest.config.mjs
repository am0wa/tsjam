import { defaults } from 'jest-config';
import { TS_JS_TRANSFORM_PATTERN } from 'ts-jest';

/** @type {import('jest').Config} */
const config = {
  rootDir: './',
  bail: 1, // fail fast
  verbose: true,
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src'],
  resolver: 'ts-jest-resolver',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  extensionsToTreatAsEsm: ['.mts', '.ts', '.tsx'],
  // don't transform node_modules – @see https://jestjs.io/docs/configuration#transformignorepatterns-arraystring
  transformIgnorePatterns: defaults.transformIgnorePatterns,
  transform: {
    [TS_JS_TRANSFORM_PATTERN]: [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tests/tsconfig.json',
        useESM: true,
      },
    ],
  },
  testMatch: ['<rootDir>/tests/**/*.+(spec|test).+(ts|tsx)'],
  setupFiles: ['<rootDir>/jest.setup.mjs'],
  globals: { __DEVELOPMENT__: false, APP_VERSION: 'test.app.version' },
};

export default config;
