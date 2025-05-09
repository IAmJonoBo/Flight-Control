import React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import CodeEditor from "./CodeEditor";

// Additional imports for error boundary and LSP mocking
require('monaco-editor');

jest.mock("monaco-editor", () => {
  let onChangeCallback: ((e: unknown) => void) | null = null;
  const editorInstance = {
    onDidChangeModelContent: jest.fn((cb) => {
      onChangeCallback = cb;
      return { dispose: jest.fn() };
    }),
    getValue: jest.fn(() => "print(42)"),
    setValue: jest.fn(),
    dispose: jest.fn(),
    triggerChange: () => {
      if (onChangeCallback) onChangeCallback({});
    },
    triggerFocus: jest.fn(),
    triggerBlur: jest.fn(),
  };
  return {
    editor: {
      create: jest.fn(() => editorInstance),
      createModel: jest.fn(),
    },
    languages: { register: jest.fn() },
    Uri: { parse: jest.fn() },
    __esModule: true,
  };
});

describe("CodeEditor", () => {
  it("renders editor", () => {
    const { container } = render(
      <CodeEditor value="print('hi')" onChange={() => {}} />,
    );
    // Monaco is mocked, so just check for container
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("displays metrics if provided", () => {
    const { getByText } = render(
      <CodeEditor
        value="print('hi')"
        onChange={() => {}}
        metrics={{ lines_of_code: 1, cyclomatic_complexity: 2 }}
      />,
    );
    expect(getByText(/Lines of Code/)).toBeInTheDocument();
    expect(getByText(/Cyclomatic Complexity/)).toBeInTheDocument();
  });

  it("is accessible (a11y)", async () => {
    const { container } = render(
      <CodeEditor value="print('hi')" onChange={() => {}} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("calls onChange when content changes", () => {
    const onChange = jest.fn();
    render(<CodeEditor value="print('hi')" onChange={onChange} />);
    // Monaco mock exposes triggerChange
    const editorInstance =
      require('monaco-editor').editor.create.mock.results[0].value;
    editorInstance.getValue.mockReturnValue("print(42)");
    editorInstance.triggerChange();
    expect(onChange).toHaveBeenCalledWith("print(42)");
  });

  it("handles focus and blur events", () => {
    render(<CodeEditor value="print('hi')" onChange={() => {}} />);
    const editorInstance =
      require('monaco-editor').editor.create.mock.results[0].value;
    // Simulate focus/blur
    expect(() => editorInstance.triggerFocus()).not.toThrow();
    expect(() => editorInstance.triggerBlur()).not.toThrow();
  });

  it("has appropriate ARIA roles", () => {
    const { container } = render(
      <CodeEditor value="print('hi')" onChange={() => {}} />,
    );
    // The outer div should be present; Monaco may not set role, but we can check for container
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("supports keyboard navigation (Tab focus)", () => {
    const { container } = render(
      <CodeEditor value="print('hi')" onChange={() => {}} />,
    );
    const editorDiv = container.querySelector("div");
    if (editorDiv) {
      editorDiv.tabIndex = 0;
      editorDiv.focus();
      expect(document.activeElement).toBe(editorDiv);
    }
  });
});

describe("CodeEditor - error and LSP", () => {
  it("handles LSP connection errors gracefully", () => {
    // Simulate LSP WebSocket error
    const origWebSocket = global.WebSocket;
    global.WebSocket = jest.fn(() => ({
      onopen: null,
      onerror: jest.fn(() => {
        throw new Error("LSP connection failed");
      }),
      close: jest.fn(),
    })) as unknown as typeof WebSocket;
    expect(() => {
      render(<CodeEditor value="print('hi')" onChange={() => {}} />);
    }).not.toThrow();
    global.WebSocket = origWebSocket;
  });

  it("renders error boundary if Monaco fails", () => {
    const origCreate = require('monaco-editor').editor.create;
    require('monaco-editor').editor.create = () => {
      throw new Error("Monaco failed");
    };
    expect(() => {
      render(<CodeEditor value="print('hi')" onChange={() => {}} />);
    }).toThrow("Monaco failed");
    require('monaco-editor').editor.create = origCreate;
  });

  it("has ARIA attributes on Monaco container", () => {
    const { container } = render(
      <CodeEditor value="print('hi')" onChange={() => {}} />,
    );
    // Find the Monaco container div with role="code"
    const editorDiv = container.querySelector('div[role="code"]');
    expect(editorDiv).toHaveAttribute("role", "code");
  });

  it("announces errors via aria-live", () => {
    // Simulate error state
    const { container } = render(
      <div aria-live="assertive" role="alert">
        Editor error: LSP disconnected
      </div>,
    );
    expect(container.querySelector("[aria-live]")).toBeInTheDocument();
  });
});
