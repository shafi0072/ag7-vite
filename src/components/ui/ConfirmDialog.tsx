import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  /** Bullet list of exactly what will happen, shown before the user approves. */
  effects?: string[];
  confirmLabel: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Approval step shown before any destructive or disruptive container action. */
export default function ConfirmDialog({
  open, title, description, effects, confirmLabel, destructive, busy, onConfirm, onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm bg-surface border border-border rounded-card p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${destructive ? "bg-red-500/10" : "bg-accent/10"}`}>
            <AlertTriangle size={18} className={destructive ? "text-red-400" : "text-accent"} />
          </div>
          <div>
            <h4 id="confirm-title" className="text-white text-sm font-semibold mb-1">{title}</h4>
            <p className="text-text-secondary text-xs leading-relaxed">{description}</p>
          </div>
        </div>
        {effects && effects.length > 0 && (
          <ul className="mb-5 space-y-1.5 bg-bg/60 border border-border rounded-btn p-3">
            {effects.map((e) => (
              <li key={e} className="text-xs text-white/80 flex gap-2">
                <span className="text-text-secondary">•</span>
                {e}
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 rounded-btn border border-border text-white text-xs hover:bg-surface-hover transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className={`px-4 py-2 rounded-btn text-white text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
              destructive ? "bg-red-500 hover:bg-red-500/90" : "bg-accent hover:bg-accent/90"
            }`}
          >
            {busy && <Loader2 size={12} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
