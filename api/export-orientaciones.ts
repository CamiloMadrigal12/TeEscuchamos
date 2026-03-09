import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./_db.js";
import { requireUser } from "./_auth.js";

function allowCors(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }

  return false;
}

function csvEscape(value: unknown) {
  const str = value == null ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (allowCors(req, res)) return;

  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const user = requireUser(req);

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Solo admin puede descargar la base" });
    }

    const result = await db().query(`
      select
        id,
        documento,
        tipo_documento,
        fecha,
        tipo_orientacion,
        nombre_completo,
        genero,
        poblacion,
        edad,
        barrio_vereda,
        direccion,
        telefono,
        eps,
        motivo,
        canal_atencion,
        activa_ruta,
        derivado_a,
        tipo_acudiente,
        nombre_acudiente,
        telefono_acudiente,
        observacion,
        pendiente_cita_presencial,
        profesional,
        created_at,
        updated_at
      from public.orientaciones
      order by fecha desc nulls last, created_at desc
    `);

    const headers = [
      "id",
      "documento",
      "tipo_documento",
      "fecha",
      "tipo_orientacion",
      "nombre_completo",
      "genero",
      "poblacion",
      "edad",
      "barrio_vereda",
      "direccion",
      "telefono",
      "eps",
      "motivo",
      "canal_atencion",
      "activa_ruta",
      "derivado_a",
      "tipo_acudiente",
      "nombre_acudiente",
      "telefono_acudiente",
      "observacion",
      "pendiente_cita_presencial",
      "profesional",
      "created_at",
      "updated_at",
    ];

    const lines = [
      headers.join(","),
      ...result.rows.map((row) =>
        headers.map((h) => csvEscape(row[h])).join(",")
      ),
    ];

    const csv = "\ufeff" + lines.join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="orientaciones.csv"'
    );

    return res.status(200).send(csv);
  } catch (e: any) {
    console.error("/api/export-orientaciones error:", e);

    return res.status(500).json({
      error: e?.message ?? "Error interno",
    });
  }
}