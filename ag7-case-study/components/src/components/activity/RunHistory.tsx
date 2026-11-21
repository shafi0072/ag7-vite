import { useState } from "react";
import { ChevronDown, History } from "lucide-react";
import type { Run } from "@/lib/api";
import StatusBadge, { StatusIcon } from "@/components/ui/StatusBadge";

const ACTION_LABELS: Record<string, string> = {
  deploy: "Deploy agent",
  start: "Start agent",
  stop: "Stop agent",
  restart: "Restart agent",
  delete: "Delete agent",
  telegram_connect: "Connect Telegram",
  telegram_disconnect: "Disconnect Telegram",
};

function fmtDuration(ms: number | null) {
  if (ms === null) return "…";
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

interface RunHistoryProps {
  runs: Run[];
  loading?: boolean;
}

/** Timeline of every container action with expandable per-step detail. */
export default function RunHistory({ runs, loading }: RunHistoryProps) {
  // undefined = default to the newest run expanded; null = user collapsed all.
  const [openId, setOpen] = useState<string | null | undefined>(undefined);
  const open = openId === undefined ? runs[0]?.id ?? null : openId;
  const total = runs.length;
  const ok = runs.filter((r) => r.status === "success").length;
  const finished = runs.filter((r) => r.durationMs !== null && r.action === "deploy");
  const avgDeploy = finished.length ? finished.reduce((a, r) => a + (r.durationMs || 0), 0) / finished.length : null;

  return (
    <div className="bg-surface border border-border rounded-card p-5 h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-sm font-semibold flex items-center gap-2">
          <History size={16} className="text-accent" /> Run history
        </h3>
        <span className="text-text-secondary text-[11px]">{total} {total === 1 ? "run" : "runs"}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Runs", value: String(total) },
          { label: "Success rate", value: total ? `${Math.round((ok / total) * 100)}%` : "—" },
          { label: "Avg deploy", value: avgDeploy !== null ? fmtDuration(Math.round(avgDeploy)) : "—" },
        ].map((m) => (
          <div key={m.label} className="bg-bg/60 border border-border rounded-btn px-3 py-2">
            <p className="text-text-secondary text-[10px] mb-0.5">{m.label}</p>
            <p className="text-white text-base font-semibold tabular-nums">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto -mx-1 px-1 space-y-2">
        {loading && runs.length === 0 &&
          [0, 1, 2].map((i) => <div key={i} className="h-12 rounded-btn bg-white/5 animate-pulse" />)}

        {!loading && runs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <History size={28} className="text-text-secondary mb-2" />
            <p className="text-white text-sm mb-1">No runs yet</p>
            <p className="text-text-secondary text-xs">Deploy your agent from the dashboard to see its history here.</p>
          </div>
        )}

        {runs.map((r) => {
          const expanded = open === r.id;
          return (
            <div key={r.id} className="border border-border rounded-btn bg-bg/40">
              <button
                onClick={() => setOpen(expanded ? null : r.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
                aria-expanded={expanded}
              >
                <StatusIcon status={r.status} size={15} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{ACTION_LABELS[r.action] || r.action}</p>
                  <p className="text-text-secondary text-[10px]">
                    {new Date(r.startedAt).toLocaleTimeString()} · {fmtDuration(r.durationMs)}
                  </p>
                </div>
                <StatusBadge status={r.status} />
                <ChevronDown size={14} className={`text-text-secondary transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
              {expanded && (
                <ol className="px-3 pb-3 pt-1 space-y-1.5 border-t border-border">
                  {r.steps.map((s) => (
                    <li key={s.key} className="flex items-center gap-2 text-[11px]">
                      <StatusIcon status={s.status} size={12} />
                      <span className="flex-1 text-white/80">{s.label}</span>
                      {s.error && <span className="text-red-400 truncate max-w-[50%]">{s.error}</span>}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
