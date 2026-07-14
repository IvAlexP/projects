import { useState, useEffect } from "react";
import { StatsService } from "@/api/stats.service";
import type { StabilityStats } from "@/types/stats.types";


export const useStabilityStats = () => {
  const [data, setData] = useState<StabilityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await StatsService.getStabilityStats();
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch stability stats");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Only runs on mount

  return { data, loading, error };
};