import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors, getAppToken, resolveDriveItem, graphFetch, tableName, sendJson } from "./_graph";

type RowValue = any[];

function nowISO() {
  return new Date().toISOString();
}

// Orden EXACTO de columnas en el Excel Base_Orientaciones_actualizado.xlsx
const COLS = [
  "ID",
  "TIPO_DOCUMENTO",
  "FECHA",
  "TIPO_ORIENTACION",
  "NOMBRE_COMPLETO",
  "GENERO",
  "POBLACION",
  "EDAD",
  "BARRIO_VEREDA",
  "DIRECCION",
  "TELEFONO",
  "EPS",
  "MOTIVO",
  "CANAL_ATENCION",
  "ACTIVA_RUTA",
  "DERIVADO_A",
  "TIPO_ACUDIENTE",
  "NOMBRE_ACUDIENTE",
  "TELEFONO_ACUDIENTE",
  "OBSERVACION",
  "PENDIENTE_CITA_PRESENCIAL",
  "PROFESIONAL",
  "CREATED_AT",
  "UPDATED_AT"
] as const;

function toExcelRow(body: any): RowValue {
  const created = nowISO();
  const updated = created;
  return [
    body.id ?? body.ID ?? "",
    body.tipo_documento ?? body.TIPO_DOCUMENTO ?? "",
    body.fecha ?? body.FECHA ?? "",
    body.tipo_orientacion ?? body.TIPO_ORIENTACION ?? "",
    body.nombre_completo ?? body.NOMBRE_COMPLETO ?? "",
    body.genero ?? body.GENERO ?? "",
    body.poblacion ?? body.POBLACION ?? "",
    Number(body.edad ?? body.EDAD ?? 0),
    body.barrio_vereda ?? body.BARRIO_VEREDA ?? "",
    body.direccion ?? body.DIRECCION ?? "",
    body.telefono ?? body.TELEFONO ?? "",
    body.eps ?? body.EPS ?? "",
    body.motivo ?? body.MOTIVO ?? "",
    body.canal_atencion ?? body.CANAL_ATENCION ?? "",
    body.activa_ruta ?? body.ACTIVA_RUTA ?? "NO",
    body.derivado_a ?? body.DERIVADO_A ?? "",
    body.tipo_acudiente ?? body.TIPO_ACUDIENTE ?? "",
    body.nombre_acudiente ?? body.NOMBRE_ACUDIENTE ?? "",
    body.telefono_acudiente ?? body.TELEFONO_ACUDIENTE ?? "",
    body.observacion ?? body.OBSERVACION ?? "",
    body.pendiente_cita_presencial ?? body.PENDIENTE_CITA_PRESENCIAL ?? "NO",
    body.profesional ?? body.PROFESIONAL ?? "",
    created,
    updated,
  ];
}

function rowToObject(values: any[]): any {
  const obj: any = {};
  COLS.forEach((c, i) => {
    const key = c.toLowerCase();
    obj[key] = values[i];
  });
  // compat keys for frontend
  obj.id = obj.id ?? obj["id"];
  return obj;
}

async function listRows(token: string, driveId: string, itemId: string) {
  const tname = tableName();
  // Trae filas (sin paginación por simplicidad). Si crece mucho, se agrega paginación/índice.
  // GET /drives/{driveId}/items/{itemId}/workbook/tables/{table}/rows?$top=10000
  const r = await graphFetch<any>(token, `/drives/${driveId}/items/${itemId}/workbook/tables/${encodeURIComponent(tname)}/rows?$top=10000`);
  return (r.value || []) as Array<{ index: number; values: any[][] }>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (allowCors(req, res)) return;

  try {
    const token = await getAppToken();
    const { driveId, itemId } = await resolveDriveItem(token);
    if (!driveId || !itemId) throw new Error("No pude resolver driveId/itemId. Verifica FILE_SHARE_URL.");

    if (req.method === "GET") {
      const id = String(req.query.id ?? "").trim();
      if (!id) return sendJson(res, 400, { error: "Query param requerido: id" });

      const rows = await listRows(token, driveId, itemId);
      const items = rows
        .map(r => rowToObject(r.values?.[0] || []))
        .filter(o => String(o.id ?? "").trim() === id);

      return sendJson(res, 200, { found: items.length > 0, items });
    }

    if (req.method === "POST") {
      const body = req.body ?? {};
      const id = String(body.id ?? "").trim();
      if (!id) return sendJson(res, 400, { error: "Campo requerido: id (documento)" });

      const row = toExcelRow(body);
      const tname = tableName();

      // POST /drives/{driveId}/items/{itemId}/workbook/tables/{table}/rows/add
      const add = await graphFetch<any>(token,
        `/drives/${driveId}/items/${itemId}/workbook/tables/${encodeURIComponent(tname)}/rows/add`,
        {
          method: "POST",
          body: JSON.stringify({ values: [row] }),
        }
      );

      // Retorna OK (Graph devuelve row/indices; devolvemos id)
      return sendJson(res, 200, { ok: true, id });
    }

    return sendJson(res, 405, { error: "Método no permitido" });
  } catch (e: any) {
    return sendJson(res, 500, { error: e?.message ?? "Error" });
  }
}
