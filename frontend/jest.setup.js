// Removed import 'jest-axe/extend-expect';

// Enable fetch mocks globally for all tests
const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

// Polyfill import.meta.env for Jest
if (!globalThis.import) {
  globalThis.import = {
    meta: { env: { VITE_API_URL: "http://localhost:8000" } },
  };
} else if (!globalThis.import.meta) {
  globalThis.import.meta = { env: { VITE_API_URL: "http://localhost:8000" } };
} else if (!globalThis.import.meta.env) {
  globalThis.import.meta.env = { VITE_API_URL: "http://localhost:8000" };
}
