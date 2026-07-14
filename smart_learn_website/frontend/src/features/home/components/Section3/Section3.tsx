import styles from './section3.module.css';
import progress from '../../assets/progress.jpg';

export const Section3 = () => {
    return (
        <div className={styles.section3Container}>
            <div className={styles.section3ImageContainer}>
                <img src={progress} alt="progress" className={styles.section3Image} />
            </div>
            <div className={styles.section3Text}>
                <h2 className={styles.section3Title}>You are your competition</h2>
                <div className={styles.section3Subtitle}>
                    <div className={styles.badgeContainer}>
                        <p className={styles.badge}>🏆</p>
                    </div>
                    <div>Achieve daily targets <br/> Unlock new badges <br/> Increase your score</div>
                    <div className={styles.badgeContainer}>
                        <p className={styles.badge}>🔥</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
