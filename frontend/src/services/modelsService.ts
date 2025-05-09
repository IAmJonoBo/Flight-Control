import { listModels as apiListModels } from "./apiClient";

/**
 * List available models using the backend /models/list endpoint.
 * @returns {Promise<string[]>} List of model metadata
 */
export async function listModels(): Promise<string[]> {
  return apiListModels();
}
