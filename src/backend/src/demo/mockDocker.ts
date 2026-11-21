/**
 * DEMO MODE ONLY — simulates the parts of the Dockerode API that
 * containerService uses. Nothing is actually started on the host;
 * each call waits a short, realistic delay so progress UI is visible.
 */
import { randomBytes } from "crypto";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const DELAY = parseInt(process.env.DEMO_STEP_DELAY_MS || "900", 10);

interface FakeContainer { id: string; name: string; running: boolean; env: string[]; startedAt: number; }
const containers = new Map<string, FakeContainer>();
// DEMO_FAIL_FIRST_DEPLOY=true makes the first container start fail, to exercise error + retry UI.
let failNextStart = process.env.DEMO_FAIL_FIRST_DEPLOY === "true";
const networks = new Set<string>();

function lookup(idOrName: string) {
  for (const c of containers.values()) if (c.id === idOrName || c.name === idOrName) return c;
  return null;
}

function handle(idOrName: string) {
  const need = () => {
    const c = lookup(idOrName);
    if (!c) throw Object.assign(new Error(`No such container: ${idOrName}`), { statusCode: 404 });
    return c;
  };
  return {
    id: idOrName,
    async start() {
      await sleep(DELAY);
      const c = need();
      if (failNextStart) {
        failNextStart = false;
        throw new Error("Gateway did not become ready: port 18789 bind timed out (simulated)");
      }
      c.running = true;
      c.startedAt = Date.now();
    },
    async stop() { await sleep(DELAY / 2); const c = need(); c.running = false; },
    async restart() { await sleep(DELAY); const c = need(); c.running = true; c.startedAt = Date.now(); },
    async remove(_o?: unknown) { const c = need(); containers.delete(c.id); },
    async inspect() { const c = need(); return { Id: c.id, State: { Running: c.running } }; },
    async logs() {
      const c = need();
      return Buffer.from(fakeLogs(c).join("\n"));
    },
  };
}

function fakeLogs(c: FakeContainer): string[] {
  const t0 = c.startedAt;
  const ts = (s: number) => new Date(t0 + s * 1000).toISOString();
  const hasTelegram = c.env.some((e) => e.startsWith("TELEGRAM_BOT_TOKEN="));
  const lines = [
    `${ts(0)} [entrypoint] Booting OpenClaw gateway`,
    `${ts(0.4)} [config] Model provider: moonshot (kimi) — key loaded from env (redacted)`,
    `${ts(0.9)} [memory] Mounted memory volume at /data/memory`,
    `${ts(1.3)} [gateway] Listening on 0.0.0.0:18789 (bind=lan)`,
    `${ts(1.6)} [skills] Loaded 4 skills: heartbeat, brain, search, calendar`,
    hasTelegram
      ? `${ts(2.1)} [telegram] Channel enabled, polling for updates`
      : `${ts(2.1)} [telegram] No bot token configured — channel disabled`,
    `${ts(2.5)} [health] Ready`,
  ];
  if (c.running) {
    const secs = Math.floor((Date.now() - t0) / 1000);
    for (let s = 30; s < secs && s < 600; s += 30) lines.push(`${ts(s)} [heartbeat] ok (uptime ${s}s)`);
  } else {
    lines.push(`${new Date().toISOString()} [gateway] Received SIGTERM, shutting down`);
  }
  return lines;
}

export const mockDocker = {
  async listNetworks() { return [...networks].map((Name) => ({ Name })); },
  async createNetwork({ Name }: { Name: string }) { await sleep(DELAY / 2); networks.add(Name); },
  getContainer: (idOrName: string) => handle(idOrName),
  async createContainer(opts: { name: string; Env?: string[] }) {
    await sleep(DELAY);
    const id = randomBytes(32).toString("hex");
    containers.set(id, { id, name: opts.name, running: false, env: opts.Env || [], startedAt: Date.now() });
    return handle(id);
  },
};
