import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Form from "./Components/Form";
import ExpenseList from "./Components/ExpenseList";
import ExpenseFilter from "./Components/ExpenseFilter";
import PieChart from "./Components/PieChart";
import NavList from "./Components/Nav/NavList";
import NavBar from "./Components/Nav/NavBar";
import GoogleOAuth from "./Components/GoogleOAuth";

import { useState } from "react";

export const categories = ["Food", "Groceries", "Entertainment", "Utilities"];

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, description: "Mcdonald", amount: 10, category: "Food" },
    { id: 2, description: "Fish", amount: 4.6, category: "Groceries" },
    { id: 3, description: "Movie", amount: 8.8, category: "Entertainment" },
    { id: 4, description: "Phone Bill", amount: 8.8, category: "Utilities" },
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
            {/* PieChart Section */}
            <PieChart />

            {/* ExpenseForm Section */}
            <Form
              expenses={expenses}
              onInclude={(item) => setExpenses([...expenses, item])}
            />

            <div className="row z">
              <div className="mt-5 mb-3">
                {/* ExpenseFilter Section */}
                <ExpenseFilter
                  onSelectCategory={(category) => setSelectedCategory(category)}
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
