import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const CONF_DIR = process.env.NGINX_CONF_DIR || "/etc/nginx/conf.d";
const BASE_DOMAIN = process.env.BASE_DOMAIN || "localhost";
const SERVER_IP = process.env.SERVER_IP || "72.61.83.129";
const IS_DEV = process.env.NODE_ENV === "development";

export async function generateNginxConfig(
  userId: string,
  port: number
): Promise<void> {
  if (IS_DEV) {
    console.log(`[Nginx] Skipping config generation in dev (user=${userId.slice(0, 8)}, port=${port})`);
    return;
  }

  const sanitizedId = userId.replace(/[^a-zA-Z0-9]/g, "_");
  const subdomain = userId.slice(0, 8);

  const config = `upstream openclaw_${sanitizedId} {
    server host.docker.internal:${port};
}

server {
    listen 80;
    listen 443 ssl;
    server_name ${subdomain}.${BASE_DOMAIN} ${subdomain}.${SERVER_IP}.nip.io;

    ssl_certificate /etc/nginx/ssl/selfsigned.crt;
    ssl_certificate_key /etc/nginx/ssl/selfsigned.key;

    location / {
        proxy_pass http://openclaw_${sanitizedId};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
`;

  await fs.mkdir(CONF_DIR, { recursive: true });
  await fs.writeFile(path.join(CONF_DIR, `${sanitizedId}.conf`), config);
}

export async function removeNginxConfig(userId: string): Promise<void> {
  if (IS_DEV) return;

  const sanitizedId = userId.replace(/[^a-zA-Z0-9]/g, "_");
  const confPath = path.join(CONF_DIR, `${sanitizedId}.conf`);

  try {
    await fs.unlink(confPath);
  } catch {
    // Config may not exist, ignore
  }
}

export async function reloadNginx(): Promise<void> {
  if (IS_DEV) return;

  try {
    await execAsync("docker exec ag7-nginx nginx -s reload");
  } catch (err) {
    console.warn("[Nginx] Reload failed (may not be running in dev):", err);
  }
}
