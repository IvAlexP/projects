import { differenceInDays, parse, startOfDay } from "date-fns";
import styles from "./customTooltip.module.css";

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const stabilityCards = payload.find((p: any) => p.dataKey === "cards")?.value;
  const reviewHours = payload.find((p: any) => p.dataKey === "percentage")?.value;
  
  const pointsCount = payload[0]?.payload?.points;
  const reviewsCount = payload[0]?.payload?.reviews;
  const totalReviews = payload[0]?.payload?.totalReviews;
  
  const total = payload.find((p: any) => p.dataKey === "total")?.value; 

  const isStability = stabilityCards !== undefined;
  const isReviewHours = reviewHours !== undefined;
  const isActivityGraph = reviewsCount !== undefined || pointsCount !== undefined;

  let headerText = "";

  if (isStability) {
    headerText = `${stabilityCards} card${stabilityCards !== 1 ? "s" : ""} with ${label} day stability`;
  } else if (isReviewHours) {
    headerText = `${reviewHours}% of reviews at ${label}:00`;
  } else if (isActivityGraph) {
    let labelDate = parse(label, "dd-MM-yyyy", new Date());
    const today = startOfDay(new Date());
    const daysDiff = differenceInDays(today, startOfDay(labelDate));
    headerText =
      daysDiff === 0
        ? "Today"
        : daysDiff === 1
          ? "Yesterday"
          : `${daysDiff} days ago`;
  }

  return (
    <div className={styles.card}>
      <h5>{headerText}</h5>

      {isStability && (
        <p>{`Total: ${total == 1 ? "1 card" : `${total} cards`}`}</p>
      )}

      {isActivityGraph && (
        <>
          {reviewsCount !== undefined && <p className={styles.cards}>Cards: <b>{reviewsCount}</b></p>}
          {pointsCount !== undefined && <p className={styles.points}>Points: <b>{pointsCount}</b></p>}
          
          <div className={styles.total}>
            {totalReviews !== undefined && <p className={styles.cards}>Total Cards: {totalReviews}</p>}
            {total !== undefined && <p className={styles.points}>Total XP: {total}</p>}
          </div>
        </>
      )}
    </div>
  );
};