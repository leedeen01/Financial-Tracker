import "./App.css";
import Form from "./Components/Form";
import ExpenseList from "./Components/ExpenseList";
import { useState } from "react";
import ExpenseFilter from "./Components/ExpenseFilter";

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

  return (
    <>
      <Form
        expenses={expenses}
        onInclude={(item) => setExpenses([...expenses, item])}
      />
      <div className="mt-5 mb-3">
        <ExpenseFilter
          onSelectCategory={(category) => setSelectedCategory(category)}
        />
      </div>
      <ExpenseList
        expenses={selectedExpenses}
        onDelete={(id) => setExpenses(expenses.filter((e) => e.id != id))}
      />
    </>
  );
}

export default App;
