import { Expense } from "../models/expense";
import { MdDelete, MdAdd, MdEdit } from "react-icons/md";

interface Props {
  expenses: Expense[];
  onDelete: (expense: Expense) => void;
  onAdd: () => void;
}

const ExpenseList = ({ expenses, onDelete, onAdd }: Props) => {
  return (
    <>
      <div className="d-flex justify-content-center table-responsive">
        <table className="table w-75 table-bordered table-striped text-center">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Category</th>
              <th>
                <MdAdd onClick={() => onAdd()} className="w-25 text-muted" />
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.description}</td>
                <td>{expense.amount.toFixed(2)}</td>
                <td>{expense.category}</td>
                <td>
                  <MdDelete
                    className="text-muted w-25"
                    onClick={(e) => {
                      onDelete(expense);
                      e.stopPropagation();
                    }}
                  />
                  <MdEdit className="text-muted w-25" />
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
                  .reduce((accu, expense) => expense.amount + accu, 0)
                  .toFixed(2)}
              </td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default ExpenseList;
