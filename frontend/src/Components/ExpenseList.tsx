import { Expense } from "../models/expense";
import { MdDelete, MdAdd, MdEdit } from "react-icons/md";

interface Props {
  expenses: Expense[];
  onDelete: (expense: Expense) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
}

const ExpenseList = ({ expenses, onDelete, onAdd, onEdit }: Props) => {
  return (
    <>
      <div className="d-flex justify-content-center table-responsive">
        <table className="table w-75 table-bordered table-striped text-center">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>
                <MdAdd onClick={() => onAdd()} className="w-25 text-muted" />
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const date = new Date(expense.date);
              const formattedDate = `${date
                .getDate()
                .toString()
                .padStart(2, "0")}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date.getFullYear().toString().slice(2)}`;

              return (
                <tr key={expense._id}>
                  <td>{expense.description}</td>
                  <td>{expense.amount.toFixed(2)}</td>
                  <td>{expense.category}</td>
                  <td>{formattedDate}</td>
                  <td>
                    <MdDelete
                      className="text-muted w-25"
                      onClick={(e) => {
                        onDelete(expense);
                        e.stopPropagation();
                      }}
                    />
                    <MdEdit
                      className="text-muted w-25"
                      onClick={() => {
                        onAdd();
                        onEdit(expense._id);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
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
