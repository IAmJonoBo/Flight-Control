import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { renderWithAuth } from "../test-utils";
import { useAuthContext } from "../context/AuthContext";

describe("useAuth", () => {
  it("returns user and setUser", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(typeof result.current.setUser).toBe("function");
  });
});

function TestComponent() {
  const { user, login, logout, refresh } = useAuthContext();
  return (
    <div>
      <span data-testid="user">{user ? user.name : "none"}</span>
      <button onClick={() => login("test", "pw")}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}

describe("useAuth - context integration", () => {
  it("can login and logout", async () => {
    const { getByText, getByTestId } = renderWithAuth(<TestComponent />);
    expect(getByTestId("user").textContent).toBe("none");
    getByText("Login").click();
    await waitFor(() => expect(getByTestId("user").textContent).toBe("test"));
    getByText("Logout").click();
    await waitFor(() => expect(getByTestId("user").textContent).toBe("none"));
  });

  it("refreshes token", async () => {
    const { getByText, getByTestId } = renderWithAuth(<TestComponent />);
    getByText("Login").click();
    await waitFor(() => expect(getByTestId("user").textContent).toBe("test"));
    getByText("Refresh").click();
    await waitFor(() => expect(getByTestId("user").textContent).toBe("test"));
  });
});
