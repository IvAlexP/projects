import styles from "./statsContainer.module.css";

interface StatsContainerProps {
  title: string;
  children: React.ReactNode;
  subtitle?: React.ReactNode;
}

export const StatsContainer = ({
  title,
  children,
  subtitle,
}: StatsContainerProps) => {

  return (
    <div className={styles.statsContainer}>
      <h3>{title}</h3>
      <div className={styles.btnGroup}>
        {subtitle}
      </div>
      {children}
    </div>
  );
};
