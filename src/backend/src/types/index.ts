import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export type ContainerStatus = "creating" | "running" | "stopped" | "error";

export interface ContainerRecord {
  id: string;
  user_id: string;
  container_id: string;
  container_name: string;
  status: ContainerStatus;
  port: number;
  subdomain: string;
  kimi_api_key: string;
  telegram_bot_token: string | null;
  telegram_paired: boolean;
  created_at: string;
  last_started_at: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role?: string;
  preferences?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
