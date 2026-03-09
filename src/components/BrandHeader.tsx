import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";
import { supabase } from "../services/supabaseClient";

type SessionUser = {
  id?: string | number;
  username?: string;
  full_name?: string;
  role?: string;
  authType?: "local" | "supabase";
};

export default function BrandHeader() {
  const nav = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const user: SessionUser | null = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const isAdmin = user?.role === "admin";

  const go = (path: string) => {
    if (!ready) return;
    if (location.pathname === path) return;
    nav(path);
  };

  const logout = async () => {
    try {
      if (user?.authType === "supabase") {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.error("Error cerrando sesión de Supabase:", e);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      nav("/login", { replace: true });
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sesión inválida. Vuelve a iniciar sesión.");
        nav("/login", { replace: true });
        return;
      }

      const res = await fetch("/api/export-orientaciones", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let message = "No se pudo descargar la base de datos";

        try {
          const data = await res.json();
          message = data?.error || message;
        } catch {}

        throw new Error(message);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "orientaciones.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e?.message || "Error descargando la base de datos");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-800 font-black text-white">
            AC
          </div>

          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-800">
              Alcaldía de Copacabana
            </div>
            <div className="text-xs text-slate-500">
              Registro de Orientaciones
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => go("/buscar")}>
            Buscar
          </Button>

          <Button variant="ghost" onClick={() => go("/crear")}>
            Crear
          </Button>

          {isAdmin && (
            <Button
              variant="ghost"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? "Descargando..." : "Descargar base"}
            </Button>
          )}

          <Button onClick={logout}>Salir</Button>
        </nav>
      </div>
    </header>
  );
}