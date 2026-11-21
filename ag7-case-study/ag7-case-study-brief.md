# AG7: Case Study Brief

> Sources: the `ag7` repository (Next.js frontend and original backend, 35 commits) and the `ag7-vite` repository (Vite migration with the same backend under `src/backend`, branch `case-study-demo`). Anything not provable from code or git history is marked **GUESS**.

---

## 1. One-line summary

AG7 is a SaaS platform where anyone can deploy their own OpenClaw AI agent in one click. Each user gets an isolated Docker container, plus a personal dashboard (chat, tasks, calendar) and a Telegram channel to talk to the agent.

## 2. The problem it solves

- Self-hosting an AI agent like OpenClaw today means a server, Docker, model API keys, a reverse proxy and channel setup. AG7 turns that into a single "Deploy Now" button. *(From `docs/HANDOFF.md` §1 and §6.)*
- It gives each user their own agent, with a separate container, port, routing rule and memory path, so one user's agent and data don't mix with another's. *(From `containerService.ts`: per-user container name, `USER_ID`, `MEMORY_PATH=/data/memory/<user>`.)*
- **GUESS:** The audience is non-technical individuals and small teams who want a personal AI assistant (planning, tasks, "areas of life") on channels they already use, such as Telegram, without touching infrastructure. The dashboard copy ("Areas of life", "Productivity", "Tasks Done") points to a personal-productivity angle, but no product doc says who the target user is.
- **GUESS:** The product is a managed service, with AG7 paying for model usage, because one shared model key is injected into every container (`HANDOFF.md` §11: "Kimi API key is shared across all users"). The repo has no pricing or billing code.

## 3. Main user flow (8 steps)

1. Sign up with email and password (`/signup` → `POST /api/auth/signup`, which creates the user and signs them in).
2. Onboarding: language, timezone, name and agent name (`/onboarding` → `PUT /api/user/profile`).
3. Land on the dashboard and click **Deploy Now** on the "Your OpenClaw Bot" card (`POST /api/containers/deploy`).
4. Watch the deploy progress through 6 tracked steps: record → network → container → start → routing → health (`GET /api/containers/status` and `/activity`, polled every second).
5. Agent is **Running**. Stop, Restart or Open Bot controls appear, and the gateway token is scoped to this container.
6. Chat with the assistant in the web app (`/chat` → `POST /api/chat`).
7. Settings → **Connect Telegram**: paste a BotFather token. The container is recreated with the Telegram channel enabled (`POST /api/containers/telegram`).
8. Check run history and live agent logs on **Activity** (`GET /api/containers/activity` and `/logs`).

## 4. Architecture

| Layer | What it is | Key files |
|---|---|---|
| Frontend | React 18 SPA (Vite) with React Router, Tailwind and i18next (14 locales). A Next.js 14 version also exists in `ag7`. | `src/App.tsx`, `src/lib/api.ts`, `src/components/**`, `src/pages/**` |
| Backend API | Express 4 + TypeScript. Routes: auth, containers, user, chat. | `src/backend/src/index.ts`, `routes/*.ts` |
| Auth and data | Supabase Auth plus Postgres with Row Level Security. Tables: `users`, `containers`. | `src/backend/src/config/supabase.ts`, `supabase/migrations/*.sql` |
| Orchestration | Dockerode drives the host Docker daemon: it creates a per-user `openclaw-<id>` container on a shared bridge network with its own host port starting at 3100. | `services/containerService.ts`, `config/docker.ts` |
| Routing | The API writes one Nginx `server` block per user (upstream to `host.docker.internal:<port>`) and hot-reloads Nginx. | `services/nginxService.ts`, `nginx/*.conf` |
| Agent / AI layer | One OpenClaw gateway per user, configured at boot by `entrypoint.sh`: Moonshot **Kimi K2.5** as the primary model, LAN bind on port 18789, optional Telegram channel. The dashboard chat calls Kimi directly through `/api/chat`. | `docker/openclaw/Dockerfile`, `docker/openclaw/entrypoint.sh`, `routes/chat.ts` |
| Integrations | Moonshot (LLM), Telegram Bot API, Supabase, GitHub Actions (deploys to the VPS over SSH on push to `main`). | `.github/workflows/deploy.yml` (in `ag7`) |
| Infra | A single VPS running Docker Compose (API on `node:20-alpine`, `nginx:alpine`) with TLS at Nginx. | `src/backend/docker-compose*.yml`, `Dockerfile` |

**Data flow (deploy):**

