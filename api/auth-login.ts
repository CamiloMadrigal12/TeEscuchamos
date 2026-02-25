import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { db } from "./_db";
import { signToken } from "./_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: "Faltan campos" });

    const r = await db().query(
      `select id, username, full_name, role, password_hash, is_active
       from public.app_users where username=$1`,
      [String(username).trim()]
    );

    const u = r.rows[0];
    if (!u || !u.is_active) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(String(password), u.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = signToken({ id: u.id, username: u.username, full_name: u.full_name, role: u.role });
    return res.status(200).json({ ok: true, token, user: { username: u.username, full_name: u.full_name, role: u.role } });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}