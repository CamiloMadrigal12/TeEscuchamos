import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { supabase } from "../services/supabaseClient";

import logoAlcaldia from "../../logos/logoalcaldia.png";
import logoTeEscuchamos from "../../logos/teescuchamos.png";

export default function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      nav("/buscar", { replace: true });
    }
  }, [nav]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-2">
        <div className="text-white">
          <div className="mb-6 flex items-center gap-6">
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
            <span className="mt-2 block text-2xl font-semibold text-white/80">
              Registro • Consulta • Seguimiento
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-white/80">
            Accede al sistema para registrar la atención y consultar historiales.
          </p>
        </div>

        <Card className="p-6 lg:p-8">
          <div className="text-xl font-black text-brand-800">Iniciar sesión</div>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);

              try {
                const form = e.currentTarget as HTMLFormElement;
                const fd = new FormData(form);

                const username = String(fd.get("username") || "").trim();
                const password = String(fd.get("password") || "");

                if (!username || !password) {
                  alert("Ingrese usuario y contraseña");
                  setLoading(false);
                  return;
                }

                // 1) Primero intenta login local (admin en app_users)
                const localRes = await fetch("/api/auth-login", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    username,
                    password,
                  }),
                });

                const localData = await localRes.json();

                if (localRes.ok) {
                  localStorage.setItem("token", localData.token);
                  localStorage.setItem(
                    "user",
                    JSON.stringify({
                      ...localData.user,
                      authType: "local",
                    })
                  );

                  nav("/buscar", { replace: true });
                  return;
                }

                // 2) Si no entra como local, intenta con Supabase Auth
                const { data, error } = await supabase.auth.signInWithPassword({
                  email: username,
                  password,
                });

                if (error || !data?.session || !data?.user) {
                  throw new Error("Credenciales inválidas");
                }

                localStorage.setItem("token", data.session.access_token);
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    username: data.user.email,
                    full_name: data.user.user_metadata?.full_name || data.user.email || "Usuario",
                    role: "user",
                    authType: "supabase",
                  })
                );

                nav("/buscar", { replace: true });
              } catch (e: any) {
                alert(e?.message || "Error iniciando sesión");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input
              name="username"
              label="Usuario"
              placeholder="admin o correo@dominio.com"
              required
            />

            <Input
              name="password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              required
            />

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 text-xs text-slate-500">
            Admin entra con usuario interno. Operadores entran con su cuenta de Supabase.
          </div>
        </Card>
      </div>
    </div>
  );
}