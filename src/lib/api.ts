const BASE_URL = import.meta.env.VITE_API_URL || "";

/** Request timeout and retry policy (retries only safe GETs and network/5xx failures). */
const TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;

export class ApiError extends Error {
  constructor(message: string, public status: number, public retryable: boolean) {
    super(message);
    this.name = "ApiError";
  }
}

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function once<T>(path: string, options: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: ctrl.signal,
      headers: { ...authHeaders(), ...options.headers },
    });
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === "AbortError";
    throw new ApiError(
      timedOut ? "The server took too long to respond." : "Can't reach the AG7 server. Check your connection.",
      0,
      true
    );
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new ApiError(`Request failed (${res.status})`, res.status, res.status >= 500);
  }

  if (res.status === 401 && getToken()) {
    // Session expired: clear it and send the user back to login.
    localStorage.removeItem("ag7_token");
    if (!["/login", "/signup"].includes(window.location.pathname)) {
      window.location.assign("/login?expired=1");
    }
  }

  if (!res.ok) {
    throw new ApiError((data.error as string) || `Request failed (${res.status})`, res.status, res.status >= 500);
  }
  return data as T;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || "GET").toUpperCase();
  const attempts = method === "GET" ? MAX_RETRIES + 1 : 1;
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await once<T>(path, options);
    } catch (err) {
      lastErr = err;
      if (!(err instanceof ApiError) || !err.retryable || i === attempts - 1) break;
      await sleep(400 * 2 ** i); // 400ms, 800ms
    }
  }
  throw lastErr;
}

export type ContainerStatusValue = "creating" | "running" | "stopped" | "error" | "not_deployed";

export interface ContainerInfo {
  id: string;
  container_name: string;
  port: number;
  subdomain: string;
  status: string;
  last_started_at: string | null;
  gateway_token?: string | null;
  telegram_bot_token?: string | null;
  telegram_connected?: boolean;
  telegram_paired?: boolean;
}

export type RunStatus = "running" | "success" | "error";
export type StepStatus = "pending" | "running" | "success" | "error" | "skipped";

export interface RunStep {
  key: string;
  label: string;
  status: StepStatus;
  startedAt: string | null;
  finishedAt: string | null;
  error?: string;
}

export interface Run {
  id: string;
  action: string;
  status: RunStatus;
  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;
  error?: string;
  steps: RunStep[];
}

export const api = {
  health: () => request<{ status: string; demo?: boolean }>("/api/health"),
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
      request<{ message: string; container: ContainerInfo; runId: string }>("/api/containers/deploy", { method: "POST" }),
    status: () =>
      request<{
        status: ContainerStatusValue;
        subdomain: string | null;
        container: ContainerInfo | null;
      }>("/api/containers/status"),
    start: () =>
      request("/api/containers/start", { method: "POST" }),
    stop: () =>
      request("/api/containers/stop", { method: "POST" }),
    restart: () =>
      request("/api/containers/restart", { method: "POST" }),
    remove: () =>
      request("/api/containers", { method: "DELETE" }),
    activity: () => request<{ runs: Run[] }>("/api/containers/activity"),
    logs: (tail = 200) => request<{ lines: string[] }>(`/api/containers/logs?tail=${tail}`),
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

export const IS_DEMO = import.meta.env.VITE_DEMO_MODE === "true";
