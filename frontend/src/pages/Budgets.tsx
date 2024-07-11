import * as ExpensesApi from "../network/expenses_api";
import { useState, useEffect } from "react";
import Loader from "../components/loader/Loader";
import { User } from "../models/user";
import BudgetList from "../budgets/BudgetList";
import BudgetForm from "../budgets/BudgetForm";
import "../budgets/Budget.css";
import { Category } from "../models/category";

const Budgets = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

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
      <BudgetList categories={categories} deleteCategory={deleteCategory} />
      <button onClick={() => setShowForm(true)}>
        +
      </button>
      {showForm &&
        <BudgetForm onDismiss={() => setShowForm(false)} onCategorySuccess={onCategorySuccess} />
      }
    </>
  );
};

export default Budgets;
