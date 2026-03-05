import type { VercelRequest } from "@vercel/node";

type TokenResp = { access_token: string; expires_in: number };

let cached: { token: string; exp: number } | null = null;

export async function getMsToken() {
  const tenant = process.env.MS_TENANT_ID!;
  const clientId = process.env.MS_CLIENT_ID!;
  const clientSecret = process.env.MS_CLIENT_SECRET!;

  if (!tenant || !clientId || !clientSecret) {
    throw new Error("Faltan variables MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET");
  }

  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.exp - 60 > now) return cached.token;

  const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;

  const body = new URLSearchParams();
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);
  body.set("grant_type", "client_credentials");
  body.set("scope", "https://graph.microsoft.com/.default");

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!r.ok) {
    const t = await r.text();
    throw new Error(`No se pudo obtener token Graph: ${r.status} ${t}`);
  }

  const data = (await r.json()) as TokenResp;
  cached = { token: data.access_token, exp: now + data.expires_in };
  return data.access_token;
}

export async function graphFetch(path: string, init: RequestInit = {}) {
  const token = await getMsToken();
  const r = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  return r;
}

// Convierte share link -> shareId (base64url)
export function toShareId(shareUrl: string) {
  const b64 = Buffer.from(shareUrl, "utf8").toString("base64");
  return "u!" + b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

let cachedDriveItem: { driveId: string; itemId: string } | null = null;

export async function resolveDriveItem() {
  if (cachedDriveItem) return cachedDriveItem;

  const shareUrl = process.env.ONEDRIVE_SHARE_URL!;
  if (!shareUrl) throw new Error("Falta ONEDRIVE_SHARE_URL");

  const shareId = toShareId(shareUrl);
  const r = await graphFetch(`/shares/${shareId}/driveItem`);

  if (!r.ok) {
    const t = await r.text();
    throw new Error(`No se pudo resolver driveItem: ${r.status} ${t}`);
  }

  const data: any = await r.json();
  const driveId = data?.parentReference?.driveId;
  const itemId = data?.id;

  if (!driveId || !itemId) throw new Error("No se pudo obtener driveId/itemId desde el share link.");

  cachedDriveItem = { driveId, itemId };
  return cachedDriveItem;
}