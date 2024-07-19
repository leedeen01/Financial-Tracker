import "bootstrap/dist/css/bootstrap.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { SignUpCredentials } from "../../network/expenses_api";
import FilterCategory from "./FilterCategory";
import FilterDate from "./FilterDate";
import FilterType from "./FilterType";
import { Category } from "../../models/category";

interface FilterProps {
  onDismiss: () => void;
  onSelectMonth: (month: string) => void;
  onSelectYear: (year: string) => void;
  onSelectCategory: (category: string) => void;
  onSelectType: (type: string) => void;
  categories: Category[];
  month: string;
  year: string;
  category: string;
  type: string;
}

const Filter = ({
  onDismiss,
  onSelectMonth,
  onSelectYear,
  onSelectCategory,
  onSelectType,
  categories,
  month,
  year,
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
          <FilterDate onSelectMonth={onSelectMonth} onSelectYear={onSelectYear} month={month} year={year}/>
          {type === "Expense" ? (
              <FilterCategory
                  onSelectCategory={onSelectCategory}
                  categories={categories.filter((c) => c.type === "Expense")}
                  category={category}
              />
          ) : type === "Income" ? (
              <FilterCategory
                  onSelectCategory={onSelectCategory}
                  categories={categories.filter((c) => c.type === "Income")}
                  category={category}
              />
          ) : (
            <FilterCategory
                onSelectCategory={onSelectCategory}
                categories={categories}
                category={category}
            />
          )}
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
