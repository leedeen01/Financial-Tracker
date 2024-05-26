import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import Form from "./Components/Form";
import ExpenseList from "./Components/ExpenseList";
import ExpenseFilter from "./Components/ExpenseFilter";
import OverviewChart from "./Components/OverviewChart";
import NavList from "./Components/Nav/NavList";
import NavBar from "./Components/Nav/NavBar";
/*import GoogleOAuth from "./Components/GoogleOAuth";*/

import { useEffect, useState } from "react";
import { Expense, mapExpenseJSONToExpense } from "./models/expense";

function App() {
  const categories = [
    {
      name: "Food",
      background: "rgba(75, 192, 192, 0.2)",
      border: "rgba(75, 192, 192, 1)",
    },
    {
      name: "Groceries",
      background: "rgba(54, 162, 235, 0.2)",
      border: "rgba(54, 162, 235, 1)",
    },
    {
      name: "Entertainment",
      background: "rgba(255, 206, 86, 0.2)",
      border: "rgba(255, 206, 86, 1)",
    },
    {
      name: "Utilities",
      background: "rgba(255, 99, 132, 0.2)",
      border: "rgba(255, 99, 132, 1)",
    },
  ];

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
        const response = await fetch("http://localhost:5000/api/expenses", {
          method: "GET",
        });
        const expensesJSON = await response.json();
        const expenses: Expense[] = mapExpenseJSONToExpense(expensesJSON);
        setExpenses(expenses);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    loadExpenses();
  }, []);

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
            <Form
              expenses={expenses}
              onInclude={(item) => setExpenses([...expenses, item])}
              categories={categories}
            />

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
                onDelete={(id) =>
                  setExpenses(expenses.filter((e) => e.id != id))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
