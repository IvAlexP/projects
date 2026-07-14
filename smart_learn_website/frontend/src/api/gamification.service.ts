import { api } from "./axios";

export const GamificationService = {
  checkIn: async (): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.post("/gamification/check-in");
    return data;
  },

  getUserBadges: async (): Promise<any[]> => {
    const { data } = await api.get("/gamification/badges");
    return data;
  },

  resetCombo: async (): Promise<{ message: string }> => {
    const { data } = await api.post("/gamification/reset-combo");
    return data;
  },

  getPersonalTop: async () => {
    const { data } = await api.get("/gamification/personal-top");
    return data;
  }
};
