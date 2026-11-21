// Types used by the exported components (copied from src/lib/api.ts).
// The live app imports these from "@/lib/api"; for Remotion, alias "@/lib/api" to this file.

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

