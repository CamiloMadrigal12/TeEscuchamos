import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./_db.js";

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

function sendJson(res: VercelResponse, status: number, data: unknown) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (allowCors(req, res)) return;

  try {
    if (req.method === "GET") {
      const documento = String(req.query.id ?? "").trim();

      if (!documento) {
        return sendJson(res, 400, {
          error: "Query param requerido: id",
        });
      }

      const result = await db().query(
        `
          select
            id,
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
          where documento = $1
          order by fecha desc nulls last, created_at desc
        `,
        [documento]
      );

      return sendJson(res, 200, {
        found: result.rows.length > 0,
        items: result.rows,
      });
    }

    if (req.method === "POST") {
      const body = req.body ?? {};
      const documento = String(body.id ?? "").trim();

      if (!documento) {
        return sendJson(res, 400, {
          error: "Campo requerido: id (documento)",
        });
      }

      if (!body.tipo_documento) {
        return sendJson(res, 400, {
          error: "Campo requerido: tipo_documento",
        });
      }

      if (!body.fecha) {
        return sendJson(res, 400, {
          error: "Campo requerido: fecha",
        });
      }

      if (!body.tipo_orientacion) {
        return sendJson(res, 400, {
          error: "Campo requerido: tipo_orientacion",
        });
      }

      if (!body.nombre_completo) {
        return sendJson(res, 400, {
          error: "Campo requerido: nombre_completo",
        });
      }

      if (!body.genero) {
        return sendJson(res, 400, {
          error: "Campo requerido: genero",
        });
      }

      if (!body.poblacion) {
        return sendJson(res, 400, {
          error: "Campo requerido: poblacion",
        });
      }

      if (!body.edad && Number(body.edad) !== 0) {
        return sendJson(res, 400, {
          error: "Campo requerido: edad",
        });
      }

      if (!body.barrio_vereda) {
        return sendJson(res, 400, {
          error: "Campo requerido: barrio_vereda",
        });
      }

      if (!body.direccion) {
        return sendJson(res, 400, {
          error: "Campo requerido: direccion",
        });
      }

      if (!body.telefono) {
        return sendJson(res, 400, {
          error: "Campo requerido: telefono",
        });
      }

      if (!body.eps) {
        return sendJson(res, 400, {
          error: "Campo requerido: eps",
        });
      }

      if (!body.motivo) {
        return sendJson(res, 400, {
          error: "Campo requerido: motivo",
        });
      }

      if (!body.canal_atencion) {
        return sendJson(res, 400, {
          error: "Campo requerido: canal_atencion",
        });
      }

      if (!body.activa_ruta) {
        return sendJson(res, 400, {
          error: "Campo requerido: activa_ruta",
        });
      }

      if (!body.derivado_a) {
        return sendJson(res, 400, {
          error: "Campo requerido: derivado_a",
        });
      }

      if (!body.observacion) {
        return sendJson(res, 400, {
          error: "Campo requerido: observacion",
        });
      }

      if (!body.profesional) {
        return sendJson(res, 400, {
          error: "Campo requerido: profesional",
        });
      }

      const result = await db().query(
        `
          insert into public.orientaciones (
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
            asistio_a_cita,
            profesional
          ) values (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
            $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
          )
          returning
            id,
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
        `,
        [
          documento,
          String(body.tipo_documento ?? ""),
          body.fecha || null,
          String(body.tipo_orientacion ?? ""),
          String(body.nombre_completo ?? ""),
          String(body.genero ?? ""),
          String(body.poblacion ?? ""),
          Number(body.edad ?? 0),
          String(body.barrio_vereda ?? ""),
          String(body.direccion ?? ""),
          String(body.telefono ?? ""),
          String(body.eps ?? ""),
          String(body.motivo ?? ""),
          String(body.canal_atencion ?? ""),
          String(body.activa_ruta ?? "NO"),
          String(body.derivado_a ?? ""),
          String(body.tipo_acudiente ?? ""),
          String(body.nombre_acudiente ?? ""),
          String(body.telefono_acudiente ?? ""),
          String(body.observacion ?? ""),
          String(body.pendiente_cita_presencial ?? ""),
          String(body.asistio_a_cita ?? ""),
          String(body.profesional ?? ""),
        ]
      );

      return sendJson(res, 200, {
        ok: true,
        id: documento,
        item: result.rows[0] ?? null,
      });
    }

    return sendJson(res, 405, {
      error: "Método no permitido",
    });
  } catch (e: any) {
    console.error("/api/orientaciones error:", e);

    return sendJson(res, 500, {
      error: e?.message ?? "Error interno",
      detail: String(e),
      stack: e?.stack ?? null,
    });
  }
}