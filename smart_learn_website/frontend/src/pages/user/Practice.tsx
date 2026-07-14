import { useParams, useSearchParams } from "react-router-dom";
import {
  SetHeader,
  Flashcard,
  SelfEvaluationInput,
  AutoEvaluationInput,
  ProgressBar,
} from "@/features/practice/components";
import { usePractice, usePracticeSession } from "@/features/practice/hooks";
import styles from "@/features/practice/styles/styles.module.css";

function Practice() {
  const { setId } = useParams<{ setId: string }>();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "auto"; // Default to auto if missing

  const { cards, loading, setData } = usePractice(setId!);

  const session = usePracticeSession(cards, setId!);

  if (loading || session.isEmpty) {
    return <div>Loading...</div>;
  }

  if (!session.currentCard) {
    return <div>No more cards to show!</div>;
  }

  if (!setData || !cards.length) {
    return <div>Empty set.</div>;
  }

  return (
    <div>
      <div className="pageContent">
        <SetHeader title={setData.title} description={setData.description} />

        <div className={styles.flashcardContainer}>
          <ProgressBar
            currentIndex={session.currentIndex}
            totalCards={session.totalCards}
            sessionScore={session.sessionScore}
            onExit={session.handleEscape}
          />

          <Flashcard
            key={session.currentCard.id}
            question={session.currentCard.question}
            correctAnswer={
              session.currentCard.correctAnswer || session.correctAnswer
            } // from current state or localStorage
            feedback={session.feedback}
            isFlipped={session.isFlipped}
            rating={session.rating}
          />

          {mode === "self" || session.isOverrideMode ? (
            <SelfEvaluationInput
              onShowAnswer={session.handleShowAnswer}
              onRate={
                session.isOverrideMode
                  ? session.handleOverrideRate
                  : session.handleRate
              }
              isFlipped={session.isFlipped}
              isSubmitting={session.isSubmitting}
            />
          ) : (
            <AutoEvaluationInput
              value={session.inputValue}
              onChange={session.setInputValue}
              onSubmit={session.handleSubmit}
              onNext={session.handleNext}
              isFlipped={session.isFlipped}
              isSubmitting={session.isSubmitting}
              isLastCard={session.currentIndex === session.totalCards - 1}
              onDisagree={session.handleDisagree}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Practice;
