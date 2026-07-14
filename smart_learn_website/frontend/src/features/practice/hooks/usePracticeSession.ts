import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CardsService, GamificationService } from "@/api";
import type { PracticeCard } from "@/types";
import { toast } from "sonner";
import { confirmAlert } from "@/utils/alerts";
import { useSessionStorage } from "./useSessionStorage";
import { useEscapeKey } from "./useEscapeKey";

export const usePracticeSession = (cards: PracticeCard[], setId: string) => {
  const navigate = useNavigate();

  const storage = useSessionStorage(cards, setId);
  const {
    STORAGE_KEY,
    sessionCards,
    setSessionCards,
    currentIndex,
    setCurrentIndex,
    sessionScore,
    setSessionScore,
    setIsFinished,
    clearSession,
  } = storage;

  const currentCard = sessionCards[currentIndex];

  const [isFlipped, setIsFlipped] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [startTime, setStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isOverrideMode, setIsOverrideMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      GamificationService.resetCombo().catch((err) => {
        console.error("Failed to reset combo on backend", err);
      });
      setSessionScore(0);
    }
  }, [STORAGE_KEY, setSessionScore]);

  useEffect(() => {
    if (currentCard?.isAnswered) {
      setIsFlipped(true);
      setInputValue(currentCard.userAnswer || "");
      setCorrectAnswer(currentCard.correctAnswer || "");
      setFeedback(currentCard.feedback || "");
      setRating(currentCard.rating || 0);
    } else {
      setIsFlipped(false);
      setIsOverrideMode(false);
      setInputValue("");
      setCorrectAnswer("");
      setFeedback("");
      setRating(0);
      setStartTime(Date.now());
    }
  }, [currentIndex, currentCard]);

  const handleShowAnswer = async () => {
    if (isSubmitting) return;

    if (currentCard.correctAnswer) {
      setCorrectAnswer(currentCard.correctAnswer);
      setIsFlipped(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await CardsService.getCardAnswer(currentCard.id);
      setCorrectAnswer(data.answer);
      setIsFlipped(true);
    } catch (err) {
      toast.error("Failed to load answer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const advanceToNextCard = async (
    ratingToEvaluate: number,
    answerToKeep?: string,
  ) => {
    if (ratingToEvaluate < 3) {
      // if rated poorly, move question to end
      setSessionCards((prev) => {
        const updated = [...prev];
        const [movedCard] = updated.splice(currentIndex, 1);
        return [
          ...updated,
          {
            ...movedCard,
            isAnswered: false,
            rating: 0,
            correctAnswer: answerToKeep || movedCard.correctAnswer,
          },
        ];
      });
    } else {
      // if rated well, move to next
      if (currentIndex < sessionCards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // session finished
        setIsFinished(true);
        clearSession();
        try {
          const response = await CardsService.countDueCards();
          if (response.currentDueCount === 0) {
            navigate("/dashboard", {
              state: { showConfetti: true, earnedPoints: sessionScore },
            });
          } else {
            navigate("/dashboard", { state: { earnedPoints: sessionScore } });
          }
        } catch (error) {
          console.error("Failed to check due cards for confetti:", error);
          navigate("/dashboard", { state: { earnedPoints: sessionScore } });
        }
      }
    }
  };

  const handleRate = async (selectedRating: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await CardsService.rateCard(
        currentCard.id,
        selectedRating,
      );

      setSessionScore((prev) => prev + response.pointsEarned);
      if (response.isCombo) {
        toast.success(`🔥 Combo! +${response.pointsEarned} XP`);
      } else {
        toast.success(`+${response.pointsEarned} XP`, { duration: 800 });
      }

      advanceToNextCard(selectedRating, correctAnswer);
    } catch (err) {
      toast.error("Failed to submit rating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    const card = sessionCards[currentIndex];
    advanceToNextCard(card.rating || 3, card.correctAnswer);
  };

  const handleSubmit = async () => {
    if (isFlipped) return handleNext();
    if (!inputValue.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const timeTaken = (Date.now() - startTime) / 1000;

    try {
      const data = await CardsService.checkAnswer(
        currentCard.id,
        inputValue,
        timeTaken,
      );

      if (data.pointsEarned) {
        setSessionScore((prev) => prev + data.pointsEarned);
        if (data.isCombo) {
          toast.success(`🔥 Combo! +${data.pointsEarned} XP`);
        } else {
          toast.success(`+${data.pointsEarned} XP`, { duration: 800 });
        }
      }

      setSessionCards((prev) => {
        const updated = [...prev];
        updated[currentIndex] = {
          ...currentCard,
          isAnswered: true,
          userAnswer: inputValue,
          correctAnswer: data.correctAnswer,
          rating: data.rating,
          feedback: data.feedback,
        };
        return updated;
      });
      setIsFlipped(true);
    } catch (err) {
      toast.error("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisagree = () => {
    setIsOverrideMode(true);
  };

  const handleOverrideRate = async (selectedRating: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await CardsService.overrideRating(currentCard.id, selectedRating);
      advanceToNextCard(selectedRating, correctAnswer);
    } catch (err) {
      toast.error("Failed to override rating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEscape = useCallback(async () => {
    const isConfirmed = await confirmAlert(
      "Are you sure you want to exit?",
      "Your progress will NOT be lost, but you will have to start this session over.",
    );

    if (isConfirmed) {
      setIsFinished(true);
      clearSession();
      navigate("/dashboard", { state: { earnedPoints: sessionScore } });
    }
  }, [navigate, clearSession, setIsFinished, sessionScore]);

  useEscapeKey(handleEscape);

  return {
    currentIndex,
    sessionScore,
    isFlipped,
    isOverrideMode,
    inputValue,
    setInputValue,
    isSubmitting,
    correctAnswer,
    rating,
    feedback,
    handleShowAnswer,
    handleRate,
    handleSubmit,
    handleNext,
    handleDisagree,
    handleOverrideRate,
    handleEscape,
    currentCard,
    totalCards: sessionCards.length,
    isEmpty: sessionCards.length === 0,
  };
};
