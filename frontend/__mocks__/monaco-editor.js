module.exports = {
  editor: {
    create: jest.fn(() => ({
      onDidChangeModelContent: jest.fn(),
      getValue: jest.fn(() => ""),
      setValue: jest.fn(),
      dispose: jest.fn(),
    })),
    createModel: jest.fn(() => ({})),
  },
  languages: {
    register: jest.fn(),
  },
  Uri: {
    parse: jest.fn(() => ({})),
  },
};
