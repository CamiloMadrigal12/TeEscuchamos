import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

// 👇 IMPORTAR LAS IMÁGENES
import logoAlcaldia from "../../logos/logoalcaldia.png";
import logoTeEscuchamos from "../../logos/teescuchamos.png";

export default function Login() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700">
      <div className="mx-auto max-w-6xl px-4 py-12 grid lg:grid-cols-2 gap-10 items-center">
        {/* LADO IZQUIERDO */}
        <div className="text-white">
          {/* Logos institucionales */}
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

              const form = e.currentTarget as HTMLFormElement;
              const fd = new FormData(form);

              const username = String(fd.get("username") || "").trim();
              const password = String(fd.get("password") || "");

              if (!username || !password) {
                alert("Ingrese usuario y contraseña");
                return;
              }

              try {
                const r = await fetch("/api/auth-login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ username, password }),
                });

                const data = await r.json().catch(() => ({}));

                if (!r.ok || !data?.token) {
                  alert(data?.error || "Usuario o contraseña inválidos");
                  return;
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user || {}));
                nav("/");
              } catch {
                alert("No se pudo conectar con el servidor");
              }
            }}
          >
            <Input name="username" label="Usuario" placeholder="usuario" required />
            <Input
              name="password"
              label="Contraseña"
              type="password"
              placeholder="••"
              required
            />
            <Button className="w-full" type="submit">
              Entrar
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}