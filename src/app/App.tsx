import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

// Páginas
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Create from "../pages/Create";
import Search from "../pages/Search";

function RequireAuth({ children }: { children: JSX.Element }) {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!alive) return;

      setAuthed(!!data?.user);
      setChecking(false);
    })();

    // 🔁 escucha cambios de sesión (login/logout)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (checking) return null; // o un loader

  if (!authed) return <Navigate to="/login" replace />;

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/crear"
        element={
          <RequireAuth>
            <Create />
          </RequireAuth>
        }
      />

      <Route
        path="/buscar"
        element={
          <RequireAuth>
            <Search />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}