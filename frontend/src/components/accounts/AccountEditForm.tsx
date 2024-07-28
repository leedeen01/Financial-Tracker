import { useContext } from "react";
import * as ExpensesApi from "../../network/expenses_api";
import Loader from "../../components/loader/Loader";
import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "../../components/form/TextInputField";
import { useForm, SubmitHandler } from "react-hook-form";
import { Account } from "../../models/account";
import { Context } from "../../App";

interface AccountEditProps {
    account: Account;
    onDismiss: () => void;
    onAccountEditSuccess: () => void;
  }

const AccountEditForm = ({ account, onDismiss, onAccountEditSuccess }: AccountEditProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Account>();

  const [loading, setLoading] = useContext(Context);

  const onSubmit: SubmitHandler<Account> = async (data) => {
    try {
        setLoading(true);
        await ExpensesApi.updateAccount(account._id, {
            name: data.name,
            amount: data.amount,
            count: data.count ?? 1,
            });
        setLoading(false);
        onAccountEditSuccess();
        } catch (error) {
        alert("Error updating account.");
        console.error("Update account error:", error);
        setLoading(false);
        }
  };

  return (
    <>
    {loading ? (
        <Modal show onHide={onDismiss}>
          <Modal.Header closeButton>Edit Account</Modal.Header>

          <Modal.Body>
            <Loader />
          </Modal.Body>
        </Modal>
      ) : (
        <Modal show onHide={onDismiss}>
          <Modal.Header closeButton>Edit Account</Modal.Header>

          <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {account.type === "Stock" ? (
                <>
                  <TextInputField
                    name="name"
                    label="Name"
                    type="text"
                    step="any"
                    register={register}
                    defaultValue={account.name}
                    value={account.name}
                    registerOptions={{ required: "Required" }}
                    error={errors.name}
                    readOnly
                    className="readonly-input"
                  />
                  <TextInputField
                    name="amount"
                    label="Average Price"
                    type="number"
                    step="any"
                    register={register}
                    defaultValue={account.amount}
                    registerOptions={{ required: "Required" }}
                    error={errors.amount}
                  />

                  <TextInputField
                    name="count"
                    label="Shares Held"
                    type="number"
                    defaultValue={account.count}
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
                    defaultValue={account.name}
                    register={register}
                    registerOptions={{ required: "Required" }}
                    error={errors.name}
                  />

                  <TextInputField
                    name="amount"
                    label="Balance"
                    type="number"
                    step="any"
                    defaultValue={account.amount}
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
                Edit Account
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default AccountEditForm;
