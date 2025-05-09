import { useState } from "react";
import { cloneRepo } from "../services/gitService";

interface CloneResult {
  success: boolean;
  path: string;
}

export function useGit() {
  const [result, setResult] = useState<CloneResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clone = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await cloneRepo(url);
      setResult(res);
    } catch (err: unknown) {
      let message = "Git clone failed";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, clone };
}
