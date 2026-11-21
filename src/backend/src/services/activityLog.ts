import { randomUUID } from "crypto";

/**
 * Run history: every container action (deploy, start, stop, ...) is recorded
 * as a "run" with ordered steps, so the UI can show live progress and history.
 * Kept in memory (last MAX_RUNS per user); resets when the API restarts.
 */
export type RunStatus = "running" | "success" | "error";
export type StepStatus = "pending" | "running" | "success" | "error" | "skipped";
export type RunAction = "deploy" | "start" | "stop" | "restart" | "delete" | "telegram_connect" | "telegram_disconnect";

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
  action: RunAction;
  status: RunStatus;
  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;
  error?: string;
  steps: RunStep[];
}

const MAX_RUNS = 50;
const runsByUser = new Map<string, Run[]>();

const now = () => new Date().toISOString();

export function startRun(userId: string, action: RunAction, steps: { key: string; label: string }[]): Run {
  const run: Run = {
    id: randomUUID(),
    action,
    status: "running",
    startedAt: now(),
    finishedAt: null,
    durationMs: null,
    steps: steps.map((s) => ({ ...s, status: "pending", startedAt: null, finishedAt: null })),
  };
  const list = runsByUser.get(userId) || [];
  list.unshift(run);
  runsByUser.set(userId, list.slice(0, MAX_RUNS));
  return run;
}

/** Runs `fn` as the named step, marking it running -> success/error. */
export async function step<T>(run: Run, key: string, fn: () => Promise<T>): Promise<T> {
  const s = run.steps.find((x) => x.key === key);
  if (!s) return fn();
  s.status = "running";
  s.startedAt = now();
  try {
    const result = await fn();
    s.status = "success";
    s.finishedAt = now();
    return result;
  } catch (err) {
    s.status = "error";
    s.finishedAt = now();
    s.error = err instanceof Error ? err.message : String(err);
    throw err;
  }
}

export function finishRun(run: Run, err?: unknown): void {
  run.finishedAt = now();
  run.durationMs = Date.parse(run.finishedAt) - Date.parse(run.startedAt);
  if (err) {
    run.status = "error";
    run.error = err instanceof Error ? err.message : String(err);
    run.steps.forEach((s) => { if (s.status === "pending") s.status = "skipped"; });
  } else {
    run.status = "success";
  }
}

/** Wraps a one-step action (start/stop/...) so it shows up in run history. */
export async function trackSimple<T>(userId: string, action: RunAction, label: string, fn: () => Promise<T>): Promise<T> {
  const run = startRun(userId, action, [{ key: action, label }]);
  try {
    const result = await step(run, action, fn);
    finishRun(run);
    return result;
  } catch (err) {
    finishRun(run, err);
    throw err;
  }
}

export function getRuns(userId: string): Run[] {
  return runsByUser.get(userId) || [];
}
