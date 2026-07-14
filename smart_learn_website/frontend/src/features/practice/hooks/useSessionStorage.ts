import { useState, useEffect, useCallback } from "react";
import type { PracticeCard } from "@/types";

export interface SessionCard extends PracticeCard {
  isAnswered?: boolean;
  userAnswer?: string;
  correctAnswer?: string;
  feedback?: string;
  rating?: number;
}

export const useSessionStorage = (cards: PracticeCard[], setId: string) => {
  const STORAGE_KEY = `practice_session_${setId}`;

  const [sessionCards, setSessionCards] = useState<SessionCard[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.sessionCards;
    }
    return cards;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.currentIndex;
    }
    return 0;
  });

  const [sessionScore, setSessionScore] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Only restore the score if there are actually cards left to do!
      if (parsed.sessionCards && parsed.sessionCards.length > 0) {
        return parsed.sessionScore || 0;
      }
    }
    return 0; // Brand new session always starts at 0
  });

  const [isFinished, setIsFinished] = useState(false);

  // Initialize un-answered state for new cards
  useEffect(() => {
    if (cards.length > 0 && sessionCards.length === 0) {
      setSessionCards(cards.map((card) => ({ ...card, isAnswered: false })));
    }
  }, [cards, sessionCards.length]);

  // Sync to local storage
  useEffect(() => {
    if (!isFinished && sessionCards.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ sessionCards, currentIndex, sessionScore }),
      );
    }
  }, [sessionCards, currentIndex, sessionScore, STORAGE_KEY, isFinished]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, [STORAGE_KEY]);

  return {
    STORAGE_KEY,
    sessionCards,
    setSessionCards,
    currentIndex,
    setCurrentIndex,
    sessionScore,
    setSessionScore,
    isFinished,
    setIsFinished,
    clearSession,
  };
};
