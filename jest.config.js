module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  collectCoverage: true,
  reporters: [
    'jest-junit',
    'default'
  ]
};
