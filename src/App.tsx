import "./App.css";
import Form from "./Components/Form";
import ExpenseList from "./Components/ExpenseList";
import { useState } from "react";

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, description: "Mcdonald", amount: 10, category: "Food" },
    { id: 2, description: "Fish", amount: 4.6, category: "Groceries" },
    { id: 3, description: "Movie", amount: 8.8, category: "Entertainment" },
    { id: 4, description: "Phone Bill", amount: 8.8, category: "Utilities" },
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
