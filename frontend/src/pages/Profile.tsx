import { useEffect, useState } from "react";
import { User } from "../models/user";
import * as ExpensesApi from "../network/expenses_api";
import Loader from "../components/loader/Loader";
import { Form } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import { Account } from "../models/account";
import { useForm } from "react-hook-form";
import SelectInputField from "../components/form/SelectInputField";

const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Account>();

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [currencyVal, setCurrencyVal] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(true);

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
    async function fetchCurrencyValue(currency: string) {                        
        try {
            const val = await ExpensesApi.fetchCurrencies(currency);
            setCurrencyVal(val);
            setRefresh(false);
        } catch (error) {
            console.error("Error fetching currency value:", error);
        }
    }
    if (refresh) {
        fetchCurrencyValue("USD");
    }
  }, [refresh]);

  if (!loggedInUser) {
    return (
      <Loader />
    );
  }

  return (
    <>
    <div className="container content mb-5">
        <Form onSubmit={handleSubmit(() => {})}>
        <TextInputField
            name="name"
            label="Username"
            register={register}
            registerOptions={{ required: "Required" }}
            onChange={() => {}}
            error={errors.type}
        />
        <SelectInputField
            name="currency"
            label="Currency"
            options={["SGD", "USD"]}
            register={register}
            registerOptions={{ required: "Required" }}
            onChange={() => {}}
            error={errors.type}
        />
        </Form>
        PROFILE SETTINGS
        {currencyVal}
    </div>
    </>
  );
};

export default Profile;
