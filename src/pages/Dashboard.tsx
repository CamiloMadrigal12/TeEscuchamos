import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandHeader from "../components/BrandHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import { supabase } from "../services/supabaseClient";

export default function Dashboard() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  // ✅ Protección: si no hay sesión -> login
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      if (!data.session) {
        nav("/login");
        return;
      }

      setLoading(false);
    })();

    // ✅ Mantener estado si la sesión cambia (logout en otra pestaña, etc.)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) nav("/login");
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [nav]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <BrandHeader />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-sm text-slate-600">Cargando...</div>
        </main>
      </div>
    );
  }

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

            <Button
              variant="ghost"
              onClick={async () => {
                await supabase.auth.signOut();
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
            <Button variant="ghost" className="mt-4" onClick={() => nav("/buscar")}>
              Ir a buscar →
            </Button>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold text-slate-700">Registro</div>
            <div className="text-xs text-slate-500 mt-1">
              Guarda una nueva orientación en el repositorio.
            </div>
            <Button variant="ghost" className="mt-4" onClick={() => nav("/crear")}>
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
              <code className="px-1 rounded bg-slate-100">VITE_API_BASE</code> si aplica.
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}