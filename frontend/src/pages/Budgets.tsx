import * as ExpensesApi from "../network/expenses_api";
import { useState, useEffect } from "react";
import Loader from "../components/loader/Loader";
import { User } from "../models/user";
import BudgetList from "../components/budgets/BudgetList";
import BudgetForm from "../components/budgets/BudgetForm";
import "../components/budgets/Budget.css";
import { Category } from "../models/category";
import { Expense } from "../models/expense";

const Budgets = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Function to fetch logged-in user
  const fetchLoggedInUser = async () => {
    try {
      const fetchedUser = await ExpensesApi.getLoggedInUser();
      setLoggedInUser(fetchedUser);
    } catch (error) {
      console.error("Error fetching logged-in user:", error);
    }
  };

  useEffect(() => {
    async function loadCategories() {
      try {
          const categories = await ExpensesApi.fetchCategory();
          setCategories(categories);
      } catch (error) {
          console.error(error);
      }
    }

    if (loggedInUser) {
      const interval = setInterval(fetchLoggedInUser, 5000);
      loadCategories();
      return () => clearInterval(interval);
    } else {
      fetchLoggedInUser();
    }
  }, [loggedInUser]);

  useEffect(() => {
    async function loadExpenses() {
      try {
        const expenses = await ExpensesApi.fetchExpense();
        setExpenses(expenses);
      } catch (error) {
        console.error(error);
      }
    }
    loadExpenses();
  }, []);

  if (!loggedInUser) {
    return (
      <Loader />
    );
  }

  async function deleteCategory(category: Category) {
    try {
      await ExpensesApi.deleteCategory(category._id);
      setCategories(categories.filter((c) => c._id !== category._id));
    } catch (error) {
      console.error(error);
    }
  }

  function onCategorySuccess(categories: Category[]) {
    setCategories(categories);
    setShowForm(false);
  }

  return (
    <>
    <div className="d-flex flex-column">
      <BudgetList expenses={expenses} categories={categories} deleteCategory={deleteCategory} />
      <button onClick={() => setShowForm(true)} className="budget-button mt-5">
        +
      </button>
    </div>
      {showForm &&
        <BudgetForm onDismiss={() => setShowForm(false)} onCategorySuccess={onCategorySuccess} />
      }
    </>
  );
};

export default Budgets;
