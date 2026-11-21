import { createClient } from "@supabase/supabase-js";
import { DEMO_MODE } from "./env";
import { memoryClient, seedDemoData } from "../demo/memoryDb";

function makeClients() {
  if (DEMO_MODE) {
    // Demo: in-memory store, no Supabase project or service key needed.
    seedDemoData();
    return { auth: memoryClient as any, admin: memoryClient as any };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  }
  const opts = { auth: { autoRefreshToken: false, persistSession: false } };
  return {
    // Auth client — used only for token verification in middleware
    auth: createClient(supabaseUrl, supabaseServiceKey, opts),
    // Admin client — used for all DB operations (bypasses RLS with service_role)
    admin: createClient(supabaseUrl, supabaseServiceKey, opts),
  };
}

const clients = makeClients();
export const supabaseAuth = clients.auth;
export const supabase = clients.admin;
