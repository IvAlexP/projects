import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth/AuthContext";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.isEmailVerified === false) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN" && location.pathname !== "/profile") {
    return <Navigate to="/admin/users" replace />;
  }


  return <Outlet />;
};
