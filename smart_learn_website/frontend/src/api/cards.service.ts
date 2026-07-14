import { api } from "./axios.ts";
import type { Card } from "@/types";
import type { CardFormValues } from "@/validation";

export const CardsService = {
  createCard: async (
    setId: number,
    card: CardFormValues,
  ): Promise<{ data: Card; message: string }> => {
    const { data } = await api.post(`/cards/${setId}`, card);
    return data;
  },

  updateCard: async (
    cardId: number,
    card: Partial<Card>,
  ): Promise<{ data: Card; message: string }> => {
    const { data } = await api.patch(`/cards/${cardId}`, card);
    return data;
  },

  deleteCard: async (cardId: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/cards/${cardId}`);
    return data;
  },

  countDueCards: async (): Promise<{ dueCount: number }> => {
    const { data } = await api.get(`/cards/due/count`);
    return data;
  },

  getCardAnswer: async (cardId: number): Promise<{ answer: string }> => {
    const response = await api.get(`/cards/${cardId}/answer`);
    return response.data;
  },

  rateCard: async (cardId: number, rating: number): Promise<{ success: boolean, pointsEarned: number, isCombo: boolean }> => {
    const response = await api.post(`/cards/${cardId}/rate`, { rating });
    return response.data;
  },

  overrideRating: async (cardId: number, rating: number): Promise<{ success: boolean, pointsEarned: number, isCombo: boolean }> => {
    const response = await api.post(`/cards/${cardId}/override`, { rating });
    return response.data;
  },

  checkAnswer: async (
    cardId: number,
    userAnswer: string,
    timeTaken: number,
  ): Promise<{ correctAnswer: string; rating: number; feedback: string, pointsEarned: number, isCombo: boolean }> => {
    const { data } = await api.post(`/cards/${cardId}/check`, {
      userAnswer,
      timeTaken,
    });
    return data;
  },
};