```
Browser (React)
  -> Express API  [Bearer token checked against Supabase Auth]
     -> Supabase Postgres   (containers row: status=creating, port, gateway token)
     -> Docker daemon       (create + start openclaw-<id> on openclaw-network)
          -> OpenClaw gateway :18789 -> Moonshot Kimi K2.5
     -> Nginx conf.d        (per-user server block) -> nginx -s reload
  <- status/activity polling -> "Running" + Open Bot
User's Telegram -> Telegram Bot API -> OpenClaw (in the user's container) -> Kimi
```

## 5. Tech stack (versions as installed)

**Frontend (`ag7-vite`):** React 18.3.1, React DOM 18.3.1, React Router DOM 6.30.3, Vite 5.4.21, @vitejs/plugin-react 4.7.0, TypeScript 5.9.3, Tailwind CSS 3.4.19, PostCSS 8.5.8, Autoprefixer 10.4.27, lucide-react 1.7.0, i18next 26.0.3, react-i18next 17.0.2, react-joyride 3.0.2 (dashboard tour), clsx, tailwind-merge, class-variance-authority.
**Frontend (`ag7`, original):** Next.js 14.2.35 (App Router).
**Backend:** Node.js (Docker base `node:20-alpine`; handoff says Node 22+ locally), Express 4.22.1, @supabase/supabase-js 2.100.1, dockerode 4.0.10, pg 8.20.0, cors 2.8.6, dotenv 16.6.1, tsx 4.21.0, TypeScript 5.9.3.
**Agent:** OpenClaw (built from source in `node:22-slim` with pnpm), Moonshot Kimi K2.5 (256,000-token context window, 8,192 max output tokens, per `entrypoint.sh`).
**Infra:** Docker + Docker Compose, Nginx (alpine), Supabase (Postgres + Auth), GitHub Actions (`appleboy/ssh-action@v1`), a single VPS.

## 6. Three hardest engineering problems

**1. Making a per-user OpenClaw gateway reachable from outside its container.**
OpenClaw listens on loopback by default, so containers started but couldn't be reached through the proxy. The fixes came over several commits: listen on all interfaces (`d456eb3`), switch to OpenClaw's own `--bind lan` flag (`2b9b3e3`), allow the non-loopback control UI in config (`d35a02a`), and let the Nginx container resolve the host with `extra_hosts: host.docker.internal` (`26b5c15`). The final boot config is written by `docker/openclaw/entrypoint.sh`.

