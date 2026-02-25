import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";

export default function BrandHeader() {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-brand-800 text-white grid place-items-center font-black">
            AC
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-brand-800">Alcaldía de Copacabana</div>
            <div className="text-xs text-slate-500">Registro de Orientaciones</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => nav("/buscar")}>Buscar</Button>
          <Button variant="ghost" onClick={() => nav("/crear")}>Crear</Button>
          <Button
            variant="primary"
            onClick={() => {
              localStorage.removeItem("token");
              nav("/login");
            }}
          >
            Salir
          </Button>
        </nav>
      </div>
    </header>
  );
}
