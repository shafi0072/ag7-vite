import { Router, Request, Response, NextFunction } from "express";
import { supabase, supabaseAuth } from "../config/supabase";

const router = Router();

router.post("/signup", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    const { data, error } = await supabaseAuth.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
      });
    }

    const { data: loginData, error: loginError } =
      await supabaseAuth.auth.signInWithPassword({ email, password });

    if (loginError) {
      res.json({ user: data.user, session: null });
      return;
    }

    res.json({ user: loginData.user, session: loginData.session });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(401).json({ error: error.message });
      return;
    }

    res.json({ user: data.user, session: data.session });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (_req: Request, res: Response): Promise<void> => {
  res.json({ message: "Logged out successfully" });
});

export default router;
