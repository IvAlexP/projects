import type { User } from "@/types";
import { api } from "./axios";

export const UserService = {
  getProfile: async () : Promise<User> => {
    const { data } = await api.get("/user/profile");
    return data;
  },

  updateDisplayName: async (displayName: string) => {
    const { data } = await api.patch("/user/update/displayName", { displayName });
    return data;
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.patch("/user/update/password", { currentPassword, newPassword });
    return data;
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const { data } = await api.get(`/user/search?q=${encodeURIComponent(query)}`);
    return data;
  }
};
