import React from "react";
import fetchMock from 'jest-fetch-mock';
import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  fetchMock.resetMocks();
  fetchMock.mockResponseOnce(JSON.stringify({ param: "value" }));
});

test("renders dashboard heading", () => {
  render(<App />);
  expect(screen.getByText(/Flight Control Dashboard/i)).toBeInTheDocument();
});
