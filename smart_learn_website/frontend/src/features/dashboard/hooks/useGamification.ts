import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { GamificationService } from "@/api";
import { toast } from "sonner";
import { useAuth } from "@/context/auth/AuthContext";

export const useGamification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateUser, incrementPoints } = useAuth();

  useEffect(() => {
    const state = location.state as any;

    if (state?.showConfetti || state?.earnedPoints > 0) {

      window.history.replaceState({}, document.title);
      
      if (state?.showConfetti) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42"],
        });
      }

      if (state?.earnedPoints > 0) {
        incrementPoints(state.earnedPoints);
      }
      
      // confetti does not show again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, incrementPoints]);

  useEffect(() => {
    const handleCheckIn = async () => {
      try {
        const response = await GamificationService.checkIn();
        if (response.effectiveStreak) {
          updateUser({ currentStreak: response.effectiveStreak });
        }

        if (response?.newBadges?.length > 0) {
          response.newBadges.forEach((badge: any) => {
            toast.success(`Achievement Unlocked: ${badge.name}!`);
          });
        }
      } catch (err) {
        console.error("Failed to check in today:", err);
      }
    };

    handleCheckIn();
  }, []);
};
