import { renderHook, act } from "@testing-library/react";
import * as modelsService from "../services/modelsService";
import { useModels } from "./useModels";

describe("useModels", () => {
  it("fetches models successfully", async () => {
    jest.spyOn(modelsService, "listModels").mockResolvedValue(["a", "b"]);
    const { result } = renderHook(() => useModels());
    await act(async () => {
      await result.current.fetchModels();
    });
    expect(result.current.models).toEqual(["a", "b"]);
    expect(result.current.error).toBeNull();
  });
  it("handles error", async () => {
    jest
      .spyOn(modelsService, "listModels")
      .mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useModels());
    await act(async () => {
      await result.current.fetchModels();
    });
    expect(result.current.error).toMatch(/fail/);
    expect(result.current.models).toEqual([]);
  });
});
