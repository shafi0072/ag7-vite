import { docker } from "../config/docker";
import { supabase } from "../config/supabase";
import {
  generateNginxConfig,
  removeNginxConfig,
  reloadNginx,
} from "./nginxService";
import { ContainerRecord, ContainerStatus } from "../types";
import { randomBytes } from "crypto";
import { DEMO_MODE } from "../config/env";
import { Run, startRun, step, finishRun } from "./activityLog";

const PORT_START = parseInt(process.env.PORT_START || "3100", 10);
const KIMI_API_KEY = process.env.KIMI_API_KEY || "";
const BASE_DOMAIN = process.env.BASE_DOMAIN || "localhost";
const NETWORK_NAME = "openclaw-network";
const IMAGE_NAME = "openclaw-base";

async function ensureNetwork(): Promise<void> {
  const networks = await docker.listNetworks();
  const exists = networks.some((n) => n.Name === NETWORK_NAME);
  if (!exists) {
    await docker.createNetwork({ Name: NETWORK_NAME, Driver: "bridge" });
  }
}

async function findAvailablePort(): Promise<number> {
  const { data: containers } = await supabase
    .from("containers")
    .select("port")
    .order("port", { ascending: true });

  const usedPorts = new Set((containers || []).map((c: { port: number }) => c.port));
  let port = PORT_START;

  while (usedPorts.has(port)) {
    port++;
  }

  return port;
}

async function updateContainerStatus(
  containerId: string,
  status: ContainerStatus,
  extra?: Record<string, unknown>
): Promise<void> {
  await supabase
    .from("containers")
    .update({ status, ...extra })
    .eq("id", containerId);
}

export async function getUserContainer(
  userId: string
): Promise<ContainerRecord | null> {
  const { data, error } = await supabase
    .from("containers")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as ContainerRecord;
}

export const DEPLOY_STEPS = [
  { key: "record", label: "Reserve port and create record" },
  { key: "network", label: "Prepare isolated network" },
  { key: "container", label: "Create OpenClaw container" },
  { key: "start", label: "Start agent gateway" },
  { key: "routing", label: "Configure routing" },
  { key: "health", label: "Health check" },
];

/** Per-container token for the OpenClaw control UI (never the shared LLM key). */
function newGatewayToken(): string {
  return `gw_${randomBytes(24).toString("hex")}`;
}

function containerEnv(userId: string, gatewayToken: string, telegramToken?: string): string[] {
  return [
    `KIMI_API_KEY=${KIMI_API_KEY}`,
    `GATEWAY_TOKEN=${gatewayToken}`,
    `USER_ID=${userId}`,
    `MEMORY_PATH=/data/memory/${userId}`,
    ...(telegramToken ? [`TELEGRAM_BOT_TOKEN=${telegramToken}`] : []),
  ];
}

/**
 * Starts a deploy and returns immediately with status "creating".
 * The provisioning steps run in the background and are recorded in run
 * history so the dashboard can poll progress instead of blocking for 30s.
 */
export async function deploy(userId: string): Promise<{ container: ContainerRecord; run: Run }> {
  // Check if user already has a container
  const existing = await getUserContainer(userId);
  if (existing) {
    throw new Error("User already has a deployed container");
  }

  const run = startRun(userId, "deploy", DEPLOY_STEPS);

  let record: ContainerRecord;
  try {
    record = await step(run, "record", async () => {
      const port = await findAvailablePort();
      const shortId = userId.slice(0, 8);
      const { data, error } = await supabase
        .from("containers")
        .insert({
          user_id: userId,
          container_id: "",
          container_name: `openclaw-${shortId}`,
          status: "creating" as ContainerStatus,
          port,
          subdomain: `${shortId}.${BASE_DOMAIN}`,
          kimi_api_key: KIMI_API_KEY,
          gateway_token: newGatewayToken(),
        })
        .select()
        .single();
      if (error || !data) throw new Error(`Failed to create container record: ${error?.message}`);
      return data as ContainerRecord;
    });
  } catch (err) {
    finishRun(run, err);
    throw err;
  }

  provision(userId, record, run).catch(() => {
    /* errors are captured in run history and container status */
  });

  return { container: record, run };
}

