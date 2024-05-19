import "./App.css";
import Form from "./Components/Form";
import ExpenseList from "./Components/ExpenseList";
import { useState } from "react";

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, description: "abc", amount: 10, category: "Utilities" },
    { id: 2, description: "absc", amount: 120, category: "Utilities" },
    { id: 3, description: "abssc", amount: 10, category: "Utilities" },
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
