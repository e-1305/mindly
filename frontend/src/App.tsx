import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./lib/store";
import CheckIn from "./pages/CheckIn";
import Dashboard from "./pages/Dashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import HRDashboard from "./pages/HRDashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

export default function App() {
  const { user } = useAuthStore();

  if (!user) return <Login />;

  const home = user.role === "hr" ? "/hr" : user.role === "manager" ? "/manager" : "/checkin";

  return (
    <Routes>
      <Route path="/"          element={<Navigate to={home} replace />} />
      <Route path="/checkin"   element={<CheckIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/manager"   element={<ManagerDashboard />} />
      <Route path="/hr"        element={<HRDashboard />} />
      <Route path="/settings"  element={<Settings />} />
    </Routes>
  );
}
