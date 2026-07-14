import styles from "./flashcard.module.css";

interface FlashcardProps {
  question: string;
  correctAnswer?: string; // only passed when flipped
  isFlipped: boolean;
  feedback?: string;
  rating?: number;
}

export const Flashcard = ({
  question,
  correctAnswer,
  isFlipped,
  feedback,
  rating,
}: FlashcardProps) => {
  return (
    <div className={styles.flashcardContainer}>
      <div
        className={`${styles.flashcard} ${isFlipped ? styles.isFlipped : ""}`}
      >
        <div
          className={`${styles.flashcardSide} ${styles.text} ${styles.front}`}
        >
          <div className={styles.front}>{question}</div>
        </div>
        <div
          className={`${styles.flashcardSide} ${styles.text} ${styles.back}`}
        >
          {isFlipped && (
            <div className={styles.answerContainer}>
              <h3>{correctAnswer}</h3>
            </div>
          )}
        </div>
      </div>
      {feedback && (
        <p
          className={`${styles.feedback} ${rating === 1 ? styles.incorrect : styles.correct}`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
};
