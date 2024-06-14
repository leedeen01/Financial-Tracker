import { Modal } from "react-bootstrap";
import Form from "./Form";
import { Expense, categories } from "../models/expense";
import {
  createExpense,
  updateExpense,
  fetchExpense,
} from "../network/expenses_api";

interface AddEditExpenseDialogProps {
  expenseToEdit?: string;
  expenses: Expense[];
  onDismiss: () => void;
  updateExpenses: (expenses: Expense[]) => void; // Define updateExpenses prop
}
const AddEditExpenseDialog = ({
  expenseToEdit,
  expenses,
  updateExpenses,
  onDismiss,
}: AddEditExpenseDialogProps) => {
  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>
          {expenseToEdit ? "Edit Expense" : "Add Expense"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onInclude={async (item) => {
            const updatedExpenses = await createExpense(item);
            updateExpenses(updatedExpenses);
            onDismiss();
          }}
          onUpdate={async (item) => {
            const updateData = async () => {
              if (expenseToEdit) {
                await updateExpense(expenseToEdit, item);
              }
              const updatedExpenses = await fetchExpense();
              updateExpenses(updatedExpenses);
              onDismiss();
            };

            // Call the asynchronous function
            updateData();
          }}
          categories={categories}
          expenseToEdit={expenses.find(
            (expense) => expense._id === expenseToEdit
          )}
        />
      </Modal.Body>
    </Modal>
  );
};

export default AddEditExpenseDialog;
