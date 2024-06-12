import "bootstrap/dist/css/bootstrap.css";
import { IoFilter } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import ExpenseList from "../Components/ExpenseList/ExpenseList";
import OverviewChart from "../Components/OverviewChart";

import { useEffect, useState } from "react";
import AddEditExpenseDialog from "../Components/AddEditExpenseDialog";
import { Expense, categories } from "../models/expense";
import * as expensesApi from "../network/expenses_api";
import { months } from "../models/expense";
import Filter from "../Components/Filter/Filter";

function Home() {
  const [selectedExpense, setSelectedExpense] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("");

  const [showFilter, setShowFilter] = useState(false);

  const FilteredMonth = selectedMonth
    ? expenses.filter((expense) => {
        // Parse the date string into a JavaScript Date object
        const expenseDate = new Date(expense.date);
        // Get the month index (0-indexed) from the Date object
        const expenseMonth = months[expenseDate.getMonth()];
        // Compare the month abbreviation with the selected month
        return expenseMonth === selectedMonth;
      })
    : expenses;

  const selectedExpenses = selectedCategory
    ? FilteredMonth.filter((e) => e.category === selectedCategory)
    : FilteredMonth;

  useEffect(() => {
    async function loadExpenses() {
      try {
        const expenses = await expensesApi.fetchExpense();
        setExpenses(expenses);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    loadExpenses();
  }, []);

  async function deleteExpense(expense: Expense) {
    try {
      await expensesApi.deleteExpense(expense._id);
      setExpenses(expenses.filter((e) => e._id !== expense._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
  return (
    <>
      <div className="container-fluid gx-0">
        <div className="row">
          <div className="col content gx-0">
            {/* Overview Chart Section */}
            <OverviewChart expenses={FilteredMonth} categories={categories} />
            {/* ExpenseForm Section */}
            {showAddDialog && (
              <AddEditExpenseDialog
                expenses={expenses}
                onDismiss={() => {
                  setShowAddDialog(false);
                  setSelectedExpense("");
                }}
                updateExpenses={setExpenses} // Pass the updateExpenses function
              />
            )}

            <div className="row z">
              <div className="mt-5 mb-3">
                {/* ExpenseFilter Section */}
                {showFilter && (
                  <Filter
                    onDismiss={() => setShowFilter(false)}
                    onSelectMonth={(month) => setSelectedMonth(month)}
                    onSelectCategory={(category) =>
                      setSelectedCategory(category)
                    }
                    categories={categories}
                    month={selectedMonth}
                    category={selectedCategory}
                  />
                )}
                <div className="expenselist-heading-button-container">
                  <span className="expenselist-title">Transactions</span>
                  <span className="expenselist-AddFilter">
                    <button
                      className="expenselist-button"
                      onClick={() => setShowAddDialog(true)}
                    >
                      <MdAdd className="w-50" />
                      Add New
                    </button>
                    <button
                      className="expenselist-button"
                      onClick={() => setShowFilter(true)}
                    >
                      <IoFilter className="w-50" />
                      Filter
                    </button>
                  </span>
                </div>

                {/* ExpenseList Section */}
                <ExpenseList
                  expenses={selectedExpenses}
                  onDelete={(id) => deleteExpense(id)}
                  onAddEdit={() => setShowAddDialog(true)}
                  onEdit={(id) => setSelectedExpense(id)}
                />
              </div>

              {showAddDialog && (
                <AddEditExpenseDialog
                  expenseToEdit={selectedExpense}
                  expenses={expenses}
                  onDismiss={() => {
                    setShowAddDialog(false);
                    setSelectedExpense("");
                  }}
                  updateExpenses={setExpenses} // Pass the updateExpenses function
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
