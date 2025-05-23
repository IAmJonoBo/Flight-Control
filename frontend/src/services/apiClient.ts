import axios from "axios";

const apiBaseUrl = process.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

interface AnalysisResult {
  predicted_class: number;
  confidence: number;
}

interface CloneResult {
  success: boolean;
  path: string;
}

/**
 * Run code analysis using the backend /analysis/run endpoint.
 * @param {string} code
 * @param {string} [model]
 * @returns {Promise<any>} Analysis result
 */
export async function runAnalysis(
  code: string,
  model?: string,
): Promise<AnalysisResult> {
  try {
    const payload = { code } as { code: string; model?: string };
    if (model) payload.model = model;
    const response = await apiClient.post("/analysis/run", payload);
    return response.data.result as AnalysisResult;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      // @ts-expect-error: error type is not guaranteed to be AxiosError
      throw new Error(error.response?.data?.detail || "Analysis failed");
    }
    throw new Error("Analysis failed");
  }
}

/**
 * Clone a git repository using the backend /git/clone endpoint.
 * @param {string} url
 * @returns {Promise<any>} Clone result
 */
export async function cloneRepo(url: string): Promise<CloneResult> {
  try {
    const response = await apiClient.post("/git/clone", { url });
    return response.data.result as CloneResult;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      // @ts-expect-error: error type is not guaranteed to be AxiosError
      throw new Error(error.response?.data?.detail || "Git clone failed");
    }
    throw new Error("Git clone failed");
  }
}

/**
 * List available models using the backend /models/list endpoint.
 * @returns {Promise<string[]>} List of model names
 */
export async function listModels(): Promise<string[]> {
  try {
    const response = await apiClient.get("/models/list");
    return response.data.models as string[];
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      // @ts-expect-error: error type is not guaranteed to be AxiosError
      throw new Error(error.response?.data?.detail || "Failed to list models");
    }
    throw new Error("Failed to list models");
  }
}

export default apiClient;
