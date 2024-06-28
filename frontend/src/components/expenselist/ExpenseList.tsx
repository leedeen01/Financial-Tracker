import { Expense } from "../../models/expense";
import { MdDelete, MdEdit } from "react-icons/md";

import "./ExpenseList.css";
import { useState } from "react";
interface Props {
  expenses: Expense[];
  onDelete: (expense: Expense) => void;
  onAddEdit: () => void;
  onEdit: (id: string) => void;
}

const ExpenseList = ({ expenses, onDelete, onAddEdit, onEdit }: Props) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Expense | null;
    direction: string;
  }>({ key: "date", direction: "desc" });

  const sortedExpenses = expenses.sort((a, b) => {
    if (sortConfig.key === null) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    } else if (sortConfig.key === "date") {
      const dateA = new Date(aValue as string | number | Date);
      const dateB = new Date(bValue as string | number | Date);
      return sortConfig.direction === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }
    return 0;
  });

  const handleSort = (key: any) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <div className="d-flex justify-content-center table-responsive">
        <table className="table table-bordered table-striped text-center">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("description")}
                className="expenselist-heading"
              >
                Description
                {sortConfig.key === "description" &&
                  (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
              </th>
              <th
                onClick={() => handleSort("amount")}
                className="expenselist-heading"
              >
                Amount
                {sortConfig.key === "amount" &&
                  (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
              </th>
              <th
                onClick={() => handleSort("category")}
                className="expenselist-heading hide-header"
              >
                Category
                {sortConfig.key === "category" &&
                  (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
              </th>
              <th
                onClick={() => handleSort("date")}
                className="expenselist-heading hide-header"
              >
                Date
                {sortConfig.key === "date" &&
                  (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map((expense) => {
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
                    onAddEdit();
                    onEdit(expense._id);
                    e.stopPropagation();
                  }}
                >
                  <td>{expense.description}</td>
                  <td>{expense.amount.toFixed(2)}</td>
                  <td className="hide-cell">{expense.category}</td>
                  <td className="hide-header">{formattedDate}</td>
                  <td>
                    <div className="expenselist-button-container gap-2">
                      <MdDelete
                        className="text-muted expenselist-editdel"
                        onClick={(e) => {
                          onDelete(expense);
                          e.stopPropagation();
                        }}
                      />
                      <MdEdit
                        className="text-muted expenselist-editdel"
                        onClick={(e) => {
                          onAddEdit();
                          onEdit(expense._id);
                          e.stopPropagation();
                        }}
                      />
                    </div>
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
