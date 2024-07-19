import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "../form/TextInputField";
import SelectInputField from "../form/SelectInputField";
import * as ExpensesApi from "../../network/expenses_api";
import { Account } from "../../models/account";
import Loader from "../loader/Loader";
import { useContext, useState } from "react";
import { Context } from "../../App";
import { useForm } from "react-hook-form";

interface BudgetProps {
  onDismiss: () => void;
  onAccountSuccess: (accounts: Account[]) => void;
}

const BudgetForm = ({ onDismiss, onAccountSuccess }: BudgetProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Account>();

  const [loading, setLoading] = useContext(Context);

  async function onSubmit(account: Account) {
    try {
      setLoading(true);
      if (account.type === "Stock") {
        account.name = selectedOption; // Assuming you want to save it as selectedStock
      }
      const a = await ExpensesApi.createAccount(account);
      setLoading(false);
      onAccountSuccess(a);
    } catch (error) {
      setLoading(false);
      alert(error);
      console.error(error);
    }
  }

  const [selectedType, setSelectedType] = useState<string>("Bank");

  // const { setValue } = useForm();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleSearch = async () => {
    try {
      if (searchKeyword) {
        console.log(searchKeyword); // Use the parameter directly
        const result = await ExpensesApi.fetchStockName(searchKeyword);
        const search = result.map((stock) => stock.symbol);
        console.log(search);
        setSearchResults(search);
      }
    } catch (error) {
      console.error("Error fetching stock names:", error);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  return (
    <>
      {loading ? (
        <Modal show onHide={onDismiss}>
          <Modal.Header closeButton>Add Account</Modal.Header>

          <Modal.Body>
            <Loader />
          </Modal.Body>
        </Modal>
      ) : (
        <Modal show onHide={onDismiss}>
          <Modal.Header closeButton>Add Account</Modal.Header>

          <Modal.Body>
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
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search Stock"
                  />
                  <button
                    onClick={() => {
                      handleSearch();
                      setShowResults(true);
                    }}
                  >
                    Search Stock
                  </button>
                  {showResults && (
                    <div>
                      <label htmlFor="dropdown">Select an option:</label>
                      <select
                        id="dropdown"
                        value={selectedOption}
                        onChange={handleSelectChange}
                      >
                        <option value="">Select...</option>
                        {searchResults.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="width100"
              >
                Add Account
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default BudgetForm;
