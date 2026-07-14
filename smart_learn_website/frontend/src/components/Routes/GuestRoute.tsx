import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";

export const GuestRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Outlet />;
  }

  if (user.isEmailVerified === false) {
    return <Outlet />;
  }

  return <Navigate to="/dashboard" replace />;
};
