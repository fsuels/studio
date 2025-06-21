// Completely isolated Jest config
module.exports = {
  testEnvironment: 'node',
  rootDir: __dirname,
  testMatch: [
    '<rootDir>/test-simple.js',
  ],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};