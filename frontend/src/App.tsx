import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import ExpenseList from "./Components/ExpenseList";
import ExpenseFilter from "./Components/ExpenseFilter";
import OverviewChart from "./Components/OverviewChart";
import NavList from "./Components/Nav/NavList";
import NavBar from "./Components/Nav/NavBar";
/*import GoogleOAuth from "./Components/GoogleOAuth";*/

import { useEffect, useState } from "react";
import { categories, Expense } from "./models/expense";
import * as expensesApi from "./network/expenses_api";
import AddExpenseDialog from "./Components/AddEditExpenseDialog";

function App() {
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
        {/* NavBar Section */}
        <div className="top d-flex justify-content-between">
          <NavBar onToggle={onToggle} />
          {/*<GoogleOAuth />*/}
        </div>

        {/* NavList Section */}
        <div className="row">
          {NavListToggle && <NavList />}

          <div className="col content gx-0">
            {/* Overview Chart Section */}
            <OverviewChart expenses={expenses} categories={categories} />

            {/* ExpenseForm Section */}
            {showAddDialog && (
              <AddExpenseDialog
                expenses={expenses}
                onDismiss={() => setShowAddDialog(false)}
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
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
