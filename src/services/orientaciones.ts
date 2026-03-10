import { Orientacion } from "../types/orientacion";

export type SearchResponse = {
  found: boolean;
  items: Orientacion[];
};

export type CreateOrientacionResponse = {
  ok: true;
  id: string;
  item?: Orientacion;
};

export type Tipificaciones = {
  tipo_orientacion: string[];
  tipo_documento: string[];
  sexo: string[];
  poblacion: string[];
  eps: string[];
  motivo_atencion: string[];
  canal_atencion: string[];
  activacion_ruta: Array<"SI" | "NO">;
  derivado_a: string[];
  tipo_acudiente: string[];
  pendiente_cita_presencial: Array<"SI" | "NO">;
  asistio_a_cita: string[];
  barrio_vereda: string[];
};

function getAuthHeaders(includeJson = true): HeadersInit {
  const token = localStorage.getItem("token");

  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data?.error ||
        data?.detail ||
        `Request failed (${res.status})`
    );
  }

  return data as T;
}

export async function searchById(id: string): Promise<SearchResponse> {
  const res = await fetch(`/api/orientaciones?id=${encodeURIComponent(id)}`, {
    method: "GET",
    headers: getAuthHeaders(true),
  });

  return parseResponse<SearchResponse>(res);
}

export async function createOrientacion(
  payload: Orientacion
): Promise<CreateOrientacionResponse> {
  const res = await fetch("/api/orientaciones", {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload),
  });

  return parseResponse<CreateOrientacionResponse>(res);
}

export async function getTipificaciones(): Promise<Tipificaciones> {
  const res = await fetch("/api/tipificaciones", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return parseResponse<Tipificaciones>(res);
}