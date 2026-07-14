import { type AdminUser, type Badge } from "../types";
import { api } from "./axios";

export const AdminService = {
  getUsers: async (): Promise<AdminUser[]> => {
    const { data } = await api.get("/admin/users");
    return data;
  },

  deleteUser: async (id: number): Promise<void> => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },

  getBadges: async (): Promise<Badge[]> => {
    const { data } = await api.get("/admin/badges");
    return data;
  },

  updateBadge: async (id: number, badgeData: any): Promise<Badge> => {
    const { data } = await api.patch(`/admin/badges/${id}`, badgeData);
    return data;
  },

  createBadge: async (badgeData: any): Promise<void> => {
    const { data } = await api.post("/admin/badges", badgeData);
    return data;
  },

  deleteBadge: async (id: number): Promise<void> => {
    const { data } = await api.delete(`/admin/badges/${id}`);
    return data;
  },
};
