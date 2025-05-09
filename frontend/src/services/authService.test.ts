import * as authService from "./authService";

describe("authService", () => {
  it("login resolves with username", async () => {
    const res = await authService.login("user");
    expect(res).toEqual({ username: "user" });
  });
  it("logout resolves", async () => {
    await expect(authService.logout()).resolves.toBeUndefined();
  });
});
