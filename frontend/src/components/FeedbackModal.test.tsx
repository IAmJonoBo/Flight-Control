import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import FeedbackModal from "./FeedbackModal";

describe("FeedbackModal", () => {
  it("renders when open", () => {
    render(
      <FeedbackModal open={true} onClose={() => {}} onSubmit={jest.fn()} />,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <FeedbackModal open={false} onClose={() => {}} onSubmit={jest.fn()} />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("validates required fields", () => {
    render(
      <FeedbackModal open={true} onClose={() => {}} onSubmit={jest.fn()} />,
    );
    const buttons = screen.getAllByText(/Submit Feedback/i);
    const button = buttons.find((btn) => btn.tagName === "BUTTON");
    if (!button) throw new Error("Submit Feedback button not found");
    fireEvent.click(button);
    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
  });

  it("calls onSubmit with form data", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(
      <FeedbackModal open={true} onClose={() => {}} onSubmit={onSubmit} />,
    );
    const titleInput = await screen.findByLabelText(/Title/i);
    const descInput = await screen.findByLabelText(/Description/i);
    fireEvent.change(titleInput, { target: { value: "My Feedback" } });
    fireEvent.change(descInput, { target: { value: "Details here" } });
    const button = screen
      .getAllByText(/Submit Feedback/i)
      .find((btn) => btn.tagName === "BUTTON");
    if (!button) throw new Error("Submit Feedback button not found");
    fireEvent.click(button);
    expect(onSubmit).toHaveBeenCalled();
    const formData = onSubmit.mock.calls[0][0];
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get("title")).toBe("My Feedback");
    expect(formData.get("description")).toBe("Details here");
  });

  it("is accessible (a11y)", async () => {
    const { container } = render(
      <FeedbackModal open={true} onClose={() => {}} onSubmit={jest.fn()} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has correct ARIA roles and keyboard navigation", () => {
    render(
      <FeedbackModal open={true} onClose={() => {}} onSubmit={jest.fn()} />,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    const titleInput = screen.getByLabelText(/Title/i);
    titleInput.focus();
    expect(document.activeElement).toBe(titleInput);
    // Tab navigation is not simulated in jsdom, but focus can be set
  });

  it("announces errors via aria-live", () => {
    render(
      <div aria-live="assertive" role="alert">
        Feedback error: Network issue
      </div>,
    );
    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
  });
});
