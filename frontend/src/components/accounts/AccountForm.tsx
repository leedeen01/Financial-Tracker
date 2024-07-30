import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "../form/TextInputField";
import SelectInputField from "../form/SelectInputField";
import * as ExpensesApi from "../../network/expenses_api";
import { Account } from "../../models/account";
import Loader from "../loader/Loader";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../App";
import { useForm } from "react-hook-form";
import { User } from "../../models/user";

interface AccountProps {
  onDismiss: () => void;
  onAccountSuccess: (accounts: Account[]) => void;
}

const AccountForm = ({ onDismiss, onAccountSuccess }: AccountProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Account>();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loading, setLoading] = useContext(Context);

  const [selectedType, setSelectedType] = useState<string>("Bank");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const fetchedUser = await ExpensesApi.getLoggedInUser();
        setLoggedInUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };
    fetchLoggedInUser();
  }, []);

  const handleSearch = async () => {
    try {
      if (searchKeyword) {
        const result = await ExpensesApi.fetchStockName(searchKeyword);
        const search = result.map((stock) => stock.symbol);
        setSelectedOption(search[0]);
        setSearchResults(search);
        setShowResults(search.length > 0);
      }
    } catch (error) {
      console.error("Error fetching stock names:", error);
    }
  };

  const onSubmit = async (account: Account) => {
    try {
      setLoading(true);
      if (account.type === "Stock") {
        account.name = selectedOption;
      }
      const accounts = await ExpensesApi.createAccount(account);
      setLoading(false);
      onAccountSuccess(accounts);
    } catch (error) {
      setLoading(false);
      alert(error);
      console.error(error);
    }
  };

  if (!loggedInUser) {
    return <Loader />;
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>Add Account</Modal.Header>
      <Modal.Body>
        {loading ? (
          <Loader />
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <SelectInputField
              name="type"
              label="Type"
              options={["Bank", "Stock"]}
              register={register}
              registerOptions={{ required: "Required" }}
              onChange={(value) => setSelectedType(value)}
              error={errors.type}
            />
            {selectedType === "Stock" ? (
              <>
                <div className="d-flex justify-content-between align-items-center">
                  <input
                    className="mb-3"
                    type="text"
                    style={{
                      width: "90%",
                      borderRadius: "10px",
                      border: "1px solid var(--lighter-grey)",
                      padding: "7px",
                    }}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search Stock"
                  />
                  <button
                    className="expenselist-button expenselist-button-add mb-3"
                    type="button"
                    onClick={handleSearch}
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
                {showResults && (
                  <>
                    <SelectInputField
                      name="Stock"
                      label="Select Stock Ticker Symbol"
                      options={searchResults}
                      register={register}
                      onChange={(value) => setSelectedOption(value)}
                      registerOptions={{ required: "Required" }}
                    />
                    <SelectInputField
                      name="currency"
                      label="Base Currency"
                      options={[
                        "SGD",
                        "USD",
                        "EUR",
                        "GBP",
                        "JPY",
                        "CNY",
                        "KRW",
                      ]}
                      register={register}
                      registerOptions={{ required: "Required" }}
                      defaultValue={loggedInUser.currency}
                    />
                    <TextInputField
                      name="amount"
                      label="Average Price"
                      type="number"
                      step="any"
                      register={register}
                      registerOptions={{ required: "Required" }}
                      error={errors.amount}
                    />
                    <TextInputField
                      name="count"
                      label="Shares Held"
                      type="number"
                      register={register}
                      error={errors.count}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <TextInputField
                  name="name"
                  label="Account Name"
                  type="text"
                  register={register}
                  registerOptions={{ required: "Required" }}
                  error={errors.name}
                />
                <SelectInputField
                  name="currency"
                  label="Base Currency"
                  options={["SGD", "USD", "EUR", "GBP", "JPY", "CNY", "KRW"]}
                  register={register}
                  registerOptions={{ required: "Required" }}
                  defaultValue={loggedInUser.currency}
                />
                <TextInputField
                  name="amount"
                  label="Balance"
                  type="number"
                  step="any"
                  register={register}
                  registerOptions={{ required: "Required" }}
                  error={errors.amount}
                />
              </>
            )}
            <Button type="submit" disabled={isSubmitting} className="width100">
              Add Account
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AccountForm;
