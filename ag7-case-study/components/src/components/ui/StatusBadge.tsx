import { Loader2, CheckCircle2, XCircle, Circle, MinusCircle } from "lucide-react";

export type BadgeStatus = "pending" | "running" | "success" | "error" | "skipped";

const STYLES: Record<BadgeStatus, { cls: string; label: string }> = {
  pending: { cls: "text-text-secondary bg-white/5 border-white/10", label: "Pending" },
  running: { cls: "text-accent bg-accent/10 border-accent/30", label: "Running" },
  success: { cls: "text-green-400 bg-green-500/10 border-green-500/20", label: "Success" },
  error: { cls: "text-red-400 bg-red-500/10 border-red-500/20", label: "Failed" },
  skipped: { cls: "text-text-secondary bg-white/5 border-white/10", label: "Skipped" },
};

export function StatusIcon({ status, size = 14 }: { status: BadgeStatus; size?: number }) {
  if (status === "running") return <Loader2 size={size} className="text-accent animate-spin" />;
  if (status === "success") return <CheckCircle2 size={size} className="text-green-400" />;
  if (status === "error") return <XCircle size={size} className="text-red-400" />;
  if (status === "skipped") return <MinusCircle size={size} className="text-text-secondary" />;
  return <Circle size={size} className="text-text-secondary/60" />;
}

export default function StatusBadge({ status, label }: { status: BadgeStatus; label?: string }) {
  const s = STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${s.cls}`}>
      <StatusIcon status={status} size={10} />
      {label ?? s.label}
    </span>
  );
}
