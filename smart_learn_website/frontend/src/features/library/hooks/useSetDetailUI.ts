import { useState } from "react";

export const useSetDetailUI = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [isEditingSet, setIsEditingSet] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [seeAnswers, setSeeAnswers] = useState(false);

  const isAnyFormOpen =
    isAdding || editingCardId !== null || isEditingSet || isEditingInfo;

  return {
    isAdding,
    setIsAdding,
    editingCardId,
    setEditingCardId,
    isEditingSet,
    setIsEditingSet,
    isEditingInfo,
    setIsEditingInfo,
    isAnyFormOpen,
    seeAnswers,
    setSeeAnswers,
  };
};