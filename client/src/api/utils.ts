import axios from "axios";

const BASE_URL = "http://localhost:4200/api";

export async function apiGet<T = unknown>(url: string): Promise<T> {
  try {
    const response = await axios.get<T>(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `GET failed for url: ${url} - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function apiPut<T = unknown>(
  url: string,
  body?: unknown
): Promise<T> {
  try {
    const response = await axios.put<T>(`${BASE_URL}${url}`, body);
    return response.data;
  } catch (error) {
    throw new Error(
      `PUT failed for url: ${url} - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function apiPost<T = unknown>(
  url: string,
  body: unknown
): Promise<T> {
  try {
    const response = await axios.post<T>(`${BASE_URL}${url}`, body);
    return response.data;
  } catch (error) {
    throw new Error(
      `POST failed for url: ${url} - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function apiDelete<T = unknown>(url: string): Promise<T> {
  try {
    const response = await axios.delete<T>(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `DELETE failed for url: ${url} - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
