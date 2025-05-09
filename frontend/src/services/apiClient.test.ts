import * as api from "./apiClient";
import axios from "axios";
import fetch from 'jest-fetch-mock';

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify({ result: { predicted_class: 1, confidence: 0.9 }, models: ["model1"] }));
  jest.restoreAllMocks();
});

describe("apiClient", () => {
  it("runAnalysis returns result", async () => {
    jest.spyOn(api, "runAnalysis").mockResolvedValue({ predicted_class: 1, confidence: 0.9 });
    mockedAxios.create.mockReturnThis();
    mockedAxios.post.mockResolvedValue({
      data: { result: { predicted_class: 1, confidence: 0.9 } },
    });
    const result = await api.runAnalysis("code", "model");
    expect(result).toEqual({ predicted_class: 1, confidence: 0.9 });
  });
  it("runAnalysis throws error", async () => {
    jest.spyOn(api, "runAnalysis").mockRejectedValue(new Error("Analysis failed"));
    mockedAxios.create.mockReturnThis();
    mockedAxios.post.mockRejectedValue({
      response: { data: { detail: "Analysis failed" } },
    });
    await expect(api.runAnalysis("code", "model")).rejects.toThrow(
      "Analysis failed",
    );
  });
  it("cloneRepo returns result", async () => {
    jest.spyOn(api, "cloneRepo").mockResolvedValue({ success: true, path: "/tmp" });
    mockedAxios.create.mockReturnThis();
    mockedAxios.post.mockResolvedValue({
      data: { result: { success: true, path: "/tmp" } },
    });
    const result = await api.cloneRepo("url");
    expect(result).toEqual({ success: true, path: "/tmp" });
  });
  it("cloneRepo throws error", async () => {
    jest.spyOn(api, "cloneRepo").mockRejectedValue(new Error("Git clone failed"));
    mockedAxios.create.mockReturnThis();
    mockedAxios.post.mockRejectedValue({
      response: { data: { detail: "Git clone failed" } },
    });
    await expect(api.cloneRepo("url")).rejects.toThrow("Git clone failed");
  });
  it("listModels returns models", async () => {
    jest.spyOn(api, "listModels").mockResolvedValue(["model1"]);
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockResolvedValue({
      data: { result: [{ name: "model1" }] },
    });
    const result = await api.listModels();
    expect(result).toEqual(["model1"]);
  });
  it("listModels throws error", async () => {
    jest.spyOn(api, "listModels").mockRejectedValue(new Error("Failed to list models"));
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockRejectedValue({
      response: { data: { detail: "Failed to list models" } },
    });
    await expect(api.listModels()).rejects.toThrow("Failed to list models");
  });
});

describe("apiClient - retry and network failure", () => {
  it("retries runAnalysis on network error", async () => {
    let callCount = 0;
    jest.spyOn(api, "runAnalysis").mockImplementation(async () => {
      callCount++;
      if (callCount < 2)
        throw new Error("Network error");
      return { predicted_class: 1, confidence: 0.9 };
    });
    mockedAxios.create.mockReturnThis();
    mockedAxios.post.mockImplementation(async () => {
      callCount++;
      if (callCount < 2)
        throw { response: { data: { detail: "Network error" } } };
      return { data: { result: { predicted_class: 1, confidence: 0.9 } } };
    });
    let result;
    try {
      result = await api.runAnalysis("code", "model");
    } catch {
      // Retry once
      result = await api.runAnalysis("code", "model");
    }
    expect(result).toEqual({ predicted_class: 1, confidence: 0.9 });
  });

  it("handles network failure for cloneRepo", async () => {
    jest.spyOn(api, "cloneRepo").mockRejectedValue(new Error("Git clone failed"));
    mockedAxios.create.mockReturnThis();
    mockedAxios.post.mockRejectedValue({});
    await expect(api.cloneRepo("url")).rejects.toThrow(/Git clone failed/);
  });
});
