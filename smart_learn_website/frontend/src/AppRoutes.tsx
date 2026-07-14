import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context";
import { GuestRoute, ProtectedRoute, AdminRoute } from "@/components";
import {
  LandingPage,
  LogIn,
  Register,
  Dashboard,
  Library,
  Practice,
  Stats,
  Profile,
  AdminUsersPage,
  AdminBadgesPage,
  VerifyEmailPage,
} from "./pages";

function AppRoutes() {
  const { user, isLoading } = useAuth();

console.log("AppRoutes rendered - pathname:", window.location.pathname);
  console.log("AppRoutes - user:", user);
  console.log("AppRoutes - isLoading:", isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/verifyEmail" element={<VerifyEmailPage />} />

      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />

      <Route element={<GuestRoute />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/library" element={<Library />} />
        <Route path="/practice/:setId" element={<Practice />} />
        <Route path="/stats" element={<Stats />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/badges" element={<AdminBadgesPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
