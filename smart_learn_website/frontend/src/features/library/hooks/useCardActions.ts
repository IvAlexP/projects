import { CardsService } from "@/api/cards.service";
import type { CardFormValues } from "@/validation/card.schema";
import { toast } from "sonner";
import { confirmAlert } from "@/utils/alerts";

export const useCardActions = (
  setId: number,
  setSetData: React.Dispatch<React.SetStateAction<any>>,
  closeModals: () => void,
) => {
  const handleCreateCard = async (card: CardFormValues) => {
    try {
      const response = await CardsService.createCard(setId, card);
      setSetData((prev: any) =>
        prev ? { ...prev, cards: [...prev.cards, response.data] } : prev,
      );
      closeModals();
      const apiMessage = response.message || "Card created successfully.";
      toast.success(apiMessage);
    } catch (error: any) {
      const apiErrorMessage =
        error.response?.data?.message || "Failed to create card.";
      toast.error(apiErrorMessage);
    }
  };

  const handleUpdateCard = async (
    cardId: number,
    question: string,
    answer: string,
  ) => {
    try {
      const response = await CardsService.updateCard(cardId, {
        question,
        answer,
      });
      setSetData((prev: any) => {
        if (!prev) return prev;
        const updatedCards = prev.cards.map((card: any) =>
          card.id === cardId ? { ...card, question, answer } : card,
        );
        return { ...prev, cards: updatedCards };
      });
      const apiMessage = response.message || "Card updated successfully.";
      toast.success(apiMessage);
    } catch (error: any) {
      const apiErrorMessage =
        error.response?.data?.message || "Error saving card.";
      toast.error(apiErrorMessage);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    const isConfirmed = await confirmAlert(
      "Are you sure you want to delete this card?",
      "You won't be able to revert this!"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await CardsService.deleteCard(cardId);
      const apiMessage = response.message || "Card deleted successfully.";
      toast.success(apiMessage);
      setSetData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          cards: prev.cards.filter((c: any) => c.id !== cardId),
        };
      });
    } catch (error: any) {
      const apiErrorMessage =
        error.response?.data?.message || "Failed to delete card.";
      toast.error(apiErrorMessage);
    }
  };

  return { handleCreateCard, handleUpdateCard, handleDeleteCard };
};
