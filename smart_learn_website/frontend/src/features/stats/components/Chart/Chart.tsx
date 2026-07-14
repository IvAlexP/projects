import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "../CustomTooltip/CustomTooltip";

interface ChartProps {
  data: any[] | null;
  loading: boolean;
  xAxisKey: string;
  xAxisUnit?: string;
  yAxisUnit?: string;
  barKey: string;
  secondaryBarKey?: string;
  secondaryYAxisUnit?: string;
}

export const Chart = ({
  data,
  loading,
  xAxisKey,
  xAxisUnit,
  yAxisUnit,
  barKey,
  secondaryBarKey,
  secondaryYAxisUnit,
}: ChartProps) => {
  const chartHeight = 300;

  if (loading || !data) {
    return (
      <div style={{ height: chartHeight, backgroundColor: "var(--t-white)" }} />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <ComposedChart data={data}>
        <CartesianGrid stroke="var(--t-white)" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          style={{ fontSize: 12 }}
          interval="preserveStartEnd"
          minTickGap={15}
          tickFormatter={(value) =>
            xAxisUnit ? `${value}${xAxisUnit}` : value
          }
        />
        {/* Left Y-Axis */}
       <YAxis
          yAxisId="left"
          style={{ fontSize: 12 }}
          width={45}
          minTickGap={10}
          tickFormatter={(value) => (yAxisUnit ? `${value}${yAxisUnit}` : value)}
        />
        {/* Right Axis */}
        {secondaryBarKey && (
          <YAxis
            yAxisId="right"
            orientation="right"
            style={{ fontSize: 12 }}
            width={45} // Slightly wider to fit the label
            minTickGap={10}
            tickFormatter={(value) => (secondaryYAxisUnit ? `${value}${secondaryYAxisUnit}` : value)}
          />
        )}
        <Tooltip content={<CustomTooltip />} />

        {/*the cumulative grey curve*/}
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="total"
          fill="var(--t-white)"
          stroke="var(--primary-color)"
        />

        <Bar yAxisId="left" dataKey={barKey} barSize={10} fill="var(--secondary-color)" />
        {secondaryBarKey && (
          <Bar yAxisId="right" dataKey={secondaryBarKey} barSize={10} fill="#48bb78" /> 
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
