import { getEnv } from "./env";

describe("getEnv", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("returns the value for a present key", () => {
    process.env.TEST_KEY = "test-value";
    expect(getEnv("TEST_KEY")).toBe("test-value");
  });

  it("returns undefined for an absent key", () => {
    delete process.env.TEST_KEY;
    expect(getEnv("TEST_KEY")).toBeUndefined();
  });

  it("returns undefined if process.env is undefined", () => {
    const originalProcess = global.process;
    // @ts-expect-error: process.env may be undefined in some test environments
    delete global.process;
    expect(getEnv("ANY_KEY")).toBeUndefined();
    global.process = originalProcess;
  });
});
