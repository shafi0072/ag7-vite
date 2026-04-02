import { Router, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { requireAuth } from "../middleware/auth";
import * as containerService from "../services/containerService";

const router = Router();

router.use(requireAuth);

router.post(
  "/deploy",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const container = await containerService.deploy(req.user!.id);
      res.json({
        message: "Container deployed successfully",
        container,
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
      res.json(status);
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
      const container = await containerService.start(req.user!.id);
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
      const container = await containerService.stop(req.user!.id);
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
      const container = await containerService.restart(req.user!.id);
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
      await containerService.remove(req.user!.id);
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
      const container = await containerService.setTelegramToken(
        req.user!.id,
        bot_token
      );
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
      await containerService.removeTelegramToken(req.user!.id);
      res.json({ message: "Telegram bot token removed" });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to remove token";
      const status = message.includes("No container") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  }
);

export default router;
