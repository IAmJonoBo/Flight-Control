import React from "react";
import { render, fireEvent } from "@testing-library/react";
import FeedbackButton from "./FeedbackButton";

describe("FeedbackButton", () => {
  it("renders button and calls onClick", () => {
    const onClick = jest.fn();
    const { getByLabelText } = render(<FeedbackButton onClick={onClick} />);
    fireEvent.click(getByLabelText(/Open feedback form/i));
    expect(onClick).toHaveBeenCalled();
  });
});
