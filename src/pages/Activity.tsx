import { useCallback, useEffect, useState } from "react";
import { api, type Run } from "@/lib/api";
import RunHistory from "@/components/activity/RunHistory";
import LogsPanel from "@/components/activity/LogsPanel";

const REFRESH_MS = 2000;

export default function Activity() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [lines, setLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [a, l] = await Promise.all([api.containers.activity(), api.containers.logs(200)]);
      setRuns(a.runs);
      setLines(l.lines);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activity");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [live, load]);

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="mb-5">
        <h1 className="text-white text-2xl font-semibold">Activity</h1>
        <p className="text-text-secondary text-sm">Every action on your agent, step by step, with live container logs.</p>
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-6">
        <div className="col-span-5 min-h-0">
          <RunHistory runs={runs} loading={loading} />
        </div>
        <div className="col-span-7 min-h-0">
          <LogsPanel lines={lines} live={live} onToggleLive={() => setLive((v) => !v)} error={error} onRetry={load} />
        </div>
      </div>
    </div>
  );
}
