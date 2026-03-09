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

    const validateSession = async () => {
      try {
        const rawUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!rawUser || !token) {
          if (!alive) return;
          setAuthed(false);
          setChecking(false);
          return;
        }

        const parsedUser = JSON.parse(rawUser);

        // Admin/local login
        if (parsedUser?.authType === "local") {
          if (!alive) return;
          setAuthed(true);
          setChecking(false);
          return;
        }

        // Usuario normal / Supabase Auth
        if (parsedUser?.authType === "supabase") {
          const { data } = await supabase.auth.getUser();

          if (!alive) return;

          setAuthed(!!data?.user);
          setChecking(false);
          return;
        }

        if (!alive) return;
        setAuthed(false);
        setChecking(false);
      } catch {
        if (!alive) return;
        setAuthed(false);
        setChecking(false);
      }
    };

    validateSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      try {
        const rawUser = localStorage.getItem("user");
        const parsedUser = rawUser ? JSON.parse(rawUser) : null;

        if (parsedUser?.authType === "supabase") {
          setAuthed(!!session);
        } else if (parsedUser?.authType === "local") {
          setAuthed(true);
        } else {
          setAuthed(false);
        }
      } catch {
        setAuthed(false);
      }
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (checking) return null;

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