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
                      <td className="px-4 py-3 whitespace-pre-wrap max-w-md">
                        {(item as any).observacion ?? ""}
                      </td>
                      <td className="px-4 py-3">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}