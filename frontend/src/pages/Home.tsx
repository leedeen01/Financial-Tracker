import "bootstrap/dist/css/bootstrap.css";

import ExpenseFilter from "../Components/ExpenseFilter";
import ExpenseList from "../Components/ExpenseList";
import OverviewChart from "../Components/OverviewChart";
import NavList from "../Components/Nav/NavList";

import { useEffect, useState } from "react";
import AddEditExpenseDialog from "../Components/AddEditExpenseDialog";
import { Expense, categories } from "../models/expense";
import * as expensesApi from "../network/expenses_api";

function Home() {
  const [selectedExpense, setSelectedExpense] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const selectedExpenses = selectedCategory
    ? expenses.filter((e) => e.category === selectedCategory)
    : expenses;

  const [NavListToggle, onToggleNavList] = useState(false);

  const onToggle = () => {
    onToggleNavList(!NavListToggle);
  };

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
        {/* NavList Section */}
        <div className="row">
          {NavListToggle && <NavList />}

          <div className="col content gx-0">
            {/* Overview Chart Section */}
            <OverviewChart expenses={expenses} categories={categories} />

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
                <ExpenseFilter
                  onSelectCategory={(category) => setSelectedCategory(category)}
                  categories={categories}
                />
              </div>

              {/* ExpenseList Section */}
              <ExpenseList
                expenses={selectedExpenses}
                onDelete={(id) => deleteExpense(id)}
                onAdd={() => setShowAddDialog(true)}
                onEdit={(id) => setSelectedExpense(id)}
              />
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
