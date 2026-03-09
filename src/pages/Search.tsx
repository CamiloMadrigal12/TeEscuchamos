import { useState } from "react";
import BrandHeader from "../components/BrandHeader";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { searchById } from "../services/orientaciones";
import { Orientacion } from "../types/orientacion";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Orientacion[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const nav = useNavigate();

  async function handleSearch() {
    setMsg(null);
    setLoading(true);
    setItems([]);

    try {
      const documento = id.trim();
      const r = await searchById(documento);

      if (!r.found || !r.items || r.items.length === 0) {
        setMsg("No hay información para ese documento.");
      } else {
        setItems(r.items);
      }
    } catch (e: any) {
      setMsg(e?.message ?? "Error consultando.");
    } finally {
      setLoading(false);
    }
  }

  function handleNuevaAtencion(documento: string) {
    nav(`/crear?documento=${encodeURIComponent(documento)}`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <BrandHeader />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-2xl font-black text-brand-800">Buscar</h2>
        <p className="mt-1 text-sm text-slate-600">Consulta por documento (ID).</p>

        <Card className="mt-6 p-5">
          <div className="grid items-end gap-3 md:grid-cols-3">
            <Input
              label="Documento (ID)"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Ej: 123456789"
            />

            <Button
              onClick={handleSearch}
              disabled={!id.trim() || loading}
              className="md:col-span-1"
            >
              {loading ? "Buscando..." : "Buscar"}
            </Button>

            {id.trim() && (
              <Button
                variant="primary"
                onClick={() => handleNuevaAtencion(id.trim())}
                className="md:col-span-1"
              >
                Nueva atención
              </Button>
            )}
          </div>

          {msg && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
              <div>{msg}</div>
              <Button
                variant="primary"
                onClick={() => nav(`/crear?documento=${encodeURIComponent(id.trim())}`)}
              >
                Crear registro
              </Button>
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                    <th className="px-4 py-3 text-left font-semibold">Documento</th>
                    <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                    <th className="px-4 py-3 text-left font-semibold">Orientación</th>
                    <th className="px-4 py-3 text-left font-semibold">Profesional</th>
                    <th className="px-4 py-3 text-left font-semibold">Observación</th>
                    <th className="px-4 py-3 text-left font-semibold">Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, idx) => (
                    <tr key={(item as any).id ?? idx} className="border-t border-slate-100 align-top">
                      <td className="px-4 py-3">
                        {(item as any).fecha ? String((item as any).fecha) : ""}
                      </td>
                      <td className="px-4 py-3">
                        {(item as any).documento ?? (item as any).id ?? ""}
                      </td>
                      <td className="px-4 py-3">{(item as any).nombre_completo ?? ""}</td>
                      <td className="px-4 py-3">{(item as any).tipo_orientacion ?? ""}</td>
                      <td className="px-4 py-3">{(item as any).profesional ?? ""}</td>
                      <td className="max-w-md whitespace-pre-wrap px-4 py-3">
                        {(item as any).observacion ?? ""}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" onClick={() => setSelected(item as any)}>
                            Ver
                          </Button>

                          <Button
                            variant="primary"
                            onClick={() =>
                              handleNuevaAtencion(
                                String((item as any).documento ?? (item as any).id ?? id.trim())
                              )
                            }
                          >
                            Nueva atención
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Detalle de atención</h3>

              <button
                onClick={() => setSelected(null)}
                className="text-xl text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <div className="font-semibold text-slate-700">Documento</div>
                <div>{selected.documento ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Tipo documento</div>
                <div>{selected.tipo_documento ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Fecha</div>
                <div>{selected.fecha ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Tipo de orientación</div>
                <div>{selected.tipo_orientacion ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Nombre completo</div>
                <div>{selected.nombre_completo ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Género</div>
                <div>{selected.genero ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Población</div>
                <div>{selected.poblacion ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Edad</div>
                <div>{selected.edad ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Barrio / Vereda</div>
                <div>{selected.barrio_vereda ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Dirección</div>
                <div>{selected.direccion ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Teléfono</div>
                <div>{selected.telefono ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">EPS</div>
                <div>{selected.eps ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Motivo</div>
                <div>{selected.motivo ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Canal de atención</div>
                <div>{selected.canal_atencion ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Activa ruta</div>
                <div>{selected.activa_ruta ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Derivado a</div>
                <div>{selected.derivado_a ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Tipo acudiente</div>
                <div>{selected.tipo_acudiente ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Nombre acudiente</div>
                <div>{selected.nombre_acudiente ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Teléfono acudiente</div>
                <div>{selected.telefono_acudiente ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Pendiente cita presencial</div>
                <div>{selected.pendiente_cita_presencial ?? ""}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-700">Profesional</div>
                <div>{selected.profesional ?? ""}</div>
              </div>

              <div className="md:col-span-2">
                <div className="font-semibold text-slate-700">Observación</div>
                <div className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-3">
                  {selected.observacion ?? ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}