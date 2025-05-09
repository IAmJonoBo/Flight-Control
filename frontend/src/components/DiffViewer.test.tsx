import React from "react";
import { render } from "@testing-library/react";
import DiffViewer from "./DiffViewer";

describe("DiffViewer", () => {
  it("renders unchanged lines", () => {
    const oldCode = "a\nb";
    const newCode = "a\nb";
    const { getByText } = render(
      <DiffViewer oldCode={oldCode} newCode={newCode} />,
    );
    expect(getByText("a")).toBeInTheDocument();
    expect(getByText("b")).toBeInTheDocument();
  });
  it("renders added and removed lines", () => {
    const { getAllByText } = render(<DiffViewer oldCode="a" newCode="a\nb" />);
    expect(
      getAllByText((content) => content.includes("+") && content.includes("b"))
        .length,
    ).toBeGreaterThan(0);
  });
  it("renders changed lines", () => {
    const { getAllByText } = render(<DiffViewer oldCode="a" newCode="b" />);
    expect(
      getAllByText((content) => content.includes("-") && content.includes("a"))
        .length,
    ).toBeGreaterThan(0);
    expect(
      getAllByText((content) => content.includes("+") && content.includes("b"))
        .length,
    ).toBeGreaterThan(0);
  });
});
