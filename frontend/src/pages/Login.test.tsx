import React from "react";
import { render } from "@testing-library/react";
import Login from "./Login";

describe("Login", () => {
  it("renders login form", () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    expect(getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(getByText(/Sign In/i)).toBeInTheDocument();
  });
});
