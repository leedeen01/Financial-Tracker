import { Expense } from "../models/expense";
import { Category } from "../models/category";
import OverviewChart from "./OverviewChart";
import ExpenseList from "./expenselist/ExpenseList";
import { IoFilter } from "react-icons/io5";
import { MdAdd } from "react-icons/md";

interface Props {
  expenses: Expense[];
  categories: Category[];
  onDelete: (expense: Expense) => void;
  onAddEdit: () => void;
  onEdit: (id: string) => void;
  onFilter: () => void;
  selectedExpenses: Expense[];
}

const SectionTwo = ({
  expenses,
  categories,
  selectedExpenses,
  onDelete,
  onAddEdit,
  onEdit,
  onFilter,
}: Props) => {
  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-md-12">
          <div className="card h-md-100">
            <div className="card-header pb-0">
              <h6 className="mb-2 mt-2 d-flex align-items-center">
                Expenses Chart
              </h6>
            </div>

            <div className="card-body p-0">
              <OverviewChart expenses={expenses} categories={categories} />
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card h-md-100">
            <div className="card-header pb-0">
              <div className="row align-items-center">
                <div className="col">
                  <h6 className="mb-2 mt-2 d-flex align-items-center">
                    All Transactions
                  </h6>
                </div>

                <div className="col-auto d-flex gap-2">
                  <button
                    onClick={() => onAddEdit()}
                    className="expenselist-button expenselist-button-add"
                  >
                    <MdAdd />
                  </button>
                  <button
                    onClick={() => onFilter()}
                    className="expenselist-button expenselist-button-filter"
                  >
                    <IoFilter />
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              <ExpenseList
                expenses={selectedExpenses}
                onDelete={(id) => onDelete(id)}
                onAddEdit={() => onAddEdit()}
                onEdit={(id) => onEdit(id)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionTwo;
