import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BrandHeader from "../components/BrandHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import { supabase } from "../services/supabaseClient";

export default function Dashboard() {
  const nav = useNavigate();

  // ✅ Protección: si no hay sesión, vuelve a login
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        nav("/login");
      }
    })();
  }, [nav]);

  return (
    <div className="min-h-screen bg-slate-50">
      <BrandHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-black text-brand-800">Panel</h2>
            <p className="text-sm text-slate-600 mt-1">
              Crea registros y consulta por identificación.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => nav("/buscar")}>
              Buscar
            </Button>
            <Button onClick={() => nav("/crear")}>Crear registro</Button>

            {/* ✅ Salir */}
            <Button
              variant="ghost"
              onClick={async () => {
                await supabase.auth.signOut();
                localStorage.removeItem("sb_token");
                localStorage.removeItem("sb_user");
                nav("/login");
              }}
            >
              Salir
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="p-5">
            <div className="text-sm font-semibold text-slate-700">Consulta</div>
            <div className="text-xs text-slate-500 mt-1">
              Busca por identificación y revisa historial.
            </div>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => nav("/buscar")}
            >
              Ir a buscar →
            </Button>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold text-slate-700">Registro</div>
            <div className="text-xs text-slate-500 mt-1">
              Guarda una nueva orientación en el repositorio.
            </div>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => nav("/crear")}
            >
              Crear →
            </Button>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold text-slate-700">Integración</div>
            <div className="text-xs text-slate-500 mt-1">
              Listo para conectar tu API (Graph + Excel).
            </div>
            <div className="mt-4 text-xs text-slate-500">
              Configura{" "}
              <code className="px-1 rounded bg-slate-100">VITE_API_BASE</code>{" "}
              si aplica.
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}