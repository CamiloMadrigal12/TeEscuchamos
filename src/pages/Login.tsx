import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { supabase } from "../services/supabaseClient";

// 👇 IMPORTAR LAS IMÁGENES
import logoAlcaldia from "../../logos/logoalcaldia.png";
import logoTeEscuchamos from "../../logos/teescuchamos.png";

export default function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Si ya hay sesión, no muestres login; manda al dashboard
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) nav("/");
    })();
  }, [nav]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700">
      <div className="mx-auto max-w-6xl px-4 py-12 grid lg:grid-cols-2 gap-10 items-center">
        {/* LADO IZQUIERDO */}
        <div className="text-white">
          <div className="flex items-center gap-6 mb-6">
            <img
              src={logoAlcaldia}
              alt="Alcaldía de Copacabana"
              className="h-14 object-contain"
            />
            <img
              src={logoTeEscuchamos}
              alt="Te Escuchamos"
              className="h-14 object-contain"
            />
          </div>

          <h1 className="text-4xl font-black tracking-tight">
            Orientaciones
            <span className="block text-white/80 text-2xl font-semibold mt-2">
              Registro • Consulta • Seguimiento
            </span>
          </h1>

          <p className="mt-4 text-white/80 max-w-xl">
            Accede al sistema para registrar la atención y consultar historiales.
          </p>
        </div>

        {/* LADO DERECHO - LOGIN */}
        <Card className="p-6 lg:p-8">
          <div className="text-brand-800 text-xl font-black">Iniciar sesión</div>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);

              const form = e.currentTarget as HTMLFormElement;
              const fd = new FormData(form);

              const email = String(fd.get("email") || "").trim();
              const password = String(fd.get("password") || "");

              if (!email || !password) {
                alert("Ingrese usuario y contraseña");
                setLoading(false);
                return;
              }

              const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              setLoading(false);

              if (error || !data.session) {
                // mensajes típicos: Invalid login credentials / Email not confirmed
                alert(error?.message || "Usuario o contraseña inválidos");
                return;
              }

              nav("/");
            }}
          >
            <Input
              name="email"
              label="Usuario (correo)"
              placeholder="correo@dominio.com"
              autoComplete="username"
              required
            />
            <Input
              name="password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 text-xs text-slate-500">
            * Si el usuario es nuevo, confirma el correo en Supabase o usa "Reset password".
          </div>
        </Card>
      </div>
    </div>
  );
}