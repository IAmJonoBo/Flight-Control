import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import { AnalysisProvider, useAnalysisContext } from "./AnalysisContext";

describe("AnalysisContext", () => {
  function Consumer() {
    const { result, loading, error, analyze } = useAnalysisContext();
    return (
      <div>
        <span data-testid="result">
          {result ? result.predicted_class : "none"}
        </span>
        <span data-testid="loading">{loading ? "loading" : "idle"}</span>
        <span data-testid="error">{error || "none"}</span>
        <button onClick={() => analyze("code")}>Analyze</button>
      </div>
    );
  }

  it("provides default values and updates state", async () => {
    render(
      <AnalysisProvider>
        <Consumer />
      </AnalysisProvider>,
    );
    expect(screen.getByTestId("result").textContent).toBe("none");
    expect(screen.getByTestId("loading").textContent).toBe("idle");
    expect(screen.getByTestId("error").textContent).toBe("none");
    fireEvent.click(screen.getByText("Analyze"));
    // Wait for async state update
    expect(await screen.findByTestId("result")).not.toHaveTextContent("none");
    expect(screen.getByTestId("loading").textContent).toBe("idle");
    expect(screen.getByTestId("error").textContent).toBe("none");
  });

  it("announces errors via aria-live", () => {
    render(
      <div aria-live="assertive" role="alert">
        Analysis failed
      </div>,
    );
    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
  });

  it("is accessible (a11y)", async () => {
    const { container } = render(
      <AnalysisProvider>
        <Consumer />
      </AnalysisProvider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
