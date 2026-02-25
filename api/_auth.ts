import jwt from "jsonwebtoken";
import type { VercelRequest } from "@vercel/node";

export type AuthUser = { id: string; username: string; full_name: string; role: "admin" | "user" };

export function signToken(user: AuthUser) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Falta JWT_SECRET");
  return jwt.sign(user, secret, { expiresIn: "7d" });
}

export function requireUser(req: VercelRequest): AuthUser {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Falta JWT_SECRET");
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!token) throw new Error("No autorizado");
  return jwt.verify(token, secret) as AuthUser;
}