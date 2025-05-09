import React from "react";
import { render } from "@testing-library/react";
import RefactoringCard from "./RefactoringCard";

describe("RefactoringCard", () => {
  it("renders suggestion text", () => {
    const { getAllByText } = render(<RefactoringCard />);
    expect(getAllByText(/Refactoring Suggestion/i).length).toBeGreaterThan(0);
  });
});
