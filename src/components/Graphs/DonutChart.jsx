import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

const DonutChart = ({ data }) => {
  if (!data || !data.labels || !data.datasets || !data.datasets[0]) {
    return (
      <div className="text-center text-gray-500">No chart data available</div>
    );
  }

  const chartData = data?.labels?.map((label, index) => ({
    name: label,
    value: data?.datasets[0]?.data?.[index] || 0,
    formattedLabel: data?.formatted_labels?.[index] || `${label}: N/A`,
  }));

  if (chartData.length === 0) {
    return <div className="text-center text-gray-500">No data to display</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            fill="#8884d8"
            paddingAngle={0}
            label={({ name, value, percent }) =>
              `${name}: ${(percent * 100).toFixed(1)}%`
            }
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  data.datasets[0].backgroundColor?.[
                    index % (data.datasets[0].backgroundColor?.length || 1)
                  ] || "#8884d8"
                }
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              value,
              chartData.find((d) => d.name === name)?.formattedLabel || name,
            ]}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
            formatter={(value, entry) => {
              const dataEntry = chartData.find((d) => d.name === value);
              return dataEntry ? dataEntry.formattedLabel : value;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
