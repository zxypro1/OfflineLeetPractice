// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Global test timeout
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests (but keep log for debugging)
global.console = {
  ...console,
  // Keep console.log and console.error for debugging
  log: console.log, // Keep for debugging
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error, // Keep error for important messages
};

// Global test utilities
global.testUtils = {
  // Delay utility for async tests
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Common API response structure validation
  validateAPIResponse: (response) => {
    expect(response).toHaveProperty('status');
    expect(response).toHaveProperty('total');
    expect(response).toHaveProperty('passed');
    expect(response).toHaveProperty('results');
    expect(Array.isArray(response.results)).toBe(true);
  }
};