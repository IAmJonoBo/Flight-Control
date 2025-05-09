import { renderHook, act } from "@testing-library/react";
import * as gitService from "../services/gitService";
import { useGit } from "./useGit";

describe("useGit", () => {
  it("clones repo successfully", async () => {
    jest
      .spyOn(gitService, "cloneRepo")
      .mockResolvedValue({ success: true, path: "/tmp" });
    const { result } = renderHook(() => useGit());
    await act(async () => {
      await result.current.clone("url");
    });
    expect(result.current.result).toEqual({ success: true, path: "/tmp" });
    expect(result.current.error).toBeNull();
  });
  it("handles error", async () => {
    jest.spyOn(gitService, "cloneRepo").mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useGit());
    await act(async () => {
      await result.current.clone("url");
    });
    expect(result.current.error).toMatch(/fail/);
    expect(result.current.result).toBeNull();
  });
});
