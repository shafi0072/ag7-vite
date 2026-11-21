import dotenv from "dotenv";

/**
 * Single place that loads environment variables.
 * ENV_FILE lets local demo runs point at `.env.demo` so the real `.env`
 * (production secrets) is never read when running the case-study demo.
 */
dotenv.config({ path: process.env.ENV_FILE || ".env" });

export const DEMO_MODE = process.env.DEMO_MODE === "true";
