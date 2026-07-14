import { useState } from "react";
import { useActivityStats } from "../../hooks";
import { StatsContainer } from "../StatsContainer/StatsContainer";
import { Chart } from "../Chart/Chart";
import { Button } from "@/components";
import styles from './ActivityStatsSection.module.css';

export const ActivityStatsSection = () => {
  const [days, setDays] = useState(30);
  const { data, loading } = useActivityStats(days);

  const periodButtons = (
    <>
      {[30, 180, 365].map((d) => (
        <Button
          key={d}
          variant="light"
          className={days === d ? styles.active : ""}
          onClick={() => setDays(d)}
          text={d === 30 ? "1m" : d === 180 ? "6m" : "1y"}
        />
      ))}
    </>
  );

  return (
    <StatsContainer
      title="Daily Activity"
      subtitle={periodButtons}
    >
      <Chart 
        data={data}
        loading={loading} 
        xAxisKey="day" 
        barKey="points"
        secondaryBarKey="reviews"
        yAxisUnit="XP"
        secondaryYAxisUnit="c"
      />
    </StatsContainer>
  );
};