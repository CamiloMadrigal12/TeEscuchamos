import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors, sendJson } from "./_graph.js";

const BARRIOS_VEREDAS = [
  "La Veta",
  "Zarzal La Luz",
  "Zarzal Curazao",
  "Ancon",
  "El Noral",
  "El Salado",
  "Sabaneta",
  "Quebrada Arriba",
  "Alvarado",
  "Montañita",
  "Peñolcito",
  "Cabuyal",
  "Granizal",
  "El Convento",
  "Fontidueño",
  "Cristo Rey",
  "Simon Bolivar",
  "Obrero",
  "Yarumito",
  "Las Vegas",
  "Tobon Quintero",
  "La Asunción",
  "La Azulita",
  "El Porvenir",
  "Villanueva",
  "El Recreo",
  "El Remanso",
  "Pedregal",
  "La Misericordia",
  "Machado",
  "San Juan",
  "Maria",
  "Tablazo-Canoas",
  "El Mojon",
  "C. Multiple",
  "Fatima",
  "Pedrera",
  "San Francisco",
  "Miraflores",
  "horizontes",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (allowCors(req, res)) return;

  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method Not Allowed" });
  }

  const data = {
    tipo_orientacion: [
      "PRIMERA VEZ",
      "SEGUIMIENTO",
      "SEGUIMIENTO COMPORTAMIENTO S",
      "SEGUIMIENTO VIOLENCIA SEXUAL",
      "GESTION DE CASO",
    ],

    tipo_documento: ["CC", "TI", "RC", "PPT", "CE", "PASAPORTE", "OTRO"],

    sexo: ["HOMBRE", "MUJER", "OTRO"],

    poblacion: [
      "INFANCIA",
      "JUVENTUD",
      "ADULTEZ",
      "ADULTO MAYOR",
      "DISCAPACIDAD",
      "LGTBIQ+",
      "MCF",
      "VICTIMA DEL CONFLICTO ARMADO",
      "MIGRANTE",
      "CAMPESINO",
      "HABITANTE DE CALLE",
      "PPL",
      "COMUNIDADES ETNICAS",
    ],

    eps: [
      "SURA",
      "SAVIA SALUD",
      "NUEVA EPS",
      "SALUD TOTAL",
      "SANITAS",
      "FOMAG",
      "SANIDAD MILITAR",
      "POLICIA NACIONAL",
      "OTRA",
    ],

    motivo_atencion: [
      "PROBLEMAS FAMILIARES",
      "CONSUMO DE SPA",
      "CONDUCTA SUICIDA",
      "VIOLENCIA SEXUAL",
      "VIOLENCIA INTRAFAMILIAR",
      "GESTION DE CASO",
      "INFORMACIÓN",
      "OTRO",
    ],

    canal_atencion: ["FIJO", "LINEA", "DERIVACIÓN", "OTRO"],

    activacion_ruta: ["SI", "NO"],

    derivado_a: [
      "HOSPITAL",
      "BOMBEROS",
      "EPS",
      "GESTION DE CASO",
      "PERSONERIA",
      "COMISARIA",
      "INSPECCIÓN",
      "OTRO",
    ],

    tipo_acudiente: ["MADRE", "PADRE", "HERMANO(A)", "ABUELO(A)", "TIO(A)", "TUTOR(A)", "OTRO"],

    pendiente_cita_presencial: ["SI", "NO"],

    barrio_vereda: BARRIOS_VEREDAS,
  };

  return sendJson(res, 200, data);
}