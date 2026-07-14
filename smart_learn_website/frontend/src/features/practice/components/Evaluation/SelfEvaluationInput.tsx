import { Button } from "@/components";
import styles from "./evaluation.module.css";

interface SelfEvaluationInputProps {
  onShowAnswer: () => void;
  onRate: (rating: number) => void;
  isFlipped: boolean;
  isSubmitting: boolean;
}

export const SelfEvaluationInput = ({
  onShowAnswer,
  onRate,
  isFlipped,
  isSubmitting,
}: SelfEvaluationInputProps) => {
  if (!isFlipped) {
    return (
      <div className={styles.buttonsContainer}>
        <Button
          text="Show Answer"
          onClick={onShowAnswer}
          disabled={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div className={styles.buttonsContainer}>
      <Button text="Again" onClick={() => onRate(1)} disabled={isSubmitting} />
      <Button text="Hard" onClick={() => onRate(2)} disabled={isSubmitting} />
      <Button text="Good" onClick={() => onRate(3)} disabled={isSubmitting} />
      <Button text="Easy" onClick={() => onRate(4)} disabled={isSubmitting} />
    </div>
  );
};
