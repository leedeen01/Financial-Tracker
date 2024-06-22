import "bootstrap/dist/css/bootstrap.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import TextInputField from "../form/TextInputField";
import { User } from "../../models/user";
import { Expense } from "../../models/expense";

interface SplitExpense {
  user: User;
  expense: Expense;
}

interface SplitBillProps {
  onDismiss: () => void;
  loggedInUser: User;
  userToSplit: User[];
}

const SplitBill = ({
  onDismiss,
  loggedInUser,
  userToSplit,
}: SplitBillProps) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SplitExpense[]>();

  async function onSubmit() {
    try {
    } catch (error) {
      alert(error);
      console.error(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>Bill</Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="description"
            label="description"
            type="text"
            placeholder="description"
            register={register}
          />
          <TextInputField
            name="category"
            label="category"
            type="text"
            placeholder="category"
            register={register}
          />
          {userToSplit.map((user) => (
            <TextInputField
              key={user._id}
              name="amount"
              label={`${user.username} to pay`}
              type="number"
              placeholder="amount"
              register={register}
            />
          ))}

          <Button type="submit" disabled={isSubmitting} className="width100">
            Split Bill
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SplitBill;
