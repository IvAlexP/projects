import { FieldWrapper, Button } from "@/components";
import styles from "./evaluation.module.css";

interface AutoEvaluationInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onDisagree: () => void;
  isFlipped: boolean;
  isSubmitting: boolean;
  isLastCard: boolean;
}

export const AutoEvaluationInput = ({
  value,
  onChange,
  onSubmit,
  onNext,
  onDisagree,
  isFlipped,
  isSubmitting,
  isLastCard,
}: AutoEvaluationInputProps) => {
  const getLeftButtonText = () => {
    if (isLastCard) {
      return "Finish";
    } else {
      return "Next";
    }
  };

  return (
    <div className={styles.inputContainer}>
      <FieldWrapper label="Your Answer">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              isFlipped ? onNext() : onSubmit();
            }
          }}
          className={styles.inputField}
          disabled={isFlipped || isSubmitting}
          autoFocus
        />
      </FieldWrapper>

      <div className={styles.buttonsContainer}>
        {!isFlipped ? (
          <Button
            text={isSubmitting ? "..." : "Send"}
            onClick={onSubmit}
            disabled={isSubmitting || !value.trim()}
          />
        ) : (
          <Button
            text="Disagree"
            onClick={onDisagree}
            disabled={isSubmitting}
            variant="danger"
          />
        )}
        <Button
          text={getLeftButtonText()}
          onClick={onNext}
          disabled={!isFlipped}
        />
      </div>
    </div>
  );
};
