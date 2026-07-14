import styles from "./setHeader.module.css";

export const SetHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className={styles.header}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};
