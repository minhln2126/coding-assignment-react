const BASE_URL = "http://localhost:4200/api";

export async function apiGet<T = unknown>(url: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`);
  if (!response.ok) {
    throw new Error(`Get failed for url: ${url}`);
  }
  const text = await response.text();
  if (text) {
    const result = JSON.parse(text) as T;
    return result;
  }
  return null as T;
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
  if (!response.ok) {
    throw new Error(`Put failed for url: ${url}`);
  }
  const text = await response.text();
  if (text) {
    const result = JSON.parse(text) as T;
    return result;
  }
  return null as T;
}

export async function apiPost<T = unknown>(url: string, body: unknown) {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Post failed for url: ${url}`);
  }
  const text = await response.text();
  if (text) {
    const result = JSON.parse(text) as T;
    return result;
  }
  return null as T;
}

export async function apiDelete<T = unknown>(url: string) {
  const response = await fetch(`${BASE_URL}${url}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`Get failed for url: ${url}`);
  }
  const text = await response.text();
  if (text) {
    const result = JSON.parse(text) as T;
    return result;
  }
  return null as T;
}
