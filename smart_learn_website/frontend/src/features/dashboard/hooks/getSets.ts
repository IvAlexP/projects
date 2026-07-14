import { useState, useEffect } from "react";
import { SetsService } from "@/api";
import type { Set } from "@/types";
import { useNavigate } from "react-router-dom";
import { choosePracticeModeAlert } from "@/utils/alerts";

const getSets = () => {
  const [sets, setSets] = useState<Set[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await SetsService.fetchDueSets();
        setSets(response);
      } catch (err: any) {
        const apiErrorMessage =
          err.response?.data?.message || "Failed to load sets.";
        setError(apiErrorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSetClick = async (setId: string) => {
    const mode = await choosePracticeModeAlert();
    if (!mode) {
      return;
    }
    navigate(`/practice/${setId}?mode=${mode}`);
  };

  return {
    sets,
    loading,
    error,
    handleSetClick,
  };
};

export default getSets;
