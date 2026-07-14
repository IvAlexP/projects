import { useState, useEffect } from "react";
import { SetsService } from "@/api";
import { useSetDetailUI, useCardActions, useSetActions, useShareSet } from "./";
import type { SetDetail } from "@/types";


export const useSetManager = (setId: string) => {
  const [setData, setSetData] = useState<SetDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const ui = useSetDetailUI();
  
  const cardActions = useCardActions(Number(setId), setSetData, () => {
    ui.setIsAdding(false);
    ui.setEditingCardId(null);
  });
  
  const setActions = useSetActions(
    setSetData,
    () => {
      ui.setIsEditingSet(false);
      ui.setIsEditingInfo(false);
    },
    Number(setId),
  );
  
  const shareSet = useShareSet(Number(setId)); 

  useEffect(() => {
    const loadSet = async () => {
      setLoading(true);
      try {
        const res = await SetsService.fetchSetById(setId);
        setSetData(res as SetDetail);
      } finally {
        setLoading(false);
      }
    };
    loadSet();
  }, [setId]);

  return {
    setData,
    loading,
    ui: {
      ...ui,
    },
    shareUi: shareSet.ui,
    shareState: shareSet.state,
    actions: {
      ...cardActions,
      ...setActions,
      ...shareSet.actions,
    },
  };
};
