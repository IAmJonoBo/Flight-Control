import { useState } from 'react';
import { runAnalysis } from '../services/apiClient';

interface AnalysisResult {
  predicted_class: number;
  confidence: number;
}

export function useAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze: (code: string, model?: string) => Promise<void> = async (code, model) => {
    setLoading(true);
    setError(null);
    try {
      const res = await runAnalysis(code, model);
      setResult(res);
    } catch (err: unknown) {
      let message = 'Analysis failed';
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'string') {
        message = err;
      }
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, analyze };
}