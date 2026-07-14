import { useState, useEffect } from "react";
import { SetsService } from "../../../api/sets.service"; 
import type { PracticeSet } from "../../../types/set.types"; 

export const usePractice = (setId: string) => {
  const [setData, setSetData] = useState<PracticeSet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await SetsService.fetchPracticeSetById(setId);
        setSetData(response as PracticeSet);
      } catch (err: any) {
        const apiErrorMessage = err.response?.data?.message || "Failed to load the set.";
        setError(apiErrorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (setId) {
      loadData();
    }
  }, [setId]);

  return {
    setData, 
    cards: setData?.cards || [],
    loading,
    error,
  };
};
