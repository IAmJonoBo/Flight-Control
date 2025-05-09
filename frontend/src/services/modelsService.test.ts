import * as modelsService from "./modelsService";

describe("modelsService", () => {
  it("listModels returns result", async () => {
    jest.spyOn(modelsService, "listModels").mockResolvedValue(["a", "b"]);
    const res = await modelsService.listModels();
    expect(res).toEqual(["a", "b"]);
  });
});
