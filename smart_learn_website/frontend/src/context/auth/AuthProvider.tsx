import { useState, useEffect, type ReactNode, useCallback } from "react";
import { AuthService } from "@/api";
import { AuthContext } from "./AuthContext";
import type { User } from "@/types";
import type { LoginForm } from "@/validation";

const ipcRenderer = (window as any).require
  ? (window as any).require("electron").ipcRenderer
  : null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateUser = (userData: Partial<User>) => {
    setUser((prev: User | null) => {
      if (!prev) {
        return null;
      }
      return { ...prev, ...userData };
    });
  };

  const incrementPoints = useCallback((pointsToAdd: number) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      return { ...prevUser, points: prevUser.points + pointsToAdd };
    });
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const response = await AuthService.me();
      setUser(response.user);
      if (ipcRenderer) {
        ipcRenderer.send("user-auth-ready");
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginForm) => {
    const result = await AuthService.login(data);
    if (result.user) {
      setUser(result.user);
      if (ipcRenderer) {
        ipcRenderer.send("user-auth-ready");
      }
    }
    return result;
  };

  const logout = async () => {
    try {
      const data = await AuthService.logout();
      if (ipcRenderer) {
        ipcRenderer.send("clear-user-session");
      }
      return data;
    } catch (error) {
      console.error("Failed to log out on the server:", error);
      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleForceLogout = () => setUser(null);
    window.addEventListener("force-logout", handleForceLogout);
    return () => window.removeEventListener("force-logout", handleForceLogout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        checkAuth,
        logout,
        login,
        updateUser,
        incrementPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
