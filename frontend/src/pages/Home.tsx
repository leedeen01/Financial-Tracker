import "bootstrap/dist/css/bootstrap.css";
import SectionOne from "../components/SectionOne";
import SectionTwo from "../components/SectionTwo";

import { useEffect, useState } from "react";
import AddEditExpenseDialog from "../components/AddEditExpenseDialog";
import { Expense, categories } from "../models/expense";
import * as expensesApi from "../network/expenses_api";
import { months } from "../models/expense";
import Filter from "../components/filter/Filter";
import Loader from "../components/loader/Loader";

function Home() {
  const [selectedExpense, setSelectedExpense] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("");

  const [showFilter, setShowFilter] = useState(false);

  const [loading, setLoading] = useState(false);

  const FilteredMonth = selectedMonth
    ? expenses.filter((expense) => {
        // Parse the date string into a JavaScript Date object
        const expenseDate = new Date(expense.date);
        // Get the month index (0-indexed) from the Date object
        const expenseMonth = months[expenseDate.getMonth()];
        // Compare the month abbreviation with the selected month
        return expenseMonth === selectedMonth;
      })
    : expenses;

  const selectedExpenses = selectedCategory
    ? FilteredMonth.filter((e) => e.category === selectedCategory)
    : FilteredMonth;

  useEffect(() => {
    async function loadExpenses() {
      try {
        const expenses = await expensesApi.fetchExpense();
        setExpenses(expenses);
      } catch (error) {
        setLoading(true);
        console.error(error);
      }
    }
    loadExpenses();
  }, []);

  async function deleteExpense(expense: Expense) {
    try {
      await expensesApi.deleteExpense(expense._id);
      setExpenses(expenses.filter((e) => e._id !== expense._id));
    } catch (error) {
      setLoading(true);
      console.error(error);
    }
  }
  return (
    <>
      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div className="container content">
          <div className="row">
            <SectionOne expenses={expenses} />
            <SectionTwo
              expenses={FilteredMonth}
              categories={categories}
              selectedExpenses={selectedExpenses}
              onDelete={(id) => deleteExpense(id)}
              onAddEdit={() => setShowAddDialog(true)}
              onEdit={(id) => setSelectedExpense(id)}
              onFilter={() => setShowFilter(true)}
            />
          </div>

          {showAddDialog && (
            <AddEditExpenseDialog
              expenseToEdit={selectedExpense}
              expenses={expenses}
              onDismiss={() => {
                setShowAddDialog(false);
                setSelectedExpense("");
              }}
              updateExpenses={setExpenses}
            />
          )}

          {showFilter && (
            <Filter
              onDismiss={() => setShowFilter(false)}
              onSelectMonth={(month) => setSelectedMonth(month)}
              onSelectCategory={(category) => setSelectedCategory(category)}
              categories={categories}
              month={selectedMonth}
              category={selectedCategory}
            />
          )}
        </div>
      )} 
    </>
  );
}

export default Home;
