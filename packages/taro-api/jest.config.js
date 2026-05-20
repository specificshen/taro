const path = require('path');

module.exports = {
  globals: {
    ENABLE_SIZE_APIS: true,
    ENABLE_TEMPLATE_CONTENT: true,
    ENABLE_MUTATION_OBSERVER: true,
    ENABLE_CLONE_NODE: true,
    ENABLE_CONTAINS: true,
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '@spcsn/taro': '<rootDir>/src/index.ts',
    '@spcsn/taro-api': '<rootDir>/src/index.ts',
    '@spcsn/taro-shared': path.resolve(__dirname, '..', '..', 'packages/shared/src/index.ts'),
    '@spcsn/taro-runtime': path.resolve(__dirname, '..', '..', 'packages/taro-runtime/dist/runtime.esm.js'),
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['node_modules'],
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
};
