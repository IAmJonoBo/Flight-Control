import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "./Dashboard";
import * as modelsService from "../services/modelsService";
import { act } from "react";
import fetch from "jest-fetch-mock";

jest.setTimeout(10000); // Increase timeout for async/debounced tests

jest.mock("../hooks/useGit", () => ({
  useGit: () => ({
    result: null,
    loading: false,
    error: null,
    clone: jest.fn(),
  }),
}));

jest.mock("../hooks/useAnalysis", () => {
  return {
    useAnalysis: () => ({
      result: { predicted_class: 1, confidence: 0.98 },
      loading: false,
      error: null,
      analyze: jest.fn(),
    }),
  };
});

beforeEach(() => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify(["test-model"]));
  jest.spyOn(modelsService, "listModels").mockResolvedValue(["test-model"]);
});

describe("Dashboard", () => {
  it("renders dashboard heading", () => {
    render(<Dashboard />);
    expect(screen.getByText(/Flight Control Dashboard/i)).toBeInTheDocument();
  });

  it("renders git clone input and button", async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    expect(
      screen.getByPlaceholderText(
        /https:\/\/github.com\/octocat\/Hello-World.git/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clone/i })).toBeInTheDocument();
  });

  it("disables clone button when input is empty", async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    const button = screen.getByRole("button", { name: /Clone/i });
    expect(button).toBeDisabled();
  });

  it("enables clone button when input is not empty", async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    const input = screen.getByPlaceholderText(
      /https:\/\/github.com\/octocat\/Hello-World.git/i,
    );
    const button = screen.getByRole("button", { name: /Clone/i });
    fireEvent.change(input, {
      target: { value: "https://github.com/octocat/Hello-World.git" },
    });
    expect(button).not.toBeDisabled();
  });

  it("renders model selection dropdown and analysis result", async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    expect(
      await screen.findByLabelText(/Model Selection/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/predicted_class/i)).toBeInTheDocument();
    expect(screen.getByText(/confidence/i)).toBeInTheDocument();
  });
});
