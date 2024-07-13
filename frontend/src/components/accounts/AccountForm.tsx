import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "../form/TextInputField";
import SelectInputField from "../form/SelectInputField";
import * as ExpensesApi from "../../network/expenses_api";
import { Account } from "../../models/account";
import Loader from "../loader/Loader";
import { useContext, useEffect, useState } from "react";
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

  const { setValue } = useForm();
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const handleSearch = async (keyword: string) => {
    try {
      const result = await ExpensesApi.fetchStockName(keyword);
      const search = result.map((stock) => stock.symbol);
      setSearchResults(search);
    } catch (error) {
      console.error('Error fetching stock names:', error);
    }
  };

  useEffect(() => {
    handleSearch(searchKeyword);
  }, [searchKeyword]);

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
                <TextInputField
                  name="stockSearch"
                  label="Search Stock"
                  type="text"
                  // value={searchKeyword} //////////////ERROR HERE///////////////////
                  register={register}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
                  error={errors.name}
                />

                <SelectInputField
                  name="name"
                  label="Stock Symbol"
                  options={searchResults}
                  register={register}
                  registerOptions={{ required: "Required" }}
                  onChange={(value) => setValue('name', value)}
                  error={errors.name}
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