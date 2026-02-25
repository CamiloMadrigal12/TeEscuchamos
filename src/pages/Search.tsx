import { useState } from "react";
import BrandHeader from "../components/BrandHeader";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import { searchById } from "../services/orientaciones";
import { Orientacion } from "../types/orientacion";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Orientacion[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <BrandHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-2xl font-black text-brand-800">Buscar</h2>
        <p className="text-sm text-slate-600 mt-1">Consulta por documento (ID).</p>

        <Card className="p-5 mt-6">
          <div className="grid md:grid-cols-3 gap-3 items-end">
            <Input
              label="Documento (ID)"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Ej: 123456789"
            />
            <Button
              onClick={async () => {
                setMsg(null);
                setLoading(true);
                setItems([]);
                try {
                  const r = await searchById(id.trim());
                  if (!r.found || r.items.length === 0) {
                    setMsg("No hay información para ese documento.");
                  } else {
                    setItems(r.items);
                  }
                } catch (e: any) {
                  setMsg(e?.message ?? "Error consultando.");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={!id.trim() || loading}
              className="md:col-span-1"
            >
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          {msg && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 flex items-center justify-between gap-3">
              <div>{msg}</div>
              <Button variant="primary" onClick={() => nav("/crear")}>Crear registro</Button>
            </div>
          )}

          <div className="mt-4">
            <DataTable items={items} />
          </div>
        </Card>
      </main>
    </div>
  );
}
