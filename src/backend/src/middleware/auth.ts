import { Response, NextFunction } from "express";
import { supabaseAuth } from "../config/supabase";
import { AuthenticatedRequest } from "../types";

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const {
      data: { user },
      error,
    } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email!,
    };

    next();
  } catch {
    res.status(500).json({ error: "Authentication failed" });
  }
}
