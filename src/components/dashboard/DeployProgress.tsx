import type { Run } from "@/lib/api";
import { StatusIcon } from "@/components/ui/StatusBadge";

function secs(a: string | null, b: string | null) {
  if (!a) return "";
  const end = b ? Date.parse(b) : Date.now();
  return `${((end - Date.parse(a)) / 1000).toFixed(1)}s`;
}

/** Live step list for an in-flight (or just-finished) deploy run. */
export default function DeployProgress({ run }: { run: Run }) {
  const skipped = run.steps.filter((s) => s.status === "skipped").length;
  const visible = run.steps.filter((s) => s.status !== "skipped");
  const done = run.steps.filter((s) => s.status === "success").length;
  const pct = Math.round((done / run.steps.length) * 100);
  return (
    <div className="w-full">
      <div className={`flex items-center justify-between ${run.status === "error" ? "mb-2" : "mb-1.5"}`}>
        <span className="text-white text-xs font-medium">
          {run.status === "error" ? "Deploy failed" : run.status === "success" ? "Deploy complete" : "Deploying agent"}
        </span>
        <span className="text-text-secondary text-[10px] tabular-nums">
          {done}/{run.steps.length} · {secs(run.startedAt, run.finishedAt)}
        </span>
      </div>
      {run.status !== "error" && <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-2.5" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full rounded-full transition-all duration-500 bg-accent"
          style={{ width: `${Math.max(pct, 4)}%` }}
        />
      </div>}
      <ol className="space-y-1">
        {visible.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-[11px]">
            <StatusIcon status={s.status} size={13} />
            <span className={`flex-1 truncate ${s.status === "pending" || s.status === "skipped" ? "text-text-secondary" : "text-white/90"}`}>
              {s.label}
            </span>
            <span className="text-text-secondary text-[10px] tabular-nums">
              {s.status === "success" || s.status === "error" || s.status === "running" ? secs(s.startedAt, s.finishedAt) : ""}
            </span>
          </li>
        ))}
        {skipped > 0 && (
          <li className="text-text-secondary text-[10px] pl-5">{skipped} remaining step{skipped > 1 ? "s" : ""} skipped</li>
        )}
      </ol>
      {run.error && <p className="mt-1.5 text-red-400 text-[11px] leading-snug">{run.error}</p>}
    </div>
  );
}
