import { useEffect, useState } from "react";
import { StatsService } from "@/api/stats.service";
import type { ActivityStats } from "@/types/stats.types";

export const useActivityStats = (days: number = 30) => {
  const [data, setData] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPointsStatistics = async () => {
      try {
        setLoading(true);
        const response = await StatsService.getActivityStats(days);
        setData(response.data);
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to fetch activity stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchPointsStatistics();
  }, [days]);

  return { data, loading, error };
};
