/**
 * DEMO MODE ONLY — a tiny in-memory stand-in for the subset of the
 * Supabase client API this backend uses (auth + `from(table)` query builder).
 * No network calls, no real credentials. Data resets on restart.
 */
import { randomUUID } from "crypto";

type Row = Record<string, any>;
type Result<T = any> = { data: T; error: { message: string; code?: string } | null };

const tables: Record<string, Row[]> = { users: [], containers: [] };
const authUsers: { id: string; email: string; password: string }[] = [];
const sessions = new Map<string, string>(); // access_token -> user id

class Query implements PromiseLike<Result> {
  private filters: [string, unknown][] = [];
  private op: "select" | "insert" | "update" | "delete" = "select";
  private payload: Row | null = null;
  private wantSingle = false;
  private orderBy: { col: string; asc: boolean } | null = null;
  private max: number | null = null;

  constructor(private table: string) {
    if (!tables[table]) tables[table] = [];
  }

  select(_cols?: string) { if (this.op === "select") this.op = "select"; return this; }
  insert(row: Row) { this.op = "insert"; this.payload = row; return this; }
  update(patch: Row) { this.op = "update"; this.payload = patch; return this; }
  delete() { this.op = "delete"; return this; }
  eq(col: string, val: unknown) { this.filters.push([col, val]); return this; }
  order(col: string, opts?: { ascending?: boolean }) { this.orderBy = { col, asc: opts?.ascending !== false }; return this; }
  limit(n: number) { this.max = n; return this; }
  single() { this.wantSingle = true; return this; }

  private matches(r: Row) { return this.filters.every(([c, v]) => r[c] === v); }

  private run(): Result {
    const rows = tables[this.table];
    let out: Row[] = [];
    if (this.op === "insert") {
      const row = { id: randomUUID(), created_at: new Date().toISOString(), ...this.payload };
      rows.push(row);
      out = [row];
    } else if (this.op === "update") {
      out = rows.filter((r) => this.matches(r));
      out.forEach((r) => Object.assign(r, this.payload));
    } else if (this.op === "delete") {
      out = rows.filter((r) => this.matches(r));
      tables[this.table] = rows.filter((r) => !this.matches(r));
    } else {
      out = rows.filter((r) => this.matches(r));
    }
    if (this.orderBy) {
      const { col, asc } = this.orderBy;
      out = [...out].sort((a, b) => (a[col] > b[col] ? 1 : -1) * (asc ? 1 : -1));
    }
    if (this.max !== null) out = out.slice(0, this.max);
    const copy = out.map((r) => ({ ...r }));
    if (this.wantSingle) {
      return copy.length === 1
        ? { data: copy[0], error: null }
        : { data: null, error: { message: "Row not found", code: "PGRST116" } };
    }
    return { data: copy, error: null };
  }

  then<A = Result, B = never>(ok?: ((v: Result) => A | PromiseLike<A>) | null, fail?: ((e: unknown) => B | PromiseLike<B>) | null) {
    return Promise.resolve().then(() => this.run()).then(ok, fail);
  }
}

function issueSession(userId: string) {
  const access_token = `demo_${randomUUID()}`;
  sessions.set(access_token, userId);
  return { access_token, token_type: "bearer", expires_in: 3600 };
}

export const memoryClient = {
  from: (table: string) => new Query(table),
  auth: {
    async getUser(token: string) {
      const id = sessions.get(token);
      const u = authUsers.find((x) => x.id === id);
      return u
        ? { data: { user: { id: u.id, email: u.email } }, error: null }
        : { data: { user: null }, error: { message: "Invalid token" } };
    },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      const u = authUsers.find((x) => x.email === email.toLowerCase() && x.password === password);
      if (!u) return { data: { user: null, session: null }, error: { message: "Invalid login credentials" } };
      return { data: { user: { id: u.id, email: u.email }, session: issueSession(u.id) }, error: null };
    },
    admin: {
      async createUser({ email, password }: { email: string; password: string; email_confirm?: boolean }) {
        if (authUsers.some((x) => x.email === email.toLowerCase())) {
          return { data: { user: null }, error: { message: "A user with this email address has already been registered" } };
        }
        const u = { id: randomUUID(), email: email.toLowerCase(), password };
        authUsers.push(u);
        return { data: { user: { id: u.id, email: u.email } }, error: null };
      },
    },
  },
};

/** Seed one demo account (credentials come from .env.demo, never real users). */
export function seedDemoData() {
  const email = (process.env.DEMO_USER_EMAIL || "demo@ag7.local").toLowerCase();
  const password = process.env.DEMO_USER_PASSWORD || "demo-password";
  if (authUsers.some((u) => u.email === email)) return;
  const id = "d3m0a9e7-0000-4000-8000-00000000c0de";
  authUsers.push({ id, email, password });
  tables.users.push({
    id, email, name: "Alex Demo", role: "Founder",
    preferences: { language: "en", timezone: "UTC", agentName: "Nova" },
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  });
}
