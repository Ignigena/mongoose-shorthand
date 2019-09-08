module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'adapters/*.js',
    'index.js'
  ],
  testEnvironment: 'node'
}
