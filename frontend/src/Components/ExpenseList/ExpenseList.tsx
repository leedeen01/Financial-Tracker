import { Expense } from "../../models/expense";
import { MdDelete, MdAdd, MdEdit } from "react-icons/md";
import { IoFilter } from "react-icons/io5";

import "./ExpenseList.css";
interface Props {
  expenses: Expense[];
  onDelete: (expense: Expense) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onFilter: () => void;
}

const ExpenseList = ({
  expenses,
  onDelete,
  onAdd,
  onEdit,
  onFilter,
}: Props) => {
  const isSmallScreen = window.innerWidth <= 996; // Define your screen width threshold

  return (
    <>
      <div className="d-flex justify-content-center table-responsive">
        <table
          className={`table ${
            isSmallScreen ? "w-100" : "w-75"
          } table-bordered table-striped text-center`}
        >
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th className="hide-header">Category</th>
              <th className="hide-header">Date</th>
              <th>
                <MdAdd onClick={() => onAdd()} className="w-50 text-muted" />
                <IoFilter
                  onClick={() => onFilter()}
                  className="text-muted w-50"
                />
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
                <tr
                  key={expense._id}
                  onClick={(e) => {
                    onAdd();
                    onEdit(expense._id);
                    e.stopPropagation();
                  }}
                >
                  <td>{expense.description}</td>
                  <td>{expense.amount.toFixed(2)}</td>
                  <td className="hide-cell">{expense.category}</td>
                  <td className="hide-header">{formattedDate}</td>
                  <td>
                    <MdDelete
                      className="text-muted w-50"
                      onClick={(e) => {
                        onDelete(expense);
                        e.stopPropagation();
                      }}
                    />
                    <MdEdit
                      className="text-muted w-50"
                      onClick={(e) => {
                        onAdd();
                        onEdit(expense._id);
                        e.stopPropagation();
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
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default ExpenseList;
