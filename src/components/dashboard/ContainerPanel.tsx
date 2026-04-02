

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  AlertTriangle,
  ExternalLink,
  Power,
  RefreshCw,
  Trash2,
  Rocket,
} from "lucide-react";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";

type ContainerState = "loading" | "not_deployed" | "creating" | "running" | "stopped" | "error";

interface ContainerInfo {
  container_name: string;
  port: number;
  subdomain: string;
  status: string;
  last_started_at: string | null;
  kimi_api_key?: string;
}

export default function ContainerPanel() {
  const { t } = useTranslation();
  const [state, setState] = useState<ContainerState>("loading");
  const [container, setContainer] = useState<ContainerInfo | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.containers.status();
      setState(data.status as ContainerState);
      setContainer(data.container);
      setError("");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Failed to fetch status");
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  async function handleAction(
    action: () => Promise<unknown>,
    successState?: ContainerState,
    delayMs?: number
  ) {
    setActionLoading(true);
    setError("");
    try {
      await action();
      if (successState) setState(successState);
      if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-card p-4 shadow-[0_0_0_1px_#1f1f1f] h-full flex flex-col overflow-hidden">
      <h3 className="text-white text-sm font-semibold mb-1">
        {t("dashboard.container.title")}
      </h3>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-btn px-3 py-2 text-red-400 text-xs mt-2">
          {error}
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center py-2 overflow-hidden">
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
                handleAction(() => api.containers.deploy(), "creating", 30000)
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
        {state === "creating" && (
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
                    ? `http://localhost:${container.port}/#token=${encodeURIComponent(container.kimi_api_key || "")}&gatewayUrl=${encodeURIComponent(`ws://localhost:${container.port}`)}`
                    : `http://${container.subdomain}/#token=${encodeURIComponent(container.kimi_api_key || "")}&gatewayUrl=${encodeURIComponent(`ws://${container.subdomain}`)}`
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
                onClick={() =>
                  handleAction(() => api.containers.remove(), "not_deployed")
                }
                disabled={actionLoading}
                className="px-3 py-1.5 bg-surface-hover border border-border rounded-btn text-text-secondary text-xs hover:text-red-400 hover:border-red-500/30 transition-colors duration-200 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 size={12} /> {t("dashboard.container.delete")}
              </button>
            </div>
          </>
        )}

        {/* STATE: Error */}
        {state === "error" && (
          <>
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <p className="text-white text-sm font-medium mb-1">
              {t("dashboard.container.error")}
            </p>
            <p className="text-text-secondary text-xs text-center mb-4">
              {t("dashboard.container.errorSubtitle")}
            </p>
            <button
              onClick={() =>
                handleAction(async () => {
                  try {
                    await api.containers.remove();
                  } catch {
                    // may already be gone
                  }
                  return api.containers.deploy();
                }, "creating")
              }
              disabled={actionLoading}
              className="px-5 py-2 bg-accent rounded-btn text-white text-sm hover:bg-accent/90 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              {t("dashboard.container.retryDeploy")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
