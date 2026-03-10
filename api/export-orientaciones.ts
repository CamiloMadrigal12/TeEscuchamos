import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as XLSX from "xlsx";
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
        documento,
        tipo_documento,
        to_char(fecha, 'DD/MM/YYYY') as fecha,
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
        asistio_a_cita,
        profesional,
        created_at,
        updated_at
      from public.orientaciones
      order by fecha desc nulls last, created_at desc
    `);

    const rows = result.rows.map((row) => ({
      Documento: row.documento,
      "Tipo documento": row.tipo_documento,
      Fecha: row.fecha,
      "Tipo orientación": row.tipo_orientacion,
      "Nombre completo": row.nombre_completo,
      Género: row.genero,
      Población: row.poblacion,
      Edad: row.edad,
      "Barrio / Vereda": row.barrio_vereda,
      Dirección: row.direccion,
      Teléfono: row.telefono,
      EPS: row.eps,
      Motivo: row.motivo,
      "Canal de atención": row.canal_atencion,
      "Activa ruta": row.activa_ruta,
      "Derivado a": row.derivado_a,
      "Tipo acudiente": row.tipo_acudiente,
      "Nombre acudiente": row.nombre_acudiente,
      "Teléfono acudiente": row.telefono_acudiente,
      Observación: row.observacion,
      "Pendiente cita presencial": row.pendiente_cita_presencial,
      "Asistió a cita": row.asistio_a_cita,
      Profesional: row.profesional,
      "Creado en": row.created_at,
      "Actualizado en": row.updated_at,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Orientaciones");

    const buffer = XLSX.write(wb, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="orientaciones.xlsx"'
    );

    return res.status(200).send(buffer);
  } catch (e: any) {
    console.error("/api/export-orientaciones error:", e);

    return res.status(500).json({
      error: e?.message ?? "Error interno",
    });
  }
}