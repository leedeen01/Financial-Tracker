import { useContext, useState } from "react";
import * as ExpensesApi from "../../network/expenses_api";
import Loader from "../../components/loader/Loader";
import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "../../components/form/TextInputField";
import { useForm, SubmitHandler } from "react-hook-form";
import { Context } from "../../App";
import { Category, colors } from "../../models/category";
import ColorInputField from "../form/ColorInputField";
import SelectInputField from "../form/SelectInputField";

interface BudgetEditProps {
    category: Category;
    onDismiss: () => void;
    onCategoryEditSuccess: () => void;
  }

const BudgetEditForm = ({ category, onDismiss, onCategoryEditSuccess }: BudgetEditProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Category>();

  const [loading, setLoading] = useContext(Context);
  const [selectedType, setSelectedType] = useState<string>(category.type);

  const onSubmit: SubmitHandler<Category> = async (data) => {
    try {
        setLoading(true);
        await ExpensesApi.updateCategory(category._id, {
            name: data.name,
            color: data.color,
            type: data.type,
            budget: data.budget ?? 0,
            });
        setLoading(false);
        onCategoryEditSuccess();
        } catch (error) {
        alert("Error updating category.");
        console.error("Update category error:", error);
        setLoading(false);
        }
    };

  return (
    <>
    {loading ? (
        <Modal show onHide={onDismiss}>
          <Modal.Header closeButton>Edit Category</Modal.Header>

          <Modal.Body>
            <Loader />
          </Modal.Body>
        </Modal>
      ) : (
        <Modal show onHide={onDismiss}>
          <Modal.Header closeButton>Edit Category</Modal.Header>

          <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <TextInputField
                name="name"
                label="Category Name"
                type="text"
                step="any"
                register={register}
                defaultValue={category.name}
                value={category.name}
                registerOptions={{ required: "Required" }}
                error={errors.name}
              />

              <ColorInputField
                name="color"
                label="Color"
                options={colors}
                register={register}
                registerOptions={{ required: "Required" }}
                defaultValue={category.color}
                error={errors.color}
              />

              <SelectInputField
                name="type"
                label="Type"
                options={["Expense", "Income"]}
                defaultValue={category.type}
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
                  defaultValue={category.budget ? category.budget : 0}
                  register={register}
                  error={errors.budget}
                />
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="width100"
              >
                Edit Category
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default BudgetEditForm;