**2. Dynamic per-user routing from inside a containerised API.**
Every deploy needs a new public route without a manual Nginx edit. `nginxService.ts` writes a `server` block per user (upstream to that user's host port) and runs `nginx -s reload` inside the Nginx container. Making this work from the API container needed the Docker CLI installed in the API image (`dd85170`), a bind-mounted `conf.d` shared between the API and Nginx instead of a named volume (`96125cd`), and IP-based wildcard hostnames so routing worked before DNS existed (`07e295a`, `b5d5fcb`). In development the step is skipped (`IS_DEV` guard).

**3. Telegram onboarding without a manual pairing step.**
The first version needed users to copy a pairing code back into the app (`approveTelegramPairing`, which runs `openclaw pairing approve` through `docker exec`). Commit `b5d5fcb` replaced that: the token is saved, the container is recreated with `TELEGRAM_BOT_TOKEN`, and the entrypoint waits for the gateway to become healthy before it registers the channel with an open DM policy (`containerService.setTelegramToken`, `entrypoint.sh`). The frontend validates the token format and checks it against Telegram's `getMe` before saving (`SettingsPage.tsx`).

## 7. Numbers from the repos (no invented metrics)

| Metric | Value | Source |
|---|---|---|
| Build duration, first to last commit | 2026-03-26 → 2026-04-02 (8 calendar days) | `git log` in `ag7` |
| Commits | 35 in `ag7` (5 are merged PRs); 1 in `ag7-vite` before this branch; +2 on `case-study-demo` | `git log` |
| API endpoints (original) | 16, including health: auth 3, containers 9, user 2, chat 1, health 1 | `src/backend/src/routes/*.ts` |
| API endpoints (this branch) | 18 (added `GET /containers/activity` and `GET /containers/logs`) | same |
| Agents | 1 OpenClaw agent per user; maximum 1 container per user (409 if a second is requested) | `containerService.deploy` |
| Model | 1 (Kimi K2.5) | `entrypoint.sh`, `routes/chat.ts` |
| Automated tests | 0 test files | `find` for `*.test.*` / `*.spec.*` |
| Automated provisioning steps per deploy | 6 tracked steps (record, network, container, start, routing, health) | `DEPLOY_STEPS` in `containerService.ts` |
| CI/CD | 1 workflow (deploy over SSH on push to `main`) | `.github/workflows/deploy.yml` |
| Database tables | 2 (`users`, `containers`), RLS enabled on both, 5 policies | `supabase/migrations/20260326000000_create_tables.sql` |
| UI languages | 14 locale files | `src/locales/` |
| Frontend + backend TypeScript | about 7,300 lines in `ag7-vite/src` (this branch) | `wc -l` |
| Limits | Host ports start at 3100 with a unique index; restart policy `unless-stopped`; pairing exec timeout 15 s; proxy read timeout 86,400 s; model context 256k, max output 8,192 tokens | code and config files above |

## 8. Guardrails and safety features

Already in the original code:
- Every container, user and chat route needs a Supabase Bearer token (`middleware/auth.ts`).
- Row Level Security on both tables; the service role is used only server side.
- One container per user; unique container names and ports enforced in the database.
- Each user has a separate container, memory path and routing rule.
- Telegram token format is validated, and checked against Telegram, before it is saved.
- Leftover containers with the same name are cleaned up before a redeploy.
- Status is reconciled against real Docker state on every `/status` call.
- Nginx steps are skipped in development so a local run can't break the proxy.

Added on `case-study-demo` (see §9): an approval step before destructive actions, the shared model key no longer reaching the browser, log redaction, a visible demo-mode marker, and restored route protection.

Known risks (from code, not fixed here): every container shares one model API key; OpenClaw config sets `dangerouslyDisableDeviceAuth` and the Telegram channel accepts DMs from anyone (`allowFrom: ["*"]`); the `docker exec` pairing call interpolates user input into a shell command; there is no rate limiting.

## 9. Improvements added in this version (`case-study-demo`)

| # | Improvement | Files changed |
|---|---|---|
| 0 | **Local wiring and demo mode** (setup, not counted as one of the 5): `ENV_FILE=.env.demo` swaps Supabase for an in-memory DB and auth, Docker for a simulator and Kimi for canned replies. The real `.env` is never read. | `src/backend/src/config/env.ts`, `config/supabase.ts`, `config/docker.ts`, `src/backend/src/demo/*`, `routes/chat.ts`, `src/backend/.env.demo`, `.env.demo`, both `package.json` (`dev:demo`) |
| 1 | **Live deploy progress.** Deploy now returns `202` straight away and provisioning runs as 6 tracked steps. The dashboard card polls every second and shows a step list with timings, a progress bar and the failure reason. This replaces a fixed 30-second blind wait. | `services/containerService.ts`, `services/activityLog.ts`, `routes/containers.ts`, `components/dashboard/DeployProgress.tsx`, `components/dashboard/ContainerPanel.tsx` |
| 2 | **Run history and live logs.** New Activity page: success rate, average deploy time, expandable per-step history for every action, and a live-tailing log panel with pause/resume. | `pages/Activity.tsx`, `components/activity/RunHistory.tsx`, `components/activity/LogsPanel.tsx`, `routes/containers.ts` (`/activity`, `/logs`), `App.tsx`, `layout/Sidebar.tsx` |
| 3 | **Error handling and retry.** The API client has a 15 s timeout, retries GET requests up to 2 times with backoff on network or 5xx errors, and shows readable error messages. Error banners have a Retry button. A failed chat reply shows a Retry button, and line breaks in replies are kept. | `lib/api.ts`, `components/dashboard/ContainerPanel.tsx`, `components/chat/ChatPage.tsx` |
| 4 | **Guardrails.** An approval dialog lists exactly what will happen before Delete or Redeploy. Each container gets its own gateway token, so the shared model key is no longer used as the gateway token or sent to the browser. Telegram tokens are masked in API responses, and keys and tokens are redacted from logs. A demo-mode badge shows when integrations are simulated. | `components/ui/ConfirmDialog.tsx`, `components/layout/DemoBadge.tsx`, `services/containerService.ts` (`toPublic`, `redact`), `docker/openclaw/entrypoint.sh`, `supabase/migrations/20261121000000_add_gateway_token.sql` |
| 5 | **Auth guard restored.** Protected routes redirect to login again; `VITE_AUTH_DISABLED=true` keeps the old open preview for design tools. A 401 clears the session and shows "session expired" on the login page. | `App.tsx`, `lib/api.ts`, `pages/Login.tsx`, `vite-env.d.ts` |

Shared UI added: `components/ui/StatusBadge.tsx` (status badge and icon).

---

### Appendix: running the demo locally

```bash
cd src/backend && npm install && npm run dev:demo     # API in demo mode
npm run dev:demo                                       # frontend (repo root), proxies /api
```

Sign in with the demo account defined in `src/backend/.env.demo`. Add `DEMO_FAIL_FIRST_DEPLOY=true` to simulate one failed deploy, which shows the error and the approve-redeploy path.

**Mocked in demo mode:** Supabase (auth and DB), Docker (container lifecycle and logs), Moonshot Kimi (chat replies), Telegram (token check and channel), Nginx (skipped in development). The UI and API code paths are real; only those adapters are swapped.
