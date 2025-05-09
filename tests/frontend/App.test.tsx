import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../frontend/src/App';

test('renders dashboard heading', () => {
  render(<App />);
  expect(screen.getByText(/Flight Control Dashboard/i)).toBeInTheDocument();
});