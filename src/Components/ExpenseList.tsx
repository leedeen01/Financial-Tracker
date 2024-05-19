import { useForm } from "react-hook-form";
import { useState } from "react";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

interface Props {
  expenses: Expense[];
  onDelete: (id: number) => void;
}

const ExpenseList = ({ expenses, onDelete }: Props) => {
  const { register } = useForm();

  const [category, setCategory] = useState("All");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  return (
    <>
      <div className="mb-3 mt-5">
        <select
          {...register("category")}
          onChange={handleChange}
          className="form-control"
          id="category"
        >
          <option value="All">All categories</option>
          <option value="Groceries">Groceries</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Food">Food</option>
        </select>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {expenses
            .filter((e) => e.category === category || category === "All")
            .map((expense) => (
              <tr key={expense.id}>
                <td>{expense.description}</td>
                <td>{expense.amount}</td>
                <td>{expense.category}</td>
                <td>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="btn btn-outline-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>
              $
              {expenses
                .filter((e) => e.category === category || category === "All")
                .reduce((accu, expense) => expense.amount + accu, 0)
                .toFixed(2)}
            </td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default ExpenseList;
