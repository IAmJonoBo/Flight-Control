import React from "react";
import { render } from "@testing-library/react";
import DocsPortal from "./DocsPortal";

describe("DocsPortal", () => {
  it("renders docs portal", () => {
    const { getByText } = render(<DocsPortal />);
    expect(getByText(/Documentation Portal/i)).toBeInTheDocument();
  });
});
