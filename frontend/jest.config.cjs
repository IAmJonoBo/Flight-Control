module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts?(x)'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom', 'jest-axe/extend-expect'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^monaco-editor$': '<rootDir>/__mocks__/monaco-editor.js',
    '^monaco-editor/(.*)$': '<rootDir>/__mocks__/monaco-editor.js',
    '^vscode-ws-jsonrpc$': '<rootDir>/__mocks__/vscode-ws-jsonrpc.js',
    '^monaco-languageclient$': '<rootDir>/__mocks__/monaco-languageclient.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(vite|monaco-editor|monaco-languageclient|vscode-ws-jsonrpc)/)',
  ],
};