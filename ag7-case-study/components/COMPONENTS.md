# AG7 components for the motion-graphics rebuild (Remotion)

Exported from branch `case-study-demo`. Sources in `src/` mirror the app's `src/` paths. All data in `sample-props/` is fake.

## Setup notes

- **Styling:** Tailwind CSS 3 (`styles/tailwind.config.ts`, `styles/postcss.config.mjs`) plus `styles/global.css` (CSS variables `--background` and `--foreground`, scrollbar styles). The full token list (colours, radii, shadows, glow effects, type scale, motion) is in `styles/theme-tokens.json`.
- **Theme:** the app is dark only. There is no light mode, so every render is in the dark theme.
- **Font:** Inter at weights 300 to 700, loaded from Google Fonts in `index.html`. Logs use Tailwind's `font-mono`.
- **Icons:** `lucide-react` (package.json range `^1.7.0`, installed 1.7.0). Sidebar and Topbar draw their own inline SVG icons, which are included in those files. Versions are in `package-deps.json`.
- **shadcn/ui:** not used. There is no `components.json`; the shared UI is the hand-written `ui/StatusBadge.tsx` and `ui/ConfirmDialog.tsx`, plus `lib/utils.ts` (`cn`, clsx + tailwind-merge).
- **Imports:** components import from `@/…`. Alias `@` to `src/`, and alias `@/lib/api` to `src/lib/api-types.ts`, which holds the types only (`Run`, `RunStep`, `ContainerInfo`, …) without the network client.
- **Assets:** `assets/logo.svg` (AG7 wordmark). The Topbar avatar photo is **not** exported; renders use a neutral placeholder.
- **Data-fetching components:** `ContainerPanel` and `Activity` fetch from the API. For Remotion, either drive the presentational parts (`DeployProgress`, `RunHistory`, `LogsPanel`) directly from props, or replace the `api.*` calls with the fixture objects in the sample-props files.
- **Timers** in `DeployProgress` use `Date.now()` for steps still running. Pin "now" to just after the run's `startedAt` (the renders used `2026-11-21T14:02:14.700Z`), or pass a frame-based clock.

## Component map

| # | You asked for | Closest real match | File(s) |
|---|---|---|---|
| 1 | Agent run / deploy status card | `ContainerPanel` (dashboard card) + `DeployProgress` (progress bar, step list) + `StatusBadge` | `src/components/dashboard/ContainerPanel.tsx`, `src/components/dashboard/DeployProgress.tsx`, `src/components/ui/StatusBadge.tsx` |
| 2 | Live logs panel | `LogsPanel` | `src/components/activity/LogsPanel.tsx` |
| 3 | Guardrail / approval step | `ConfirmDialog` (approval before Delete or Redeploy, listing what will happen) + `DemoBadge` ("integrations simulated" marker) | `src/components/ui/ConfirmDialog.tsx`, `src/components/layout/DemoBadge.tsx` |
| 4 | PR / result card | `ContainerPanel` "Running" state (the result of a deploy). **AG7 has no PR, diff or files-changed concept.** | same as #1 |
| 5 | Run history / metrics card | `RunHistory` (metrics row: runs, success rate, avg deploy; expandable per-step history) | `src/components/activity/RunHistory.tsx` |
| 6 | Sidebar + top bar | `Sidebar`, `Topbar` | `src/components/layout/Sidebar.tsx`, `src/components/layout/Topbar.tsx` |

---

### 00 · StatusBadge / StatusIcon (shared)
- **Shows:** a pill badge or bare icon for a step or run status (spinner, check, cross, dash, empty circle).
- **Props:** `status: 'pending'|'running'|'success'|'error'|'skipped'`, `label?: string`. StatusIcon also takes `size?: number`.
- **States:** pending · running · success · error (label "Failed") · skipped.
- **Sample props:** `sample-props/00-status-badge.sample-props.json`
- **Render:** `renders/00-status-badges.png`

### 01 · Deploy status card: `ContainerPanel` + `DeployProgress`
- **Shows:** the "Your OpenClaw Bot" card. Idle: a Deploy Now call-to-action. Running: a live step list with per-step timings, an `n/6` counter, elapsed time and an orange progress bar. Success: a green Running dot, container name, start time, and Stop / Restart / Open Bot buttons. Error: the failed step, skipped-steps note, error message, and Retry Deploy / View logs buttons. Stopped: Start and Delete.
- **Props:** `ContainerPanel` takes none (it reads `GET /api/containers/status` and `/activity`). `DeployProgress` takes `{ run: Run }`.
- **States:** idle (`not_deployed`) · running (`creating`) · success (`running`) · error · stopped.
- **Sample props:** `sample-props/01-status-card.sample-props.json`. Each state holds `statusResponse` + `activity`, and `deployProgress.run` where it applies. `animationFrames.frames` has 7 snapshots of the run (0 to 6 steps complete) for keyframing the step list.
- **Renders:** `renders/01-status-card-{idle,running,success,error,stopped}.png` (440×250 card, 2x)

