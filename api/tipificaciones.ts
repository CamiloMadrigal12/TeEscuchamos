import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors, sendJson } from "./_graph";

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
  "horizontes"
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (allowCors(req, res)) return;

  // Tipificaciones base (ajústalas a tu archivo VARIABLES BASE DE DATOS.xlsx cuando quieras)
  const data = {
    tipo_documento: ["CC", "TI", "CE", "PA", "RC", "NIT", "OTRO"],
    activa_ruta: ["SI", "NO"],
    pendiente_cita_presencial: ["SI", "NO"],
    barrio_vereda: BARRIOS_VEREDAS,
    // Estas quedan abiertas por ahora; puedes llenarlas con tu catálogo real
    genero: ["Femenino", "Masculino", "Otro", "No responde"],
    canal_atencion: ["Presencial", "Telefónico", "WhatsApp", "Correo", "Otro"],
  };

  sendJson(res, 200, data);
}
