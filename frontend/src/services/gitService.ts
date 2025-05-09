import apiClient from "./apiClient";

interface CloneResult {
  success: boolean;
  path: string;
}

/**
 * Clone a git repository using the backend /git/clone endpoint.
 * @param {string} url
 * @returns {Promise<CloneResult>} Clone result
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
      // @ts-expect-error: error.response is not typed, but present on Axios errors
      const detail =
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
          ? (error.response as { data?: { detail?: string } }).data?.detail
          : undefined;
      throw new Error(detail || "Git clone failed");
    }
    throw new Error("Git clone failed");
  }
}
