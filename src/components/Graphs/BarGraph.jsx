import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

const BarGraph = ({
  data,
  barWidth = 20,
  xAxisLabel = "Category",
  yAxisLabel = "Value",
  legendLabel = "Metric",
  barColor = "#ff6b6b",
}) => {
  const getMaxValue = (data) => {
    return Math.max(...data?.map((item) => item.value)) + 1;
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barSize={barWidth}>
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          padding={{ left: 10, right: 10 }}
        ></XAxis>
        <YAxis
          axisLine={false}
          tickLine={false}
          padding={{ top: 10, bottom: 10 }}
          tickCount={getMaxValue(data)}
          domain={[0, getMaxValue(data)]}
          ticks={Array.from({ length: getMaxValue(data) }, (_, i) => i)}
        >
          <Label value={yAxisLabel} angle={-90} position="insideLeft" />
        </YAxis>
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          payload={[
            {
              value: legendLabel,
              type: "square",
              id: "ID01",
              color: barColor,
            },
          ]}
        />
        <Bar dataKey="value" fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;
