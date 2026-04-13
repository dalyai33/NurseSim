/**
 * Shared API base URL and fetch helper for backend (web/backend Flask app).
 * Use credentials: "include" so session cookie is sent.
 */
const API_URL = import.meta.env.VITE_API_URL;

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {}
): Promise<{ data: T }> {
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  let data: T;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid JSON response");
  }

  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in (data as Record<string, unknown>)
        ? String((data as Record<string, unknown>).error)
        : `API error: ${res.status}`;
    throw new Error(message);
  }

  return { data };
}