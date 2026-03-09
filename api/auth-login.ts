import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { db } from "./_db.js";
import { signToken } from "./_auth.js";

function allowCors(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }

  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (allowCors(req, res)) return;

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        error: "Faltan campos",
        debug: {
          hasUsername: Boolean(username),
          hasPassword: Boolean(password),
        },
      });
    }

    const r = await db().query(
      `
        select id, username, full_name, role, password_hash, is_active
        from public.app_users
        where username = $1
      `,
      [String(username).trim()]
    );

    const u = r.rows[0];

    if (!u) {
      return res.status(401).json({
        error: "Credenciales inválidas",
        debug: {
          reason: "user_not_found",
          username: String(username).trim(),
        },
      });
    }

    if (!u.is_active) {
      return res.status(401).json({
        error: "Credenciales inválidas",
        debug: {
          reason: "user_inactive",
          username: u.username,
        },
      });
    }

    const ok = await bcrypt.compare(String(password), String(u.password_hash));

    if (!ok) {
      return res.status(401).json({
        error: "Credenciales inválidas",
        debug: {
          reason: "password_mismatch",
          username: u.username,
          hashPrefix: String(u.password_hash).slice(0, 7),
          passwordLength: String(password).length,
        },
      });
    }

    const token = signToken({
      id: u.id,
      username: u.username,
      full_name: u.full_name,
      role: u.role,
    });

    return res.status(200).json({
      ok: true,
      token,
      user: {
        username: u.username,
        full_name: u.full_name,
        role: u.role,
      },
    });
  } catch (e: any) {
    console.error("POST /api/auth-login error:", e);

    return res.status(500).json({
      error: e?.message ?? "Error interno",
      detail: String(e),
    });
  }
}