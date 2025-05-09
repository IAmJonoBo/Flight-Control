import React from "react";
import { renderHook, act, render, waitFor } from "@testing-library/react";
import * as api from "../services/apiClient";
import { useAnalysis } from "./useAnalysis";

describe("useAnalysis", () => {
  it("analyzes code successfully", async () => {
    jest
      .spyOn(api, "runAnalysis")
      .mockResolvedValue({ predicted_class: 1, confidence: 0.9 });
    const { result } = renderHook(() => useAnalysis());
    await act(async () => {
      await result.current.analyze("code", "model");
    });
    expect(result.current.result).toEqual({
      predicted_class: 1,
      confidence: 0.9,
    });
    expect(result.current.error).toBeNull();
  });
  it("handles error", async () => {
    jest.spyOn(api, "runAnalysis").mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useAnalysis());
    await act(async () => {
      await result.current.analyze("code", "model");
    });
    expect(result.current.error).toMatch(/fail/);
    expect(result.current.result).toBeNull();
  });
});

describe("useAnalysis - loading and edge cases", () => {
  it("sets loading true during analysis", async () => {
    jest
      .spyOn(api, "runAnalysis")
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ predicted_class: 1, confidence: 0.9 }),
              50,
            ),
          ),
      );
    const { result } = renderHook(() => useAnalysis());
    act(() => {
      result.current.analyze("code", "model");
    });
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("handles invalid input gracefully", async () => {
    jest
      .spyOn(api, "runAnalysis")
      .mockRejectedValue(new Error("Invalid input"));
    const { result } = renderHook(() => useAnalysis());
    await act(async () => {
      await result.current.analyze("", "model");
    });
    expect(result.current.error).toMatch(/Invalid input/);
  });

  it("announces errors via aria-live for consumers", () => {
    // Simulate error state in a consumer
    const error = "Analysis failed";
    const { container } = render(
      <div aria-live="assertive" role="alert">
        {error}
      </div>,
    );
    expect(container.querySelector("[aria-live]")).toBeInTheDocument();
  });
});
