import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Expense } from "../models/expense";

ChartJS.register(ArcElement, Tooltip, Legend);

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
    return expenses
      .filter((expense) => expense.category === category.name)
      .reduce((sum, expense) => sum + expense.amount, 0);
  });

  const data = {
    labels: categories.map((category) => category.name),
    datasets: [
      {
        label: "Total Spent",
        data: dataByCategory,
        backgroundColor: categories.map((category) => category.background),
        borderColor: categories.map((category) => category.border),
        borderWidth: 1,
      },
    ],
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-body">
              <Doughnut data={data} />
            </div>
            <h1>Expenses: ${totalExpenses.toFixed(2)}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewChart;
