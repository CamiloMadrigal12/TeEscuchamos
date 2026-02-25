import React from "react";
import { Orientacion } from "../types/orientacion";

export default function DataTable({ items }: { items: Orientacion[] }) {
  if (!items.length) return null;
  return (
    <div className="overflow-auto rounded-2xl border border-slate-100">
      <table className="min-w-[900px] w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left px-3 py-2 font-semibold text-slate-700">Fecha</th>
            <th className="text-left px-3 py-2 font-semibold text-slate-700">Documento</th>
            <th className="text-left px-3 py-2 font-semibold text-slate-700">Nombre</th>
            <th className="text-left px-3 py-2 font-semibold text-slate-700">Orientación</th>
            <th className="text-left px-3 py-2 font-semibold text-slate-700">Profesional</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={`${it.id}-${idx}`} className="border-t border-slate-100">
              <td className="px-3 py-2">{it.fecha}</td>
              <td className="px-3 py-2">{it.id}</td>
              <td className="px-3 py-2">{it.nombre_completo}</td>
              <td className="px-3 py-2">{it.tipo_orientacion}</td>
              <td className="px-3 py-2">{it.profesional}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
