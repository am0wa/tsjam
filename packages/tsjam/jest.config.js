/**@see https://kulshekhar.github.io/ts-jest/docs/guides/esm-support*/
import baseConfig from '@tsjam/jest-config-recommended/jest.config.mjs';

console.log('Jest ESM Windmills...');

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  rootDir: './',
};

export default config;
