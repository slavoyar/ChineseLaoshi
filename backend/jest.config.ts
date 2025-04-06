import type { Config } from 'jest';
import path from 'path';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  moduleNameMapper: {
    '@routes(.*)': '<rootDir>/src/routes$1',
    '@services(.*)': '<rootDir>/src/services$1',
    '@middlewares(.*)': '<rootDir>/src/middlewares$1',
    '@repositories(.*)': '<rootDir>/src/repositories$1',
    '@configs(.*)': '<rootDir>/src/configs$1',
    '@shared(.*)': path.join(__dirname, '..', 'shared', '$1'),
    '@utils(.*)': '<rootDir>/utils$1',
  },
  transform: {
    '^.+\\.(ts)$': ['ts-jest', { useESM: true }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(chalk)/)', // Transform chalk, which uses ESM syntax
  ],
};

export default config;
