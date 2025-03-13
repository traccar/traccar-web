import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartComponent = ({ data }) => {
  const getPercentage = (value, total) => {
    return value === 0 ? '' : ((value / total) * 100).toFixed(2) + '%'; // Return empty if value is 0
  };
  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <PieChart width={250} height={150}>
      <Pie
        data={data}
        fill="#8884d8"
        paddingAngle={1}
        dataKey="value"
        stroke={'none'} // Show lines (stroke) if true, hide if false
        strokeWidth={0}
        label={({
          cx,
          cy,
          midAngle,
          innerRadius,
          outerRadius,
          value,
          index,
        }) => {
          const percentage = getPercentage(value, totalValue);
          if (!percentage) return null; // Don't show label for 0 values

          const radius = outerRadius + (innerRadius - outerRadius) / 2;
          const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
          const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

          return (
            <text
              x={x}
              y={y}
              fill="#fff"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
            >
              {percentage}
            </text>
          );
        }}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend
        layout="vertical" // Vertical layout
        verticalAlign="middle" // Align vertically in the middle
        align="right" // Align the legend to the right
      />
    </PieChart>
  );
};

export default PieChartComponent;
