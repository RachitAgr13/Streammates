export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Request failed');
  }

  return data as T;
}
