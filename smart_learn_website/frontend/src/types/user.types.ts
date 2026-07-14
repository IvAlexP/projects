export interface User {
  id: number;
  email: string;
  displayName: string;
  createdAt: string;
  isEmailVerified: boolean;
  currentStreak: number;
  longestStreak: number;
  points: number;
  role: "USER" | "ADMIN";
}
