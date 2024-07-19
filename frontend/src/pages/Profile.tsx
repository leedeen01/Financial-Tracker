import { useEffect, useState, useContext, useRef } from "react";
import { User, currencies } from "../models/user";
import * as ExpensesApi from "../network/expenses_api";
import Loader from "../components/loader/Loader";
import { Button, Form } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import ImageInputField from "../components/form/ImageInputField";
import SelectInputField from "../components/form/SelectInputField";
import { useForm, SubmitHandler } from "react-hook-form";
import { BaseCurrency } from "../App";
import { MdDelete } from "react-icons/md";

const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<User>();

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [displayC, setDisplayC] = useState<string>("");
  const [, setCurrencyVal] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [baseC, setBaseC] = useContext(BaseCurrency);
  const hasSetDisplayC = useRef(false);

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
    async function fetchCurrencyValue(currency: string) {                        
        try {
            const val = await ExpensesApi.fetchCurrencies(currency);
            setCurrencyVal(val);
            setRefresh(false);
        } catch (error) {
            console.error("Error fetching currency value:", error);
        }
    }
    if (!refresh) {
        fetchCurrencyValue(baseC);
    }
  }, [refresh]);

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      if (!loggedInUser?._id) {
        alert("User ID is not available.");
        return;
      }

      await ExpensesApi.updateUser(loggedInUser._id, {
        username: data.username,
        email: data.email,
        currency: data.currency,
      });

      fetchLoggedInUser();
      setBaseC(data.currency);
      alert("User updated successfully!");
      window.location.reload();
    } catch (error) {
      alert("Username taken, try again.");
      console.error("Update user error:", error);
    }
  };

  async function deleteUser() {
    const isConfirmed = window.confirm("Are you sure you want to delete your profile?");
    if (!isConfirmed) {
      return;
    }

    if (!loggedInUser?._id) {
        alert("User ID is not available.");
        return;
    }
    
    const accounts = await ExpensesApi.fetchAccount();
    const userAccounts = accounts.filter(account => account.userId === loggedInUser._id);
    for (const account of userAccounts) {
      await ExpensesApi.deleteAccount(account._id);
    }

    const categories = await ExpensesApi.fetchCategory();
    const userCategories = categories.filter(category => category.userId === loggedInUser._id);
    for (const category of userCategories) {
      await ExpensesApi.deleteCategory(category._id);
    }

    const expenses = await ExpensesApi.fetchExpense();
    const userExpenses = expenses.filter(expense => expense.userId === loggedInUser._id);
    for (const expense of userExpenses) {
      await ExpensesApi.deleteExpense(expense._id);
    }

    await ExpensesApi.deleteUser(loggedInUser._id);
    alert("Profile deleted successfully, redirecting to homepage...");
    window.location.reload();
  }

  if (!loggedInUser) {
    return (
      <Loader />
    );
  }

  return (
    <>
    <div className="container content mb-5" style={{maxWidth: "700px"}}>
        <div className="profile-text-container d-flex flex-row justify-content-between align-items-center">
            <div className="profile-title">Profile Settings</div>
            <MdDelete onClick={deleteUser} className="expenselist-editdel" style={{fill: "var(--red)", fontSize: "24px"}}></MdDelete>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
            name="username"
            label="Username"
            register={register}
            registerOptions={{ required: "Required" }}
            onChange={() => {}}
            defaultValue={loggedInUser.username}
            error={errors.username}
        />
        <TextInputField
            name="email"
            label="Email"
            register={register}
            registerOptions={{ required: "Required" }}
            onChange={() => {}}
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
            <div style={{fontSize: "40px"}}>{currencies.emoji[displayC as keyof typeof currencies.emoji] || "🌍"}</div>
        </div>
        <ImageInputField
            name="picture"
            label="Profile Picture"
            register={register}
            registerOptions={{}}
            error={errors.picture}
        />
        <Button
            type="submit"
            disabled={isSubmitting}
            className="width100"
        >
            Save
        </Button>
        </Form>
    </div>
    </>
  );
};

export default Profile;
