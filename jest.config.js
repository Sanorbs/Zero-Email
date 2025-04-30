module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  testMatch: ['**/tests/**/*.test.[jt]s?(x)'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/shared/$1'
  },
  transformIgnorePatterns: [
    '\\\\node_modules\\\\',
    '\\.pnp\\.[^\\\\]+$'
  ]
};