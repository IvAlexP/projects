import { useReviewHoursStats } from "../../hooks";
import { StatsContainer } from "../StatsContainer/StatsContainer";
import { Chart } from "../Chart/Chart";

export const ReviewHoursStatsSection = () => {
  const { data, loading } = useReviewHoursStats();

  return (
    <StatsContainer title="Review Hours">
      <Chart
        data={data}
        loading={loading}
        xAxisKey="hour"
        barKey="percentage"
        yAxisUnit="%"
      />
    </StatsContainer>
  );
};
