import { useState } from "react";
import { listModels } from "../services/modelsService";

export function useModels() {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listModels();
      setModels(res);
    } catch (err: unknown) {
      let message = "Failed to list models";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      setError(message);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  return { models, loading, error, fetchModels };
}
