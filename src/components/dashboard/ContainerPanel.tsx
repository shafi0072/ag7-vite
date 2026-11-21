import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  AlertTriangle,
  ExternalLink,
  Power,
  RefreshCw,
  Trash2,
  Rocket,
  ScrollText,
} from "lucide-react";
import { api, type ContainerInfo, type Run } from "@/lib/api";
import { useTranslation } from "react-i18next";
import DeployProgress from "./DeployProgress";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type ContainerState = "loading" | "not_deployed" | "creating" | "running" | "stopped" | "error";
type PendingConfirm = "delete" | "redeploy" | null;

const POLL_MS = 1000;

export default function ContainerPanel() {
  const { t } = useTranslation();
  const [state, setState] = useState<ContainerState>("loading");
  const [container, setContainer] = useState<ContainerInfo | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [deployRun, setDeployRun] = useState<Run | null>(null);
  const [confirm, setConfirm] = useState<PendingConfirm>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const [data, activity] = await Promise.all([
        api.containers.status(),
        api.containers.activity().catch(() => ({ runs: [] as Run[] })),
      ]);
      setState(data.status as ContainerState);
      setContainer(data.container);
      setDeployRun(activity.runs.find((r) => r.action === "deploy") || null);
      setError("");
      return data.status;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
      setState((s) => (s === "loading" ? "error" : s));
      return null;
    }
  }, []);

  // Poll while a deploy is provisioning so the step list updates live.
  useEffect(() => {
    if (state !== "creating") return;
    pollRef.current = setTimeout(fetchStatus, POLL_MS);
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [state, deployRun, fetchStatus]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  async function handleAction(action: () => Promise<unknown>, successState?: ContainerState) {
    setActionLoading(true);
    setError("");
    try {
      await action();
      if (successState) setState(successState);
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  }

  async function runConfirmed() {
    const which = confirm;
    if (which === "delete") {
      await handleAction(() => api.containers.remove(), "not_deployed");
    } else if (which === "redeploy") {
      await handleAction(async () => {
        try {
          await api.containers.remove();
        } catch {
          // may already be gone
        }
        return api.containers.deploy();
      }, "creating");
    }
    setConfirm(null);
  }

  const showRun = deployRun && (state === "creating" || (state === "error" && deployRun.status === "error"));

  return (
    <div className="bg-surface border border-border rounded-card p-4 shadow-[0_0_0_1px_#1f1f1f] h-full flex flex-col overflow-hidden">
      <h3 className="text-white text-sm font-semibold mb-1">
        {t("dashboard.container.title")}
      </h3>

      {error && (
        <div role="alert" className="bg-red-500/10 border border-red-500/20 rounded-btn px-3 py-2 text-red-400 text-xs mt-2 flex items-center gap-2">
          <span className="flex-1">{error}</span>
          <button
            onClick={() => fetchStatus()}
            className="shrink-0 underline underline-offset-2 hover:text-red-300"
          >
            {t("common.retry", "Retry")}
          </button>
        </div>
      )}

      <div className={`flex-1 flex flex-col items-center py-2 min-h-0 ${showRun ? "justify-start overflow-y-auto" : "justify-center overflow-hidden"}`}>
        {/* STATE: Loading */}
        {state === "loading" && (
          <>
            <Loader2 size={28} className="text-accent animate-spin mb-3" />
            <p className="text-text-secondary text-xs">{t("dashboard.container.loading")}</p>
          </>
        )}

        {/* STATE: Not deployed */}
        {state === "not_deployed" && (
          <>
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Rocket size={24} className="text-accent" />
            </div>
            <p className="text-white text-sm font-medium mb-1">
              {t("dashboard.container.notDeployed")}
            </p>
            <p className="text-text-secondary text-xs text-center mb-5">
              {t("dashboard.container.deploySubtitle")}
            </p>
            <button
              onClick={() =>
                handleAction(() => api.containers.deploy(), "creating")
              }
              disabled={actionLoading}
              className="px-6 py-2.5 bg-accent rounded-btn text-white text-sm font-medium hover:bg-accent/90 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> {t("dashboard.container.deploying")}
                </>
              ) : (
                t("dashboard.container.deployNow")
              )}
            </button>
          </>
        )}

        {/* STATE: Creating */}
        {state === "creating" && showRun && deployRun && <DeployProgress run={deployRun} />}
        {state === "creating" && !showRun && (
          <>
            <Loader2 size={28} className="text-accent animate-spin mb-3" />
            <p className="text-white text-sm font-medium mb-1">
              {t("dashboard.container.settingUp")}
            </p>
            <p className="text-text-secondary text-xs">
              {t("dashboard.container.settingUpSubtitle")}
            </p>
          </>
        )}

        {/* STATE: Running */}
        {state === "running" && container && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 text-xs font-medium">
                {t("dashboard.container.running")}
              </span>
            </div>
            <p className="text-white text-sm font-medium mb-0.5">
              {container.container_name}
            </p>
            <p className="text-text-secondary text-[10px] mb-1">
              {container.subdomain}
            </p>
            {container.last_started_at && (
              <p className="text-text-secondary text-[10px] mb-4">
                {t("dashboard.container.started")}{" "}
                {new Date(container.last_started_at).toLocaleString()}
              </p>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction(() => api.containers.stop())}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-surface-hover border border-border rounded-btn text-white text-xs hover:bg-bg transition-colors duration-200 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Power size={12} /> {t("dashboard.container.stop")}
              </button>
              <button
                onClick={() => handleAction(() => api.containers.restart())}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-surface-hover border border-border rounded-btn text-white text-xs hover:bg-bg transition-colors duration-200 disabled:opacity-50 flex items-center gap-1.5"
              >
                <RefreshCw size={12} /> {t("dashboard.container.restart")}
              </button>
              <a
                href={
                  typeof window !== "undefined" && window.location.hostname === "localhost"
                    ? `http://localhost:${container.port}/#token=${encodeURIComponent(container.gateway_token || "")}&gatewayUrl=${encodeURIComponent(`ws://localhost:${container.port}`)}`
                    : `http://${container.subdomain}/#token=${encodeURIComponent(container.gateway_token || "")}&gatewayUrl=${encodeURIComponent(`ws://${container.subdomain}`)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-accent rounded-btn text-white text-xs hover:bg-accent/90 transition-colors duration-200 flex items-center gap-1.5"
              >
                <ExternalLink size={12} /> {t("dashboard.container.openBot")}
              </a>
            </div>
          </>
        )}

        {/* STATE: Stopped */}
        {state === "stopped" && container && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-red-400 text-xs font-medium">{t("dashboard.container.stopped")}</span>
            </div>
            <p className="text-white text-sm font-medium mb-4">
              {container.container_name}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction(() => api.containers.start())}
                disabled={actionLoading}
                className="px-4 py-1.5 bg-accent rounded-btn text-white text-xs hover:bg-accent/90 transition-colors duration-200 disabled:opacity-50 flex items-center gap-1.5"
              >
                {actionLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Power size={12} />
                )}
                {t("dashboard.container.start")}
              </button>
              <button
                onClick={() => setConfirm("delete")}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-surface-hover border border-border rounded-btn text-text-secondary text-xs hover:text-red-400 hover:border-red-500/30 transition-colors duration-200 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 size={12} /> {t("dashboard.container.delete")}
              </button>
            </div>
          </>
        )}

        {/* STATE: Error */}
        {state === "error" && showRun && deployRun && (
          <>
            <DeployProgress run={deployRun} />
            <div className="flex items-center gap-2 mt-2.5 self-start">
              <button
                onClick={() => setConfirm("redeploy")}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-accent rounded-btn text-white text-xs hover:bg-accent/90 transition-colors duration-200 disabled:opacity-50 flex items-center gap-1.5"
              >
                <RefreshCw size={12} /> {t("dashboard.container.retryDeploy")}
              </button>
              <Link to="/activity" className="px-3 py-1.5 bg-surface-hover border border-border rounded-btn text-white text-xs hover:bg-bg flex items-center gap-1.5">
                <ScrollText size={12} /> {t("dashboard.container.viewLogs", "View logs")}
              </Link>
            </div>
          </>
        )}
        {state === "error" && !showRun && (
          <>
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <p className="text-white text-sm font-medium mb-1">
              {t("dashboard.container.error")}
            </p>
            <p className="text-text-secondary text-xs text-center mb-4">
              {container ? t("dashboard.container.errorSubtitle") : t("dashboard.container.unreachable", "We couldn't load your agent's status.")}
            </p>
            <button
              onClick={() => (container ? setConfirm("redeploy") : handleAction(() => fetchStatus()))}
              disabled={actionLoading}
              className="px-5 py-2 bg-accent rounded-btn text-white text-sm hover:bg-accent/90 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              {container ? t("dashboard.container.retryDeploy") : t("common.retry", "Retry")}
            </button>
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirm !== null}
        busy={actionLoading}
        destructive={confirm === "delete"}
        title={confirm === "delete" ? "Delete your agent?" : "Redeploy your agent?"}
        description={
          confirm === "delete"
            ? "This permanently removes the container. You can deploy a new one afterwards."
            : "The failed container will be removed and a fresh one provisioned."
        }
        effects={
          confirm === "delete"
            ? ["Stops and removes the OpenClaw container", "Removes its routing rule", "Disconnects any Telegram channel"]
            : ["Removes the current container record", "Provisions a new isolated container", "Your memory volume is kept"]
        }
        confirmLabel={confirm === "delete" ? "Delete agent" : "Redeploy"}
        onConfirm={runConfirmed}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
