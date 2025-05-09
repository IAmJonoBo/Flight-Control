import React, { ReactElement, FC, PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { AuthProvider } from "./context/AuthContext";
import { AnalysisProvider } from "./context/AnalysisContext";

// Utility to render with Auth and Analysis providers for integration/a11y tests
interface ProviderProps {
  authProps?: Record<string, unknown>;
  analysisProps?: Record<string, unknown>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    authProps = {},
    analysisProps = {},
    ...options
  }: ProviderProps & RenderOptions = {},
) {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <AuthProvider {...authProps}>
      <AnalysisProvider {...analysisProps}>{children}</AnalysisProvider>
    </AuthProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}

export function renderWithAuth(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: AuthProvider, ...options });
}

export function renderWithAnalysis(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: AnalysisProvider, ...options });
}
