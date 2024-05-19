import "./App.css";
import Form from "./Components/Form";
import ExpenseList from "./Components/ExpenseList";
import { useState } from "react";

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, description: "Mcdonald", amount: 10, category: "Utilities" },
    { id: 2, description: "Bread", amount: 4.6, category: "Groceries" },
    { id: 3, description: "Movie", amount: 8.8, category: "Entertainment" },
  ]);

  return (
    <>
      <Form
        expenses={expenses}
        onInclude={(item) => setExpenses([...expenses, item])}
      />
      <ExpenseList
        expenses={expenses}
        onDelete={(id) => setExpenses(expenses.filter((e) => e.id != id))}
      />
    </>
  );
}

export default App;
