import { api } from "./axios";
import type { LoginForm, RegisterForm } from "@/validation";
import type { LoginResponse, RegisterResponse } from "@/types/auth.types";

export const AuthService = {
  me: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },

  login: async (user: LoginForm): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", user);
    return data;
  },

  register: async (
    user: Pick<RegisterForm, "email" | "password">,
  ): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>("/auth/register", {
      email: user.email,
      password: user.password,
    });
    return data;
  },

  logout: async (): Promise<{ message: string }> => {
    const { data } = await api.post("/auth/logout");
    return data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const { data } = await api.get(`/auth/verifyEmail?token=${token}`);
    return data;
  },

  deleteAccount: async (): Promise<{ message: string }> => {
    const { data } = await api.delete("/auth/delete");
    return data;
  }
};
