import { apiGet, apiPost } from "./api";
import { Orientacion } from "../types/orientacion";

export type SearchResponse = { found: boolean; items: Orientacion[] };

export async function searchById(id: string): Promise<SearchResponse> {
  return apiGet<SearchResponse>(`/orientaciones?id=${encodeURIComponent(id)}`);
}

export async function createOrientacion(payload: Orientacion): Promise<{ ok: true; id: string }> {
  return apiPost<{ ok: true; id: string }>(`/orientaciones`, payload);
}

export type Tipificaciones = {
  tipo_documento: string[];
  activa_ruta: Array<"SI" | "NO">;
  pendiente_cita_presencial: Array<"SI" | "NO">;
  barrio_vereda: string[];
  genero?: string[];
  canal_atencion?: string[];
};

export async function getTipificaciones(): Promise<Tipificaciones> {
  return apiGet<Tipificaciones>(`/tipificaciones`);
}
