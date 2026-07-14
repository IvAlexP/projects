import { useEffect, useState } from "react";
import { StatsService } from "@/api/stats.service";
import type { ReviewHoursStat } from "@/types/stats.types";

export const useReviewHoursStats = () => {
  const [data, setData] = useState<ReviewHoursStat[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewHoursStatistics = async () => {
      try {
        setLoading(true);
        const offset = new Date().getTimezoneOffset();         
        const response = await StatsService.getReviewHours(offset); 
        setData(response.data);
      } catch (error: any) {
        const apiErrorMessage =
          error.response?.data?.message || "Failed to fetch statistics.";
        setError(apiErrorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewHoursStatistics();
  }, []);

  return { data, loading, error };
};