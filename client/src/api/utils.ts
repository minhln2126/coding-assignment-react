const BASE_URL = 'http://localhost:4200/api';

export async function apiGet<T = unknown>(url: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`);
  const json = await response.json();
  return json as T;
}

export async function apiPost<T = unknown>(url: string, body: unknown) {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const json = await response.json();
  return json as T;
}