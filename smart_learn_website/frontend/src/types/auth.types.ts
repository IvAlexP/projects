import type { User } from "@/types";

export interface AuthResponse {
  message: string;
  user: User;
}

export interface LoginResponse extends AuthResponse {
  accessToken: string;
  currentStreak: number;
  points: number;
}

export type RegisterResponse = AuthResponse;

import type { LoginForm } from "@/validation/login.schema";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginForm) => Promise<{ message: string; user: User }>;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<{ message: string }>;
  updateUser: (userData: Partial<User>) => void;
  incrementPoints: (points: number) => void;
}
