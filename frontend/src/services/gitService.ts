import apiClient from './apiClient';

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
    const response = await apiClient.post('/git/clone', { url });
    return response.data.result as CloneResult;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      // @ts-ignore: error type is not guaranteed to be AxiosError
      throw error.response?.data?.detail || 'Git clone failed';
    }
    throw 'Git clone failed';
  }
}