import "./App.css";
import Form from "./Components/Form";
import ExpenseList from "./Components/ExpenseList";
import { useState } from "react";
import ExpenseFilter from "./Components/ExpenseFilter";
import { FaAlignJustify } from "react-icons/fa";

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
  const [NavBar, toggleNavBar] = useState(false);

  const toggle = () => {
    toggleNavBar(!NavBar);
  };

  return (
    <>
      <div className="container-fluid gx-0">
        <div className="top">
          <FaAlignJustify className="hamburger" onClick={toggle} />
          <div className="appName">Trackspence</div>
        </div>

        <div className="row ">
          {NavBar && (
            <div className="col-2 bg-secondary">
              <div className="NavBar">NavBar</div>
            </div>
          )}
          <div className="col content gx-0">
            <div className="piechart d-flex justify-content-center bg-success">
              piechart
            </div>
            <Form
              expenses={expenses}
              onInclude={(item) => setExpenses([...expenses, item])}
            />
            <div className="row z">
              <div className="mt-5 mb-3">
                <ExpenseFilter
                  onSelectCategory={(category) => setSelectedCategory(category)}
                />
              </div>
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
