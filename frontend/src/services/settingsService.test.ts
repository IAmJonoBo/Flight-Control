import * as settingsService from "./settingsService";

beforeEach(() => {
  jest.spyOn(settingsService, "getAdvancedSettings").mockResolvedValue({ param: "value" });
});

jest.mock("./settingsService");

describe("settingsService", () => {
  it("getAdvancedSettings resolves", async () => {
    const res = await settingsService.getAdvancedSettings();
    expect(res).toHaveProperty("param");
  });
});
