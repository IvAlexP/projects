import getSets from "../../hooks/getSets";
import styles from "./listOfDueSets.module.css";
import { CardWrapper } from "@/components";

export const ListOfDueSets = () => {
  const { sets, loading, handleSetClick } = getSets();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!sets) {
    return <div>You do not have any sets yet.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.setsContainer}>
        {sets.length === 0 ? (
          <p>
            You have no sets with due cards. Great job! Keep up the good work!
          </p>
        ) : (
          sets.map((set) => (
            <CardWrapper
              key={set.id}
              onClick={() => handleSetClick(set.id.toString())}
              className={styles.set}
            >
              <h3>{set.title}</h3>
              <p>{set.description}</p>
              <p className={styles.dueCardsCount}>
                {set.dueCardsCount}/{set.totalCards}{" "}
                {set.totalCards === 1 ? "card" : "cards"} due
              </p>
              <span className={styles.practiceBtn}>Practice</span>
            </CardWrapper>
          ))
        )}
      </div>
    </div>
  );
};
