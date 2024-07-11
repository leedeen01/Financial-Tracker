import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import * as ExpensesApi from "../network/expenses_api";
import { Category } from "../models/category";
import Loader from "../components/loader/Loader";
import { useContext } from "react";
import { Context } from "../App";
import { useForm } from "react-hook-form";

interface BudgetProps {
  onDismiss: () => void;
  onCategorySuccess: (categories: Category[]) => void;
}

const BudgetForm = ({ onDismiss, onCategorySuccess }: BudgetProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Category>();
  
  const [loading, setLoading] = useContext(Context);

  async function onSubmit(category: Category) {
    try {
      setLoading(true);
      const c = await ExpensesApi.createCategory(category);
      setLoading(false);
      onCategorySuccess(c);
    } catch (error) {
      setLoading(false);
      alert(error);
      console.error(error);
    }
  }

  return (
    <>
    {loading ? (
        <Modal show onHide={onDismiss}>
          <Modal.Header closeButton>Add Category</Modal.Header>

          <Modal.Body>
            <Loader />
          </Modal.Body>
        </Modal>
      ) : (
        <Modal show onHide={onDismiss}>
          <Modal.Header closeButton>Add Category</Modal.Header>

          <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <TextInputField
                name="name"
                label="Category Name"
                type="text"
                placeholder="Category Name"
                register={register}
                registerOptions={{ required: "Required" }}
                error={errors.name}
              />

              <TextInputField
                name="background"
                label="Background"
                type="text"
                placeholder="Background"
                register={register}
                registerOptions={{ required: "Required" }}
                error={errors.background}
              />

              <TextInputField
                name="border"
                label="Border"
                type="text"
                placeholder="Border"
                register={register}
                registerOptions={{ required: "Required" }}
                error={errors.border}
              />

              <TextInputField
                name="budget"
                label="Budget"
                type="number"
                placeholder="Budget"
                register={register}
                error={errors.budget}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="width100"
              >
                Add Category
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
  };
  
  export default BudgetForm;