async function provision(userId: string, record: ContainerRecord, run: Run): Promise<void> {
  try {
    await step(run, "network", ensureNetwork);

    const container = await step(run, "container", async () => {
      // Remove any leftover Docker container with the same name
      try {
        const old = docker.getContainer(record.container_name);
        await old.stop().catch(() => {});
        await old.remove({ force: true });
      } catch {
        // No existing container, safe to proceed
      }
      return docker.createContainer({
        Image: IMAGE_NAME,
        name: record.container_name,
        Env: containerEnv(userId, record.gateway_token || newGatewayToken()),
        ExposedPorts: { "18789/tcp": {} },
        HostConfig: {
          PortBindings: { "18789/tcp": [{ HostPort: String(record.port) }] },
          Binds: [`memory_data:/data/memory`],
          RestartPolicy: { Name: "unless-stopped" },
          NetworkMode: NETWORK_NAME,
        },
      });
    });

    await step(run, "start", async () => {
      await container.start();
      await supabase
        .from("containers")
        .update({ container_id: container.id, last_started_at: new Date().toISOString() })
        .eq("id", record.id);
    });

    await step(run, "routing", async () => {
      await generateNginxConfig(userId, record.port);
      await reloadNginx();
    });

    await step(run, "health", async () => {
      const info = await container.inspect();
      if (!info.State.Running) throw new Error("Container exited during startup");
      await updateContainerStatus(record.id, "running");
    });

    finishRun(run);
  } catch (err) {
    await updateContainerStatus(record.id, "error");
    finishRun(run, err);
    throw err;
  }
}

export async function start(userId: string): Promise<ContainerRecord> {
  const record = await getUserContainer(userId);
  if (!record) throw new Error("No container found for user");
  if (record.status === "running") throw new Error("Container already running");

  try {
    const container = docker.getContainer(record.container_id);
    await container.start();

    await supabase
      .from("containers")
      .update({
        status: "running" as ContainerStatus,
        last_started_at: new Date().toISOString(),
      })
      .eq("id", record.id);

    return { ...record, status: "running" };
  } catch (err) {
    await updateContainerStatus(record.id, "error");
    throw err;
  }
}

export async function stop(userId: string): Promise<ContainerRecord> {
  const record = await getUserContainer(userId);
  if (!record) throw new Error("No container found for user");
  if (record.status === "stopped") throw new Error("Container already stopped");

  try {
    const container = docker.getContainer(record.container_id);
    await container.stop();

    await updateContainerStatus(record.id, "stopped");

    return { ...record, status: "stopped" };
  } catch (err) {
    await updateContainerStatus(record.id, "error");
    throw err;
  }
}

export async function restart(userId: string): Promise<ContainerRecord> {
  const record = await getUserContainer(userId);
  if (!record) throw new Error("No container found for user");

  try {
    const container = docker.getContainer(record.container_id);
    await container.restart();

    await supabase
      .from("containers")
      .update({
        status: "running" as ContainerStatus,
        last_started_at: new Date().toISOString(),
      })
      .eq("id", record.id);

    return { ...record, status: "running" };
  } catch (err) {
    await updateContainerStatus(record.id, "error");
    throw err;
  }
}

export async function getStatus(userId: string): Promise<{
  status: ContainerStatus | "not_deployed";
  subdomain: string | null;
  container: ContainerRecord | null;
}> {
  const record = await getUserContainer(userId);

  if (!record) {
    return { status: "not_deployed", subdomain: null, container: null };
  }

  // While a deploy is still provisioning there is no Docker container yet.
  if (record.status === "creating") {
    const currentSubdomain = `${record.user_id.slice(0, 8)}.${BASE_DOMAIN}`;
    return { status: "creating", subdomain: currentSubdomain, container: { ...record, subdomain: currentSubdomain } };
  }

  // Sync status with actual Docker state
  try {
    const container = docker.getContainer(record.container_id);
    const info = await container.inspect();
    const actualStatus: ContainerStatus = info.State.Running
      ? "running"
      : "stopped";

    if (actualStatus !== record.status) {
      await updateContainerStatus(record.id, actualStatus);
      record.status = actualStatus;
    }
  } catch {
    // Container doesn't exist in Docker anymore
    if (record.status !== "error") {
      await updateContainerStatus(record.id, "error");
      record.status = "error";
    }
  }

  // Always use current BASE_DOMAIN in case it changed since deploy
  const currentSubdomain = `${record.user_id.slice(0, 8)}.${BASE_DOMAIN}`;

  return {
    status: record.status,
    subdomain: currentSubdomain,
    container: { ...record, subdomain: currentSubdomain },
  };
}

export async function remove(userId: string): Promise<void> {
  const record = await getUserContainer(userId);
  if (!record) throw new Error("No container found for user");

  try {
    const container = docker.getContainer(record.container_id);

    // Stop if running
    try {
      await container.stop();
    } catch {
      // May already be stopped
    }

    // Remove the container
    await container.remove({ force: true });
  } catch {
    // Container may not exist in Docker, proceed with cleanup
  }

  // Remove Nginx config
  await removeNginxConfig(userId);
  await reloadNginx();

  // Remove DB record
  await supabase.from("containers").delete().eq("id", record.id);
}

