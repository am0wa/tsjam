// eslint-disable-next-line functional/immutable-data, no-undef
module.exports = {
  rootDir: './',
  bail: false,
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  notifyMode: 'always',
  preset: 'ts-jest',
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  transformIgnorePatterns: [
    "\\.(css|sass|scss)$"
  ],
  // @see https://jestjs.io/docs/en/webpack.html
  /* moduleNameMapper: {
    "\\.(css|sass|scss|svg|png)$": "identity-obj-proxy"
  }, */
  testEnvironment: "jest-environment-jsdom",
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.tests.json', // tsconfig-test.json
      isolatedModules: true // @see https://github.com/kulshekhar/ts-jest/issues/805#issuecomment-456055213
    },
    "__DEVELOPMENT__": false
  },
  testMatch: ['<rootDir>/tests/**/*.+(spec|test).+(ts|tsx)'],
  setupFiles: [
   '<rootDir>./jest.setup.js' // add polyfills, fetch, etc.
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ]
};
