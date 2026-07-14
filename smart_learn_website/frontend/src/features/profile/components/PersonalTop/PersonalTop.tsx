import { useEffect, useState } from "react";
import { GamificationService } from "@/api";
import { toast } from "sonner";
import styles from "./PersonalTop.module.css";

interface DailyRecord {
  id: number;
  date: string;
  pointsEarned: number;
}

export const PersonalTop = () => {
  let [records, setRecords] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const data = await GamificationService.getPersonalTop();
        setRecords(data);
      } catch (err) {
        toast.error("Failed to load personal records.");
      } finally {
        setLoading(false);
      }
    };

    fetchTop();
  }, []);

  if (loading) {
    return <p>Loading personal records...</p>;
  }

  const icons = ["🥇", "🥈", "🥉"];

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Personal Top</h3>
      {records.length === 0 ? (
        <p className={styles.row}>
          No records yet. Keep studying to make history!
        </p>
      ) : (
        <div className={styles.list}>
          {records.map((record, index) => (
            <div key={record.id} className={styles.row}>
              <div className={styles.icon}>{icons[index]}</div>
              <div>
                {new Date(record.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className={styles.points}>
                <b>{record.pointsEarned} XP</b>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
