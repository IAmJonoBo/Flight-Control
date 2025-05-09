import React from "react";
import { render } from "@testing-library/react";
import GraphVisualizer from "./GraphVisualizer";

describe("GraphVisualizer", () => {
  it("renders placeholder text", () => {
    const { getByText } = render(<GraphVisualizer />);
    expect(
      getByText(/Graph visualizations will appear here/i),
    ).toBeInTheDocument();
  });
});
