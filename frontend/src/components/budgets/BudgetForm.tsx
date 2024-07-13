import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "../form/TextInputField";
import SelectInputField from "../form/SelectInputField";
import ColorInputField from "../form/ColorInputField";
import * as ExpensesApi from "../../network/expenses_api";
import { Category, colors } from "../../models/category";
import Loader from "../loader/Loader";
import { useContext, useState } from "react";
import { Context } from "../../App";
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

  const [defaultColor] = useState(() => colors[Math.floor(Math.random() * colors.length)]);

  const [selectedType, setSelectedType] = useState<string>("Expense");

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
                register={register}
                registerOptions={{ required: "Required" }}
                error={errors.name}
              />

              <ColorInputField
                name="color"
                label="Color"
                options={colors}
                register={register}
                registerOptions={{ required: "Required" }}
                defaultValue={defaultColor}
                error={errors.color}
              />

              <SelectInputField
                name="type"
                label="Type"
                options={["Expense", "Income"]}
                register={register}
                registerOptions={{ required: "Required" }}
                onChange={(value) => setSelectedType(value)}
                error={errors.type}
              />

              {selectedType === "Expense" && (
                <TextInputField
                  name="budget"
                  label="Budget"
                  type="number"
                  step="any"
                  placeholder="Optional"
                  register={register}
                  error={errors.budget}
                />
              )}

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