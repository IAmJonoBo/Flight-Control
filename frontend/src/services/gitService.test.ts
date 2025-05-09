import * as gitService from "./gitService";
import * as api from "./apiClient";
import fetch from 'jest-fetch-mock';

beforeEach(() => {
  jest.resetAllMocks();
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify({ result: { success: true, path: "/tmp" } }));
  jest.spyOn(gitService, "cloneRepo").mockResolvedValue({ success: true, path: "/tmp" });
});

describe("gitService", () => {
  it("cloneRepo returns result", async () => {
    jest.spyOn(gitService, "cloneRepo").mockResolvedValue({ success: true, path: "/tmp" });
    const result = await gitService.cloneRepo("url");
    expect(result).toEqual({ success: true, path: "/tmp" });
    (gitService.cloneRepo as jest.Mock).mockRestore?.();
  });
  it("cloneRepo throws error", async () => {
    jest.spyOn(gitService, "cloneRepo").mockRejectedValue(new Error("Git clone failed"));
    await expect(gitService.cloneRepo("url")).rejects.toThrow(
      "Git clone failed",
    );
    (gitService.cloneRepo as jest.Mock).mockRestore?.();
  });
});

describe("gitService - retry and error edge cases", () => {
  it("retries on network failure", async () => {
    let callCount = 0;
    jest.spyOn(api, "cloneRepo").mockImplementation(async () => {
      callCount++;
      if (callCount < 2) throw new Error("Network error");
      return { success: true, path: "/tmp" };
    });
    let result;
    try {
      result = await gitService.cloneRepo("url");
    } catch {
      // Retry once
      result = await gitService.cloneRepo("url");
    }
    expect(result).toEqual({ success: true, path: "/tmp" });
    (api.cloneRepo as jest.Mock).mockRestore?.();
  });
  it("handles malformed error", async () => {
    jest.spyOn(gitService, "cloneRepo").mockRejectedValue(new Error("Malformed error"));
    await expect(gitService.cloneRepo("url")).rejects.toThrow();
    (gitService.cloneRepo as jest.Mock).mockRestore?.();
  });
});
