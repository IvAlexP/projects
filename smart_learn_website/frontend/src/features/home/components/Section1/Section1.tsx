import styles from './section1.module.css';

export const Section1 = () => {
    return (
        <div className={styles.section1Container}>
            <h2 className={styles.title}>How does it work?</h2>
            <div className={styles.columns}>
                <div className={styles.column}>
                    <h3 className={styles.columnTitle}>Active recall</h3>
                    <div className={styles.columnText}>Memory must be trained! And reading is not enough. In order to memorize something, you must try to actively recall it from memory.</div>
                </div>
                <div className={styles.column}>
                    <h3 className={styles.columnTitle}>Performance evaluation</h3>
                    <div className={styles.columnText}>Do you feel like you don't have enough time to study? You can skip information that you already master and focus on your weaknesses.</div>
                </div>
                <div className={styles.column}>
                    <h3 className={styles.columnTitle}>Spaced repetition</h3>
                    <div className={styles.columnText}>The pressure of a big exam can be overwelming and may impede your studying. You must space out the information rather than learning it all at once.</div>
                </div>
            </div>
        </div>
    );
}
