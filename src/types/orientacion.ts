export type YesNo = "SI" | "NO";

export type Orientacion = {
  id: string; // Documento
  tipo_documento: string;
  fecha: string;
  tipo_orientacion: string;
  nombre_completo: string;
  genero: string;
  poblacion: string;
  edad: number;
  barrio_vereda: string;
  direccion: string;
  telefono: string;
  eps: string;
  motivo: string;
  canal_atencion: string;
  activa_ruta: YesNo;
  derivado_a: string;
  tipo_acudiente: string;
  nombre_acudiente: string;
  telefono_acudiente: string;
  observacion: string;
  pendiente_cita_presencial: YesNo;
  profesional: string;
};