export async function setTelegramToken(
  userId: string,
  botToken: string
): Promise<ContainerRecord> {
  const record = await getUserContainer(userId);
  if (!record) throw new Error("No container found for user");

  // Save token to DB, mark as not yet paired
  await supabase
    .from("containers")
    .update({ telegram_bot_token: botToken, telegram_paired: false })
    .eq("id", record.id);

  // Recreate container with TELEGRAM_BOT_TOKEN env var
  try {
    const oldContainer = docker.getContainer(record.container_id);
    try { await oldContainer.stop(); } catch { /* may already be stopped */ }
    try { await oldContainer.remove({ force: true }); } catch { /* ignore */ }
  } catch {
    // Container may not exist
  }

  await ensureNetwork();

  const container = await docker.createContainer({
    Image: IMAGE_NAME,
    name: record.container_name,
    Env: containerEnv(userId, record.gateway_token || newGatewayToken(), botToken),
    ExposedPorts: { "18789/tcp": {} },
    HostConfig: {
      PortBindings: {
        "18789/tcp": [{ HostPort: String(record.port) }],
      },
      Binds: [`memory_data:/data/memory`],
      RestartPolicy: { Name: "unless-stopped" },
      NetworkMode: NETWORK_NAME,
    },
  });

  await container.start();

  await supabase
    .from("containers")
    .update({
      container_id: container.id,
      status: "running" as ContainerStatus,
      last_started_at: new Date().toISOString(),
    })
    .eq("id", record.id);

  return { ...record, telegram_bot_token: botToken, status: "running" };
}

export async function approveTelegramPairing(
  userId: string,
  pairingCode: string
): Promise<{ message: string }> {
  const record = await getUserContainer(userId);
  if (!record) throw new Error("No container found for user");

  if (DEMO_MODE) {
    // Demo: no real container to exec into; accept 6-8 char codes.
    if (!/^[A-Z0-9]{6,8}$/i.test(pairingCode)) throw new Error("Invalid or expired pairing code. Send /start to your bot again to get a new code.");
    await supabase.from("containers").update({ telegram_paired: true }).eq("id", record.id);
    return { message: "Telegram pairing approved successfully" };
  }

  const { execSync } = require("child_process");
  try {
    execSync(
      `docker exec ${record.container_name} openclaw pairing approve telegram ${pairingCode}`,
      { timeout: 15000, encoding: "utf-8" }
    );
  } catch (err: any) {
    const stderr = err.stderr || err.stdout || "";
    if (stderr.includes("No pending pairing request")) {
      throw new Error("Invalid or expired pairing code. Send /start to your bot again to get a new code.");
    }
    throw new Error(stderr.trim() || "Pairing approval failed");
  }

  // Mark as paired in DB
  await supabase
    .from("containers")
    .update({ telegram_paired: true })
    .eq("id", record.id);

  return { message: "Telegram pairing approved successfully" };
}

export async function removeTelegramToken(userId: string): Promise<void> {
  const record = await getUserContainer(userId);
  if (!record) throw new Error("No container found for user");

  await supabase
    .from("containers")
    .update({ telegram_bot_token: null, telegram_paired: false })
    .eq("id", record.id);

  // Restart container without telegram token
  try {
    const container = docker.getContainer(record.container_id);
    await container.restart();
  } catch {
    // ignore if container not running
  }
}

/** Last N lines of the agent container's logs. */
export async function getLogs(userId: string, tail = 200): Promise<string[]> {
  const record = await getUserContainer(userId);
  if (!record || !record.container_id) return [];
  try {
    const buf: Buffer = (await docker.getContainer(record.container_id).logs({
      stdout: true, stderr: true, tail, timestamps: true,
    } as any)) as unknown as Buffer;
    // Docker multiplexes stdout/stderr with 8-byte frame headers; strip them.
    const text = buf.toString("utf-8").replace(/[\x00-\x08]/g, "");
    return redact(text).split("\n").filter(Boolean).slice(-tail);
  } catch {
    return [];
  }
}

/** Remove anything that looks like a key or token before it leaves the API. */
export function redact(text: string): string {
  return text
    .replace(/\b(sk|gw)[-_][A-Za-z0-9]{12,}\b/g, "$1_****")
    .replace(/\b\d{6,}:[A-Za-z0-9_-]{30,}\b/g, "****:telegram-token");
}

/** Client-safe view of a container record: no shared LLM key, masked bot token. */
export function toPublic(record: ContainerRecord | null) {
  if (!record) return null;
  const { kimi_api_key: _k, telegram_bot_token, ...rest } = record;
  return {
    ...rest,
    telegram_connected: !!telegram_bot_token,
    telegram_bot_token: telegram_bot_token ? `${telegram_bot_token.split(":")[0]}:****` : null,
  };
}