### 02 · Live logs panel: `LogsPanel`
- **Shows:** a terminal-style log tail with local-time timestamps. `[warn]` lines are yellow; `[health]`, "ready" and "enabled" lines are green; error lines are red. Header has a "live" pulse dot and a Pause/Resume button. Auto-scrolls while live. Optional error banner with Retry.
- **Props:** `lines: string[]` (`"<ISO time> <message>"`), `live: boolean`, `onToggleLive(): void`, `error?: string`, `onRetry?(): void`.
- **States:** live (streaming) · paused · empty · error.
- **Sample props:** `sample-props/02-logs-panel.sample-props.json` (14 lines plus `streamingOrder.delaysMs` for a line-by-line reveal).
- **Renders:** `renders/02-logs-panel-{live,paused,empty,error}.png` (900×520, 2x)

### 03 · Guardrail / approval step: `ConfirmDialog`
- **Shows:** a modal over a blurred backdrop with a warning icon, title, description, an "effects" box listing exactly what will happen, and Cancel / Confirm buttons (red when destructive).
- **Props:** `open`, `title`, `description`, `effects?: string[]`, `confirmLabel`, `destructive?`, `busy?`, `onConfirm()`, `onCancel()`.
- **States:** idle (`redeploy`, `delete`) · running (`approving`: spinner, buttons disabled). There is no success or error state; on success the dialog closes.
- **Sample props:** `sample-props/03-approval-step.sample-props.json`
- **Renders:** `renders/03-approval-step-{redeploy,delete,approving}.png` (800×520 viewport, 2x)
- **Not in the app:** a dry-run toggle, an "Approve changes" diff step and a file allowlist. AG7 deploys containers and doesn't edit files, so these don't exist. The closest safety cues are this dialog and `DemoBadge`.

### 04 · Result card: `ContainerPanel` "Running" state
- **Shows:** the result of a successful deploy: Running status, container name, masked endpoint, start time, and actions.
- **Props:** same as 01.
- **States:** success · success-telegram (data only; looks the same as success in this card) · stopped.
- **Sample props:** `sample-props/04-result-card.sample-props.json` (also a small `summary` object: steps, duration, channels, for an overlay you build in Remotion).
- **Renders:** `renders/04-result-card-{success,stopped}.png`
- **Not in the app:** a PR link, diff summary or files-changed count.

### 05 · Run history / metrics: `RunHistory`
- **Shows:** a header with run count, three metric tiles (Runs, Success rate, Avg deploy), and a list of runs (action, time, duration, status badge). The newest run is expanded by default to show its steps and any step error.
- **Props:** `runs: Run[]` (newest first), `loading?: boolean`.
- **States:** populated (success + failed runs) · loading (skeleton rows) · empty · error (`first-deploy-failed`).
- **Sample props:** `sample-props/05-run-history.sample-props.json`
- **Renders:** `renders/05-run-history-{populated,loading,empty,first-deploy-failed}.png` (560×620, 2x)

### 06 · App shell: `Sidebar` + `Topbar`
- **Shows:** the floating pill sidebar (Home, Chat, Tasks, Calendar, Activity; Settings and Logout at the bottom; active item in orange with a glow) and the top bar (AG7 wordmark, system toggles, search, volume / brightness / notifications, avatar), over the shell's orange glow.
- **Props:** none. The active item follows the route.
- **States:** home · activity (active nav item).
- **Sample props:** `sample-props/06-app-shell.sample-props.json`
- **Renders:** `renders/06-app-shell-{home,activity}.png` (1920×1080, 2x, page content hidden, placeholder avatar)

## How the renders were made
- The app was running in demo mode. A temporary `/__render` route mounted each component on its own with the props from `sample-props/`; for `ContainerPanel`, the status and activity API calls were answered with the same fixtures. The route was deleted afterwards and never committed.
- Chromium at device scale factor 2, UTC timezone, clock pinned for the running state.
- The app shell was captured from the live app with the main content hidden.
