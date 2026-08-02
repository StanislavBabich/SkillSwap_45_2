export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly url: string;

  constructor(url: string, status: number, statusText: string) {
    super(`Request failed: ${status} ${statusText} (${url})`);
    this.name = 'ApiError';
    this.url = url;
    this.status = status;
    this.statusText = statusText;
  }
}

export const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new ApiError(url, response.status, response.statusText);
  }

  return (await response.json()) as T;
};
