const BASE_URL = "http://localhost:4200/api";

export async function apiGet<T = unknown>(url: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`);
  const json = await response.json();
  return json as T;
}

export async function apiPut<T = unknown>(url: string, body?: unknown) {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(`${BASE_URL}${url}`, options);
  const text = await response.text();
  if (text) {
    const result = JSON.parse(text) as T;
    return result;
  }
  return text;
}

export async function apiPost<T = unknown>(url: string, body: unknown) {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = await response.json();
  return json as T;
}

export async function apiDelete(url: string) {
  await fetch(`${BASE_URL}${url}`, { method: "DELETE" });
}
