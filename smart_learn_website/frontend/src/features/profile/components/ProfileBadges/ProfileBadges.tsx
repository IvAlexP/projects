import styles from './ProfileBadges.module.css';
import { useProfileInfo } from '../../hooks/useProfileInfo';

export function ProfileBadges() {
  const { badges, isLoading } = useProfileInfo();

  if (isLoading) {
    return <div>Loading your achievements...</div>;
  }

  return (
    <div className={styles.sectionContainer}>
      <h3>Your Achievements</h3>
      
      <div className={styles.badgesContainer}>
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`${styles.badge} ${badge.isUnlocked ? styles.unlocked : styles.locked}`}
          >
            <div className={styles.icon}>
              {badge.icon || '🏆'} 
            </div>
            
            <h4 className={styles.title}>
              {badge.name}
            </h4>
            
            <p className={styles.description}>
              {badge.description}
            </p>

            {badge.isUnlocked && badge.earnedAt && (
              <div className={styles.date}>
                {new Date(badge.earnedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}