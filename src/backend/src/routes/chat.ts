import { Router, Response, NextFunction } from "express";
import { requireAuth } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";
import { DEMO_MODE } from "../config/env";
import { mockChatReply } from "../demo/mockLlm";

const router = Router();

router.use(requireAuth as (req: AuthenticatedRequest, res: Response, next: NextFunction) => void);

router.post(
  "/",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "messages array is required" });
        return;
      }

      if (DEMO_MODE) {
        // Demo: canned assistant reply, no LLM call.
        res.json({ reply: await mockChatReply(messages) });
        return;
      }

      const kimiApiKey = process.env.KIMI_API_KEY;
      if (!kimiApiKey) {
        res.status(500).json({ error: "KIMI_API_KEY is not configured" });
        return;
      }

      const response = await fetch("https://api.moonshot.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${kimiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "kimi-k2.5",
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Chat API] Moonshot error:", response.status, errorText);
        res.status(502).json({
          error: "AI service returned an error",
          details: process.env.NODE_ENV === "development" ? errorText : undefined,
        });
        return;
      }

      const data: any = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";

      res.json({ reply });
    } catch (err) {
      console.error("[Chat API] Error:", err);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  }
);

export default router;
