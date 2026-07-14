import styles from "./progressBar.module.css";
import { Button } from "@/components";

interface ProgressBarProps {
    currentIndex: number;
    totalCards: number;
    sessionScore: number;
    onExit: () => void;
}

export const ProgressBar = ({ currentIndex, totalCards, sessionScore, onExit }: ProgressBarProps) => {
    return (
        <div className={styles.progressBar}>
            <h3>
                {currentIndex + 1} / {totalCards}
            </h3>
            <p>Score: {sessionScore} XP</p>
            <Button variant="light" onClick={onExit} text="Exit" />
        </div>
    );
};
