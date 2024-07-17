import "bootstrap/dist/css/bootstrap.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { SignUpCredentials } from "../../network/expenses_api";
import FilterCategory from "./FilterCategory";
import FilterMonth from "./FilterMonth";
import FilterType from "./FilterType";
import { Category } from "../../models/category";

interface FilterProps {
  onDismiss: () => void;
  onSelectMonth: (month: string) => void;
  onSelectCategory: (category: string) => void;
  onSelectType: (type: string) => void;
  categories: Category[];
  month: string;
  category: string;
  type: string;
}

const Filter = ({
  onDismiss,
  onSelectMonth,
  onSelectCategory,
  onSelectType,
  categories,
  month,
  category,
  type,
}: FilterProps) => {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpCredentials>();

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>Filter</Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onDismiss)}>
          <FilterMonth onSelectMonth={onSelectMonth} month={month} />
          <FilterCategory
            onSelectCategory={onSelectCategory}
            categories={categories}
            category={category}
          />
          <FilterType onSelectType={onSelectType} categories={categories} type={type} /> 
          <Button type="submit" disabled={isSubmitting} className="width100">
            Close
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Filter;
