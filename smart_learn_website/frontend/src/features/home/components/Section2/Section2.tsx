import styles from './section2.module.css';

export const Section2 = () => {
    return (
        <div className={styles.section2Container}>
            <div className={`${styles.column} ${styles.textColumn}`}>
                <h3 className={styles.columnTitle}>Optimal timing</h3>
                <div className={styles.columnSubtitle}>Repeting is the mother of learning. But not just at any time. You must review information right before forgetting it in order to ensure its steadiness.</div>
            </div>
            <h2 className={styles.column}>Why does it work?</h2>
            <div className={`${styles.column} ${styles.textColumn}`}>
                <h3 className={styles.columnTitle}>Long-term memory</h3>
                <div className={styles.columnSubtitle}>By repeatedly reviewing information at the right time, it seeds deeper in your memory, prolonging its longevity.</div>
            </div>
        </div>
    );
}
