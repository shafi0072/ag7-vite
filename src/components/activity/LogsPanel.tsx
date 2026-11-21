import { useEffect, useRef } from "react";
import { Pause, Play, Terminal } from "lucide-react";

interface LogsPanelProps {
  lines: string[];
  live: boolean;
  onToggleLive: () => void;
  error?: string;
  onRetry?: () => void;
}

const LEVEL_COLORS: [RegExp, string][] = [
  [/\[(error|fatal)\]|error/i, "text-red-400"],
  [/\[(warn|warning)\]/i, "text-yellow-400"],
  [/\[health\]|ready|enabled/i, "text-green-400"],
];

function colorFor(line: string) {
  for (const [re, cls] of LEVEL_COLORS) if (re.test(line)) return cls;
  return "text-white/80";
}

/** Tail of the agent container logs; auto-scrolls while live. */
export default function LogsPanel({ lines, live, onToggleLive, error, onRetry }: LogsPanelProps) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (live) endRef.current?.scrollIntoView({ block: "end" });
  }, [lines, live]);

  return (
    <div className="bg-surface border border-border rounded-card h-full flex flex-col min-h-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <h3 className="text-white text-sm font-semibold flex items-center gap-2">
          <Terminal size={16} className="text-accent" /> Agent logs
          {live && (
            <span className="flex items-center gap-1 text-[10px] text-green-400 font-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> live
            </span>
          )}
        </h3>
        <button
          onClick={onToggleLive}
          className="px-2.5 py-1 rounded-btn border border-border text-[11px] text-white hover:bg-surface-hover flex items-center gap-1.5"
        >
          {live ? <Pause size={11} /> : <Play size={11} />} {live ? "Pause" : "Resume"}
        </button>
      </div>
      {error && (
        <div role="alert" className="mx-5 mt-3 bg-red-500/10 border border-red-500/20 rounded-btn px-3 py-2 text-red-400 text-xs flex gap-2">
          <span className="flex-1">{error}</span>
          {onRetry && <button onClick={onRetry} className="underline underline-offset-2">Retry</button>}
        </div>
      )}
      <div className="flex-1 overflow-auto px-5 py-3 font-mono text-[11px] leading-5 bg-black/30">
        {lines.length === 0 ? (
          <p className="text-text-secondary">No log output yet. Logs appear once your agent container starts.</p>
        ) : (
          lines.map((l, i) => {
            const m = l.match(/^(\S+Z)\s(.*)$/);
            return (
              <div key={i} className="whitespace-pre-wrap break-all">
                {m && <span className="text-text-secondary mr-2">{new Date(m[1]).toLocaleTimeString()}</span>}
                <span className={colorFor(l)}>{m ? m[2] : l}</span>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
