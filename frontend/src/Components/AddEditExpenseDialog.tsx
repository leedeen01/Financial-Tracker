import { Modal } from "react-bootstrap";
import Form from "./Form";
import { Expense, categories } from "../models/expense";
import { createExpense } from "../network/expenses_api";

interface AddEditExpenseDialogProps {
  expenses: Expense[];
  onDismiss: () => void;
  updateExpenses: (expenses: Expense[]) => void; // Define updateExpenses prop
}
const AddEditExpenseDialog = ({
  expenses,
  updateExpenses,
  onDismiss,
}: AddEditExpenseDialogProps) => {
  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Add Expense</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          expenses={expenses}
          onInclude={async (item) => {
            const updatedExpenses = await createExpense(item);
            updateExpenses(updatedExpenses);
            onDismiss();
          }}
          categories={categories}
        />
      </Modal.Body>
    </Modal>
  );
};

export default AddEditExpenseDialog;
