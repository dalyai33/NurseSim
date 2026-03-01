/**
 * Shared API base URL and fetch helper for backend (web/backend Flask app).
 * Use credentials: "include" so session cookie is sent.
 */
export const API_BASE = "http://127.0.0.1:5000";

export type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<{ data: T; ok: boolean; status: number }> {
  const { method = "GET", body } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { data, ok: res.ok, status: res.status };
}
