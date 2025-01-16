const defaultConfig = {
  rootDir: './',
  bail: false,
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  notifyMode: 'always',
  preset: 'ts-jest',
  transformIgnorePatterns: ['\\.(css|sass|scss)$'],
  testEnvironment: 'jsdom', // default
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tests/tsconfig.json',
        isolatedModules: true, // speeds up tests at the expense of type-checking
      },
    ]
  },
  globals: {
    __DEVELOPMENT__: false,
  },
  testMatch: ['<rootDir>/tests/**/*.+(spec|test).+(ts|tsx)'],
  setupFiles: [
    '<rootDir>/node_modules/@tsjam/jest-config-recommended/jest.setup.js', // use default setup from here
  ],
};

module.exports = {
  ...defaultConfig,
};
