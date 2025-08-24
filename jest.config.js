const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.test.ts'
  ],
  collectCoverageFrom: [
    'pages/api/**/*.{js,ts}',
    'src/**/*.{js,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 30000, // 30 seconds timeout for API tests
  maxWorkers: 1, // Run tests sequentially to avoid conflicts
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)