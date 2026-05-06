import { API_BASE_URL } from "@/lib/constants/api";
import { ApiError } from "@/lib/utils/errorHandler";

const request = async <T>(
  method: string,
  endpoint: string,
  body?: unknown,
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};

  if (!response.ok) {
    throw new ApiError(
      "Server error occurred. Please try again later.",
      response.status,
      data,
    );
  }

  if (data?.error && typeof data.error === "string") {
    throw new ApiError(data.error, response.status, data);
  }

  return data as T;
};

export const apiClient = {
  get: <T>(endpoint: string) => request<T>("GET", endpoint),
  post: <T>(endpoint: string, body: unknown) => request<T>("POST", endpoint, body),
  put: <T>(endpoint: string, body: unknown) => request<T>("PUT", endpoint, body),
  patch: <T>(endpoint: string, body: unknown) => request<T>("PATCH", endpoint, body),
  delete: <T>(endpoint: string) => request<T>("DELETE", endpoint),
};
