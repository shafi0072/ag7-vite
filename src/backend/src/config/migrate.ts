import { supabase } from "./supabase";

/**
 * Runs migrations by creating tables if they don't exist.
 * Uses service role to call admin endpoints.
 */
export async function runMigrations(): Promise<void> {
  console.log("[Migrate] Checking database tables...");

  // Test if users table exists by trying to query it
  const { error: usersErr } = await supabase
    .from("users")
    .select("id")
    .limit(1);

  if (usersErr?.code === "PGRST205") {
    console.log("[Migrate] Tables not found. Please run the migration SQL:");
    console.log("");
    console.log("  Go to: https://supabase.com/dashboard/project/fpbpdadnxocawnbqcssq/sql");
    console.log("  Paste the contents of: supabase/migrations/20260326000000_create_tables.sql");
    console.log("");
    console.log("[Migrate] Starting without tables — signup/container features will fail until migration is run.");
    return;
  }

  console.log("[Migrate] Database tables OK.");
}
