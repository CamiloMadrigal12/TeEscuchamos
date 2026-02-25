import type { VercelRequest, VercelResponse } from "@vercel/node";

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

/**
 * Env requeridas (Vercel > Settings > Environment Variables)
 * - TENANT_ID
 * - CLIENT_ID
 * - CLIENT_SECRET
 * - FILE_SHARE_URL  (Copiar vínculo del archivo en OneDrive)
 * - TABLE_NAME       (opcional, default: OrientacionesTable)
 */
function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta variable de entorno: ${name}`);
  return v;
}

function base64UrlEncode(str: string) {
  return Buffer.from(str, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

/**
 * Microsoft Graph "shares" API requiere shareId con prefijo "u!"
 * https://learn.microsoft.com/graph/api/shares-get?view=graph-rest-1.0
 */
function shareIdFromUrl(url: string) {
  return "u!" + base64UrlEncode(url);
}

export async function getAppToken(): Promise<string> {
  const tenantId = mustEnv("TENANT_ID");
  const clientId = mustEnv("CLIENT_ID");
  const clientSecret = mustEnv("CLIENT_SECRET");

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const body = new URLSearchParams();
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);
  body.set("grant_type", "client_credentials");
  body.set("scope", "https://graph.microsoft.com/.default");

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Token error (${res.status}): ${t}`);
  }

  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export async function graphFetch<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${GRAPH_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Graph error ${res.status} ${path}: ${t}`);
  }

  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export type DriveItemRef = { driveId: string; itemId: string };

export async function resolveDriveItem(token: string): Promise<DriveItemRef> {
  const shareUrl = mustEnv("FILE_SHARE_URL");
  const sid = shareIdFromUrl(shareUrl);

  // GET /shares/{shareId}/driveItem
  const di = await graphFetch<any>(token, `/shares/${encodeURIComponent(sid)}/driveItem`);
  return {
    driveId: di.parentReference?.driveId,
    itemId: di.id,
  };
}

export function tableName(): string {
  return process.env.TABLE_NAME || "OrientacionesTable";
}

export function sendJson(res: VercelResponse, status: number, data: any) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

export function allowCors(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}
