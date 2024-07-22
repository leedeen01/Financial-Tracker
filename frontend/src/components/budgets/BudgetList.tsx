import { MdDelete, MdEdit } from "react-icons/md";
import { Category } from "../../models/category";
import { Expense } from "../../models/expense";
import { ProgressBar } from "react-bootstrap";
import { currencies } from "../../models/user";
import { BaseCurrency } from "../../App";
import { useContext, useState } from "react";
import BudgetEditForm from "./BudgetEditForm";

interface BudgetListProps {
  expenses: Expense[];
  categories: Category[];
  deleteCategory: (category: Category) => void;
}

const BudgetList = ({
  expenses,
  categories,
  deleteCategory,
}: BudgetListProps) => {
  const [baseC] = useContext(BaseCurrency);
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category>();

  const rgba = (color: string, alpha: number) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  function totalExpensesPerCategory(category: Category) {
    return expenses
    .filter((expense) => category.name === expense.category)
    .reduce((acc, expense) => acc + expense.amount, 0);
  }

  function budgetPercentage(category: Category) {
    const totalExpenses = expenses
      .filter((expense) => category.name === expense.category)
      .reduce((acc, expense) => acc + expense.amount, 0);
    if (category.budget) {
      return (totalExpenses / category.budget) * 100;
    } else {
      return -1;
    }
  }

  function getProgressBarVariant(percentage: number) {
    if (percentage < 50) {
      return "success";
    } else if (percentage < 100) {
      return "warning";
    } else {
      return "danger";
    }
  }

  function onEdit(category: Category) {
    setEditCategory(category);
    setShowForm(true);
}

  return (
    <>
      <div className="row g-3 mt-5" onClick={() => {}}>
        <div className="row mx-auto col-md-12 gap-3 d-flex align-items-center justify-content-center">
          {categories.map((category) => {
            return (
              <div key={category._id} className="col-md-3 col-sm-5">
                <div className="card h-md-100">
                  <div
                    className="card-header pb-0 d-flex align-items-center justify-content-between"
                    style={{ backgroundColor: rgba(category.color, 0.5) }}
                  >
                    <h6 className="mb-2 mt-2">{category.name}</h6>
                    <div className="expenselist-button-container gap-2">
                      <MdEdit
                          className="text-muted expenselist-editdel"
                          onClick={(e) => {
                              e.stopPropagation();
                              onEdit(category);
                          }}
                      />
                      <MdDelete
                        onClick={() => deleteCategory(category)}
                        className="expenselist-editdel"
                      />
                    </div>
                  </div>

                  <div className="card-body d-flex flex-column justify-content-center">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      Budget:{" "}
                      {category.budget
                        ? `${currencies.symbol[baseC as keyof typeof currencies.symbol] || "$"}${category.budget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : "NA"}
                    </div>
                      <div>Type: {category.type}</div>
                    </div>
                    <div>
                      {budgetPercentage(category) != -1 ? (
                        <ProgressBar
                          now={budgetPercentage(category)}
                          label={`${budgetPercentage(category).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`}
                          variant={getProgressBarVariant(
                            budgetPercentage(category)
                          )}
                        ></ProgressBar>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="mx-auto mt-3">
                      {budgetPercentage(category) != -1 ? (
                        `Spent: ${currencies.symbol[baseC as keyof typeof currencies.symbol] || "$"}${totalExpensesPerCategory(category).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      ) : (
                        <div className="mt-3">___________________</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {editCategory && showForm &&
        <BudgetEditForm category={editCategory} onDismiss={() => setShowForm(false)} onCategoryEditSuccess={() => setShowForm(false)} />
      }
    </>
  );
};

export default BudgetList;
