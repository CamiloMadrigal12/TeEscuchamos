import { Navigate, Route, Routes as RR, useLocation } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Search from "../pages/Search";
import Create from "../pages/Create";

function useAuth() {
  const token = localStorage.getItem("token");
  return { isAuthed: Boolean(token) };
}

function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthed } = useAuth();
  const loc = useLocation();
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
}

export function Routes() {
  return (
    <RR>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/buscar"
        element={
          <Protected>
            <Search />
          </Protected>
        }
      />
      <Route
        path="/crear"
        element={
          <Protected>
            <Create />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </RR>
  );
}
