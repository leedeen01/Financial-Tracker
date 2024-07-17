import { useState, useEffect } from "react";
import { Expense } from "../models/expense";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Customized,
} from "recharts";
import { Category } from "../models/category";

interface Props {
  expenses: Expense[];
  categories: Category[];
}

const OverviewChart = ({ expenses, categories }: Props) => {
  const dataByCategory = categories
    .map(category => {
      const total = expenses
        .filter(expense => expense.category === category.name)
        .reduce((sum, expense) => sum + expense.amount, 0);

  return {
    name: category.name,
    value: parseFloat(total.toFixed(2)),
    color: category.color,
  };
});

  const totalExpenses = expenses.reduce((sum, expense) => {
    const category = categories.find(cat => cat.name === expense.category);
    if (category && category.type !== "Income") {
      return sum + expense.amount;
    }
    return sum;
  }, 0);

  const totalIncome = expenses.reduce((sum, expense) => {
    const category = categories.find(cat => cat.name === expense.category);
    if (category && category.type !== "Expense") {
      return sum + expense.amount;
    }
    return sum;
  }, 0);

  const expensesCenterText = () => {
    return (
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={20}
      >
        Total: ${(totalIncome - totalExpenses).toFixed(2)}
      </text>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const legendFormatter = (value: string, entry: any) => {
    const { payload } = entry;
    return <span style={{ color: payload.color }}>{value}</span>;
  };

  const [radius, setRadius] = useState({ outerRadius: 180, innerRadius: 100 });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // Small devices (tablets)
        setRadius({ outerRadius: 160, innerRadius: 80 });
      } else {
        // Medium devices (desktops) and up
        setRadius({ outerRadius: 180, innerRadius: 100 });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial radius

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rgba = (color: string, alpha: number) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <ResponsiveContainer width="100%" height={450}>
      <PieChart>
        <Pie
          data={dataByCategory}
          dataKey="value"
          nameKey="name"
          cornerRadius={10}
          cx="50%"
          cy="50%"
          outerRadius={radius.outerRadius}
          innerRadius={radius.innerRadius}
          isAnimationActive={true}
        >
          {dataByCategory.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={rgba(entry.color, 0.5)}
              stroke={rgba(entry.color, 1)}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend formatter={legendFormatter} />
        <Customized component={expensesCenterText} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default OverviewChart;
