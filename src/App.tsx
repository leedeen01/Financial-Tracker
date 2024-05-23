import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import Form from "./Components/Form";
import ExpenseList from "./Components/ExpenseList";
import ExpenseFilter from "./Components/ExpenseFilter";
import OverviewChart from "./Components/OverviewChart";
import NavList from "./Components/Nav/NavList";
import NavBar from "./Components/Nav/NavBar";
import GoogleOAuth from "./Components/GoogleOAuth";

import { useState } from "react";

function App() {
  const categories = [
    {name: "Food", background: "rgba(75, 192, 192, 0.2)", border: "rgba(75, 192, 192, 1)"},
    {name: "Groceries", background: "rgba(54, 162, 235, 0.2)", border: "rgba(54, 162, 235, 1)"},
    {name: "Entertainment", background: "rgba(255, 206, 86, 0.2)", border: "rgba(255, 206, 86, 1)"},
    {name: "Utilities", background: "rgba(255, 99, 132, 0.2)", border: "rgba(255, 99, 132, 1)"}
  ];

  const [expenses, setExpenses] = useState([
    { id: 1, description: "Mcdonald", amount: 10, category: "Food" },
    { id: 2, description: "Fish", amount: 4.6, category: "Groceries" },
    { id: 3, description: "Movie", amount: 7, category: "Entertainment" },
    { id: 4, description: "Phone Bill", amount: 8.8, category: "Utilities" },
    { id: 5, description: "Broccoli", amount: 5.2, category: "Groceries" },
    { id: 6, description: "Ramen", amount: 14.9, category: "Food" },
    { id: 7, description: "Club", amount: 25, category: "Entertainment" },
    { id: 8, description: "Bread", amount: 1.5, category: "Food" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const selectedExpenses = selectedCategory
    ? expenses.filter((e) => e.category === selectedCategory)
    : expenses;
  const [NavListToggle, onToggleNavList] = useState(false);

  const onToggle = () => {
    onToggleNavList(!NavListToggle);
  };

  return (
    <>
      <div className="container-fluid gx-0">
        {/* NavBar Section */}
        <div className="top d-flex justify-content-between">
          <NavBar onToggle={onToggle} />
          <GoogleOAuth />
        </div>

        {/* NavList Section */}
        <div className="row">
          {NavListToggle && <NavList />}

          <div className="col content gx-0">
            {/* Overview Chart Section */}
            <OverviewChart
              expenses={expenses}
              categories={categories}
            />

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
