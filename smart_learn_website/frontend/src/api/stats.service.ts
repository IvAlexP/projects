import { api } from "@/api";
import type { StabilityStats, ReviewHoursStat, ActivityStats } from "@/types/stats.types";

export const StatsService = {
  getActivityStats: async (days: number): Promise<{ data: ActivityStats }> => {
    const response = await api.get(`/stats/activity?days=${days}`);
    return response;
  },

  getStabilityStats: async (): Promise<{ data: StabilityStats }> => {
    const response = await api.get(`/stats/stability`);
    return response;
  },

  getReviewHours: async (offset: number): Promise<{ data: ReviewHoursStat[] }> => {
    const response = await api.get(`/stats/hours?offset=${offset}`);
    return response;
  }
};
