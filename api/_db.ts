import { Pool } from "pg";
let pool: Pool | null = null;

export function db() {
  if (!pool) {
    const cs = process.env.SUPABASE_DB_URL;
    if (!cs) throw new Error("Falta SUPABASE_DB_URL");
    pool = new Pool({ connectionString: cs, ssl: { rejectUnauthorized: false } });
  }
  return pool;
}