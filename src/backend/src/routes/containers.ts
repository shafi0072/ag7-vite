import { Router, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { requireAuth } from "../middleware/auth";
import * as containerService from "../services/containerService";
import { trackSimple, getRuns } from "../services/activityLog";

const pub = containerService.toPublic;

const router = Router();

router.use(requireAuth);

router.post(
  "/deploy",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { container, run } = await containerService.deploy(req.user!.id);
      // 202: provisioning continues in the background; poll /status and /activity.
      res.status(202).json({
        message: "Deployment started",
        container: pub(container),
        runId: run.id,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Deploy failed";
      const status = message.includes("already has") ? 409 : 500;
      res.status(status).json({ error: message });
    }
  }
);

router.get(
  "/status",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const status = await containerService.getStatus(req.user!.id);
      res.json({ ...status, container: pub(status.container) });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to get status";
      res.status(500).json({ error: message });
    }
  }
);

router.post(
  "/start",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const container = pub(await trackSimple(req.user!.id, "start", "Start agent container", () => containerService.start(req.user!.id)));
      res.json({ message: "Container started", container });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Start failed";
      const status = message.includes("No container") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  }
);

router.post(
  "/stop",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const container = pub(await trackSimple(req.user!.id, "stop", "Stop agent container", () => containerService.stop(req.user!.id)));
      res.json({ message: "Container stopped", container });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Stop failed";
      const status = message.includes("No container") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  }
);

router.post(
  "/restart",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const container = pub(await trackSimple(req.user!.id, "restart", "Restart agent container", () => containerService.restart(req.user!.id)));
      res.json({ message: "Container restarted", container });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Restart failed";
      const status = message.includes("No container") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  }
);

router.delete(
  "/",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      await trackSimple(req.user!.id, "delete", "Remove container and routing", () => containerService.remove(req.user!.id));
      res.json({ message: "Container removed successfully" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Remove failed";
      const status = message.includes("No container") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  }
);

// Save Telegram bot token and restart container with it
router.post(
  "/telegram",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { bot_token } = req.body;
      if (!bot_token) {
        res.status(400).json({ error: "bot_token is required" });
        return;
      }
      const container = pub(await trackSimple(req.user!.id, "telegram_connect", "Connect Telegram channel", () =>
        containerService.setTelegramToken(req.user!.id, bot_token)
      ));
      res.json({ message: "Telegram bot token saved", container });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save token";
      const status = message.includes("No container") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  }
);

// Approve Telegram pairing code
router.post(
  "/telegram/pair",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { pairing_code } = req.body;
      if (!pairing_code) {
        res.status(400).json({ error: "pairing_code is required" });
        return;
      }
      const result = await containerService.approveTelegramPairing(
        req.user!.id,
        pairing_code
      );
      res.json(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to approve pairing";
      const status = message.includes("No container") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  }
);

// Remove Telegram bot token
router.delete(
  "/telegram",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      await trackSimple(req.user!.id, "telegram_disconnect", "Disconnect Telegram channel", () =>
        containerService.removeTelegramToken(req.user!.id)
      );
      res.json({ message: "Telegram bot token removed" });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to remove token";
      const status = message.includes("No container") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  }
);

// Run history (deploy progress + past actions), newest first
router.get("/activity", (req: AuthenticatedRequest, res: Response): void => {
  res.json({ runs: getRuns(req.user!.id) });
});

// Tail of the agent container logs (secrets redacted)
router.get(
  "/logs",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const tail = Math.min(parseInt(String(req.query.tail || "200"), 10) || 200, 500);
    res.json({ lines: await containerService.getLogs(req.user!.id, tail) });
  }
);

export default router;
