import { Router, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { requireAuth } from "../middleware/auth";
import { supabase } from "../config/supabase";

const router = Router();

router.use(requireAuth);

router.get(
  "/profile",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user!.id)
      .single();

    if (error || !data) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json(data);
  }
);

router.put(
  "/profile",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { name, role, preferences } = req.body;

    const { data, error } = await supabase
      .from("users")
      .update({
        name,
        role,
        preferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.user!.id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  }
);

export default router;
