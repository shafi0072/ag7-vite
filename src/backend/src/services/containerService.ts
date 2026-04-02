import { docker } from "../config/docker";
import { supabase } from "../config/supabase";
import {
  generateNginxConfig,
  removeNginxConfig,
  reloadNginx,
} from "./nginxService";
import { ContainerRecord, ContainerStatus } from "../types";

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

  const usedPorts = new Set((containers || []).map((c) => c.port));
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

export async function deploy(userId: string): Promise<ContainerRecord> {
  // Check if user already has a container
  const existing = await getUserContainer(userId);
  if (existing) {
    throw new Error("User already has a deployed container");
  }

  const port = await findAvailablePort();
  const shortId = userId.slice(0, 8);
  const containerName = `openclaw-${shortId}`;
  const subdomain = `${shortId}.${BASE_DOMAIN}`;

  // Create DB record first with 'creating' status
  const { data: record, error: dbError } = await supabase
    .from("containers")
    .insert({
      user_id: userId,
      container_id: "",
      container_name: containerName,
      status: "creating" as ContainerStatus,
      port,
      subdomain,
      kimi_api_key: KIMI_API_KEY,
    })
    .select()
    .single();

  if (dbError || !record) {
    throw new Error(`Failed to create container record: ${dbError?.message}`);
  }

  try {
    await ensureNetwork();

    // Remove any leftover Docker container with the same name
    try {
      const old = docker.getContainer(containerName);
      await old.stop().catch(() => {});
      await old.remove({ force: true });
    } catch {
      // No existing container, safe to proceed
    }

    // Create Docker container
    const container = await docker.createContainer({
      Image: IMAGE_NAME,
      name: containerName,
      Env: [
        `KIMI_API_KEY=${KIMI_API_KEY}`,
        `USER_ID=${userId}`,
        `MEMORY_PATH=/data/memory/${userId}`,
      ],
      ExposedPorts: { "18789/tcp": {} },
      HostConfig: {
        PortBindings: {
          "18789/tcp": [{ HostPort: String(port) }],
        },
        Binds: [`memory_data:/data/memory`],
        RestartPolicy: { Name: "unless-stopped" },
        NetworkMode: NETWORK_NAME,
      },
    });

    // Start the container
    await container.start();

    const dockerId = container.id;

    // Update DB with Docker container ID and running status
    await supabase
      .from("containers")
      .update({
        container_id: dockerId,
        status: "running" as ContainerStatus,
        last_started_at: new Date().toISOString(),
      })
      .eq("id", record.id);

    // Generate Nginx config and reload
    await generateNginxConfig(userId, port);
    await reloadNginx();

    return {
      ...record,
      container_id: dockerId,
      status: "running",
      last_started_at: new Date().toISOString(),
    } as ContainerRecord;
  } catch (err) {
    // Update status to error on failure
    await updateContainerStatus(record.id, "error");
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
    Env: [
      `KIMI_API_KEY=${KIMI_API_KEY}`,
      `USER_ID=${userId}`,
      `MEMORY_PATH=/data/memory/${userId}`,
      `TELEGRAM_BOT_TOKEN=${botToken}`,
    ],
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
