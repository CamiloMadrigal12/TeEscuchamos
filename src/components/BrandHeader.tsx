import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";

export default function BrandHeader() {
  const nav = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(false);

  // Evita doble navegación rara al primer render
  useEffect(() => setReady(true), []);

  const go = (path: string) => {
    if (!ready) return;

    // Si ya estás en esa ruta, no hagas nada (evita “rebote”)
    if (location.pathname === path) return;

    nav(path);
  };

  const logout = async () => {
    // Si usas Supabase auth, intenta cerrar sesión (si no existe, no pasa nada)
    try {
      const mod = await import("../services/supabaseClient");
      await mod.supabase.auth.signOut();
    } catch {}

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login", { replace: true });
  };

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-brand-800 text-white grid place-items-center font-black">
            AC
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-800">Alcaldía de Copacabana</div>
            <div className="text-xs text-slate-500">Registro de Orientaciones</div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => go("/buscar")}>Buscar</Button>
          <Button variant="ghost" onClick={() => go("/crear")}>Crear</Button>
          <Button onClick={logout}>Salir</Button>
        </nav>
      </div>
    </header>
  );
}