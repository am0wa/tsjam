const defaultConfig = {
  rootDir: './',
  bail: false,
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  notifyMode: 'always',
  preset: 'ts-jest',
  transformIgnorePatterns: ['\\.(css|sass|scss)$'],
  testEnvironment: 'jsdom', // default
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tests/tsconfig.json',
      isolatedModules: true, // @see https://github.com/kulshekhar/ts-jest/issues/805#issuecomment-456055213
    },
    __DEVELOPMENT__: false,
  },
  testMatch: ['<rootDir>/tests/**/*.+(spec|test).+(ts|tsx)'],
  setupFiles: [
    '<rootDir>/node_modules/@tsjam/web-config-base/jest.setup.js', // use default setup from here
  ],
};

module.exports = {
  ...defaultConfig,
};
