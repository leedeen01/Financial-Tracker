import { useEffect, useState, useContext, useRef, ChangeEvent } from "react";
import { User, currencies } from "../models/user";
import * as ExpensesApi from "../network/expenses_api";
import Loader from "../components/loader/Loader";
import { Button, Form } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import SelectInputField from "../components/form/SelectInputField";
import { useForm, SubmitHandler } from "react-hook-form";
import { BaseCurrency } from "../App";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Expense } from "../models/expense";

const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<User>();

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [displayC, setDisplayC] = useState<string>("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [img, setImg] = useState<string>(loggedInUser?.picture || import.meta.env.VITE_DEFAULT_PIC);
  const [, setBaseC] = useContext(BaseCurrency);
  const hasSetDisplayC = useRef(false);
  const navigate = useNavigate();

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
    if (loggedInUser) {
      setImg(loggedInUser.picture)
      const interval = setInterval(fetchLoggedInUser, 5000);
      return () => clearInterval(interval);
    } else {
      fetchLoggedInUser();
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser && !hasSetDisplayC.current) {
      setDisplayC(loggedInUser.currency);
      hasSetDisplayC.current = true;
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

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File = e.target.files![0]; // Ensure it's a File object or null
    if (file) {
      convertToBase64(file).then((base64) => {
        setImg(base64);
      });
    }
  };

  // Function to convert file to Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  async function fetchCurrencyValue(currency: string, prevCurrency: string) {
    try {
      const val = await ExpensesApi.fetchCurrencies(currency, prevCurrency);
      return val;
    } catch (error) {
      console.error("Error fetching currency value:", error);
    }
  }

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      if (!loggedInUser?._id) {
        alert("User ID is not available.");
        return;
      }

      if (loggedInUser.currency !== data.currency) {
        fetchCurrencyValue(data.currency, loggedInUser.currency)
          .then((currencyValue) => {
            expenses.forEach(async (e) => {
              const updatedAmount = e.amount * currencyValue!;
              await ExpensesApi.updateExpense(e._id, {
                ...e,
                amount: updatedAmount,
              });
            });
          })
          .catch((error) => {
            console.error(
              "Error fetching currency value or updating expenses:",
              error
            );
          });
      }

      await ExpensesApi.updateUser(loggedInUser._id, {
        username: data.username,
        email: data.email,
        currency: data.currency,
        profileImage: img,
      });

      fetchLoggedInUser();
      setBaseC(data.currency);
      alert("User updated successfully!");
      navigate("/profile");
    } catch (error) {
      alert("Username taken, try again.");
      console.error("Update user error:", error);
    }
  };

  async function deleteUser() {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your profile?"
    );
    if (!isConfirmed) {
      return;
    }

    if (!loggedInUser?._id) {
      alert("User ID is not available.");
      return;
    }

    const accounts = await ExpensesApi.fetchAccount();
    const userAccounts = accounts.filter(
      (account) => account.userId === loggedInUser._id
    );
    for (const account of userAccounts) {
      await ExpensesApi.deleteAccount(account._id);
    }

    const categories = await ExpensesApi.fetchCategory();
    const userCategories = categories.filter(
      (category) => category.userId === loggedInUser._id
    );
    for (const category of userCategories) {
      await ExpensesApi.deleteCategory(category._id);
    }

    const expenses = await ExpensesApi.fetchExpense();
    const userExpenses = expenses.filter(
      (expense) => expense.userId === loggedInUser._id
    );
    for (const expense of userExpenses) {
      await ExpensesApi.deleteExpense(expense._id);
    }

    await ExpensesApi.deleteUser(loggedInUser._id);
    alert("Profile deleted successfully, redirecting to homepage...");
    navigate("/");
  }

  if (!loggedInUser) {
    return <Loader />;
  }

  return (
    <>
      <div className="container content mb-5" style={{ maxWidth: "700px" }}>
        <div className="profile-text-container d-flex flex-row justify-content-between align-items-center">
          <div className="profile-title">Profile Settings</div>
          <MdDelete
            onClick={deleteUser}
            className="expenselist-editdel"
            style={{ fill: "var(--red)", fontSize: "24px" }}
          ></MdDelete>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="username"
            label="Username"
            register={register}
            registerOptions={{ required: "Required" }}
            defaultValue={loggedInUser.username}
            error={errors.username}
          />
          <TextInputField
            name="email"
            label="Email"
            register={register}
            registerOptions={{ required: "Required" }}
            defaultValue={loggedInUser.email}
            error={errors.username}
          />
          <div className="d-flex flex-row justify-content-between align-items-center">
            <SelectInputField
              name="currency"
              label="Base Currency"
              options={["SGD", "USD", "EUR", "GBP", "JPY", "CNY", "KRW"]}
              register={register}
              registerOptions={{ required: "Required" }}
              onChange={(event) => setDisplayC(event)}
              defaultValue={loggedInUser.currency}
              error={errors.currency}
            />
            <div style={{ fontSize: "40px" }}>
              {currencies.emoji[displayC as keyof typeof currencies.emoji] ||
                "🌍"}
            </div>
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="file-upload">Profile Picture</label>
            <input
              type="file"
              name="myFile"
              id="file-upload"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFileUpload(e)
              }
            />
            {img && (
              <img className="profile-pic mb-3 mt-3 mx-auto" src={img} alt="Selected" />
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="width100">
            Save
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Profile;
