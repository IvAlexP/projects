import styles from './hero.module.css';
import { Button } from '@/components';
import flashcards from '../../assets/flashcards.png';

export const Hero = () => {
  return (
    <div className={styles.heroContainer}>
        <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Learn more efficient today!</h1>
            <div className={styles.heroSubtitle}>Import your materials, make your own flashcards and start learning based on your time, effort, knowledge and progress.</div> 
            <div className={styles.heroSubtitle}>If you're ready to take your learning to the next level, sign up now!</div>
            <Button text="Sign up" to="/register" />
        </div>
        <div className={styles.heroImageContainer}>
            <img src={flashcards} alt="flashcards" className={styles.heroImage} />
        </div>
    </div>
  );
};
