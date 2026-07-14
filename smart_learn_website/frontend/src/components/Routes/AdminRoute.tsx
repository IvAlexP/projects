import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";

export const AdminRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.isEmailVerified === false) {
    return <Navigate replace to="/login" />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
