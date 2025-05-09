import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Settings from "./Settings";
import * as modelsService from "../services/modelsService";
import * as settingsService from "../services/settingsService";
import { axe } from "jest-axe";

describe("Settings", () => {
  beforeEach(() => {
    jest.spyOn(modelsService, "listModels").mockResolvedValue(["test-model"]);
    jest
      .spyOn(settingsService, "getAdvancedSettings")
      .mockResolvedValue({ param: "42" });
    jest
      .spyOn(settingsService, "saveAdvancedSettings")
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders model selection and advanced parameter", async () => {
    await act(async () => {
      render(<Settings selectedModel="test-model" onModelChange={jest.fn()} />);
    });
    expect(
      await screen.findByLabelText(/Model Selection/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Advanced parameter/i)).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    jest
      .spyOn(modelsService, "listModels")
      .mockImplementation(() => new Promise(() => {}));
    await act(async () => {
      render(<Settings selectedModel="test-model" onModelChange={jest.fn()} />);
    });
    expect(screen.getByText(/Loading models/i)).toBeInTheDocument();
  });

  it("shows error if model list fails", async () => {
    jest
      .spyOn(modelsService, "listModels")
      .mockRejectedValue(new Error("fail"));
    await act(async () => {
      render(<Settings selectedModel="test-model" onModelChange={jest.fn()} />);
    });
    expect(await screen.findByText(/fail/i)).toBeInTheDocument();
  });

  it("updates model on change", async () => {
    const onModelChange = jest.fn();
    await act(async () => {
      render(
        <Settings selectedModel="test-model" onModelChange={onModelChange} />,
      );
    });
    const select = await screen.findByLabelText(/Model Selection/i);
    fireEvent.change(select, { target: { value: "test-model" } });
    expect(onModelChange).toHaveBeenCalledWith("test-model");
  });

  it("updates parameter and saves", async () => {
    await act(async () => {
      render(<Settings selectedModel="test-model" onModelChange={jest.fn()} />);
    });
    const input = await screen.findByLabelText(/Advanced parameter/i);
    fireEvent.change(input, { target: { value: "new-param" } });
    const saveBtn = screen.getByText(/Save/i);
    fireEvent.click(saveBtn);
    await waitFor(() =>
      expect(settingsService.saveAdvancedSettings).toHaveBeenCalledWith({
        param: "new-param",
      }),
    );
  });

  it("shows save error", async () => {
    jest
      .spyOn(settingsService, "saveAdvancedSettings")
      .mockRejectedValue(new Error("fail"));
    await act(async () => {
      render(<Settings selectedModel="test-model" onModelChange={jest.fn()} />);
    });
    const input = await screen.findByLabelText(/Advanced parameter/i);
    fireEvent.change(input, { target: { value: "err-param" } });
    fireEvent.click(screen.getByText(/Save/i));
    expect(
      await screen.findByText(/Failed to save settings/i),
    ).toBeInTheDocument();
  });

  it("is accessible (a11y)", async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const renderResult = render(
        <Settings selectedModel="test-model" onModelChange={jest.fn()} />,
      );
      container = renderResult.container;
    });
    expect(container).toBeDefined();
    const results = await axe(container!);
    expect(results).toHaveNoViolations();
  });

  it("has correct ARIA roles and keyboard navigation", async () => {
    await act(async () => {
      render(<Settings selectedModel="test-model" onModelChange={jest.fn()} />);
    });
    const select = await screen.findByLabelText(/Model Selection/i);
    expect(select).toHaveAttribute("aria-label", "Select model");
    const input = screen.getByLabelText(/Advanced parameter/i);
    expect(input).toHaveAttribute("aria-label", "Advanced parameter");
    input.focus();
    expect(document.activeElement).toBe(input);
    // Note: jsdom does not move focus on Tab, so we do not assert focus movement here.
  });
});
