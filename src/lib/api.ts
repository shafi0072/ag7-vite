const BASE_URL = import.meta.env.VITE_API_URL || "";

function getToken(): string | null {
  return localStorage.getItem("ag7_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...options.headers,
    },
  });

  const text = await res.text();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Request failed (${res.status}): ${text.slice(0, 100)}`);
  }

  if (!res.ok) {
    throw new Error((data.error as string) || `Request failed (${res.status})`);
  }

  return data as T;
}

export const api = {
  auth: {
    signup: (email: string, password: string) =>
      request("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    login: (email: string, password: string) =>
      request<{ user: { id: string; email: string }; session: { access_token: string } }>(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      ),
    logout: () => {
      localStorage.removeItem("ag7_token");
      return request("/api/auth/logout", { method: "POST" });
    },
  },
  containers: {
    deploy: () =>
      request("/api/containers/deploy", { method: "POST" }),
    status: () =>
      request<{
        status: "creating" | "running" | "stopped" | "error" | "not_deployed";
        subdomain: string | null;
        container: {
          id: string;
          container_name: string;
          port: number;
          subdomain: string;
          status: string;
          last_started_at: string | null;
          kimi_api_key?: string;
          telegram_bot_token?: string | null;
          telegram_paired?: boolean;
        } | null;
      }>("/api/containers/status"),
    start: () =>
      request("/api/containers/start", { method: "POST" }),
    stop: () =>
      request("/api/containers/stop", { method: "POST" }),
    restart: () =>
      request("/api/containers/restart", { method: "POST" }),
    remove: () =>
      request("/api/containers", { method: "DELETE" }),
    connectTelegram: (bot_token: string) =>
      request("/api/containers/telegram", {
        method: "POST",
        body: JSON.stringify({ bot_token }),
      }),
    disconnectTelegram: () =>
      request("/api/containers/telegram", { method: "DELETE" }),
  },
  chat: {
    send: (messages: { role: string; content: string }[]) =>
      request<{ reply: string }>("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages }),
      }),
  },
  user: {
    profile: () => request("/api/user/profile"),
    updateProfile: (data: { name?: string; role?: string; preferences?: Record<string, unknown> }) =>
      request("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
};
