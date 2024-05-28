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

interface Category {
  name: string;
  background: string;
  border: string;
}

interface Props {
  expenses: Expense[];
  categories: Category[];
}

const OverviewChart = ({ expenses, categories }: Props) => {
  const dataByCategory = categories.map((category) => {
    const total = expenses
      .filter((expense) => expense.category === category.name)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      name: category.name,
      value: parseFloat(total.toFixed(2)),
      backgroundColor: category.background,
      borderColor: category.border,
    };
  });

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const expensesCenterText = () => {
    return (
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={20}
      >
        Total: ${totalExpenses.toFixed(2)}
      </text>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const legendFormatter = (value: string, entry: any) => {
    const { payload } = entry;
    return <span style={{ color: payload.borderColor }}>{value}</span>;
  };

  return (
    <div className="container w-75 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-body">
              <ResponsiveContainer width="100%" height={450}>
                <PieChart>
                  <Pie
                    data={dataByCategory}
                    dataKey="value"
                    nameKey="name"
                    cornerRadius={10}
                    cx="50%"
                    cy="50%"
                    outerRadius={180}
                    innerRadius={100}
                    isAnimationActive={true}
                  >
                    {dataByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.backgroundColor}
                        stroke={entry.borderColor}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend formatter={legendFormatter} />
                  <Customized component={expensesCenterText} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewChart;
