import { useStabilityStats } from "../../hooks";
import { StatsContainer } from "../StatsContainer/StatsContainer";
import { Chart } from "../Chart/Chart";

export const StabilityStatsSection = () => {
  const { data, loading } = useStabilityStats();
  const subtitle = (
    <p>Number of days until your chance of recalling drops to 90%</p>
  );

  return (
    <StatsContainer title="Current Stability" subtitle={subtitle}>
      <Chart
        data={data}
        loading={loading}
        xAxisKey="stability"
        xAxisUnit="d"
        barKey="cards"
      />
    </StatsContainer>
  );
};
