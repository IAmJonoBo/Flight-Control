import React, { createContext, useContext, useState, ReactNode } from "react";

export interface AnalysisResult {
  predicted_class: number;
  confidence: number;
}

export interface AnalysisContextType {
  result: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  analyze: (code: string, model?: string) => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined,
);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder: simulate analysis
      setResult({ predicted_class: 1, confidence: 0.99 });
    } catch {
      setError("Analysis failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnalysisContext.Provider value={{ result, loading, error, analyze }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysisContext = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx)
    throw new Error(
      "useAnalysisContext must be used within an AnalysisProvider",
    );
  return ctx;
};
