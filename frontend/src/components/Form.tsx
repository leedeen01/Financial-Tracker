import { FieldValues, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { Expense } from "../models/expense";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Category {
  name: string;
  background: string;
  border: string;
}

const schema = z.object({
  description: z.string().min(1, { message: "Please fill in the description" }),
  amount: z
    .number({ invalid_type_error: "Please enter valid amount" })
    .min(0, { message: "Amount must be positive" }),
  date: z.date(),
  category: z.string().nonempty({ message: "Please choose a category" }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  expenseToEdit?: Expense;
  onInclude: (item: Expense) => void;
  onUpdate: (item: Expense) => void;
  categories: Category[];
}

const Form = ({ onInclude, onUpdate, categories, expenseToEdit }: Props) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: expenseToEdit?.description || "",
      amount: expenseToEdit?.amount || 0,
      date: expenseToEdit?.date || new Date(),
      category: expenseToEdit?.category || "",
    },
  });

  const onSubmit = (data: FieldValues) => {
    const newExpense = {
      _id: "",
      description: data.description,
      amount: data.amount,
      date: data.date,
      category: data.category,
    };

    if (expenseToEdit) {
      onUpdate(newExpense);
    } else {
      onInclude(newExpense);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            {...register("description")}
            id="description"
            type="text"
            className="form-control"
          />
          {errors.description && (
            <p className="text-danger"> {errors.description.message} </p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <input
            {...register("amount", { valueAsNumber: true })}
            id="amount"
            type="text"
            className="form-control"
          />

          {errors.amount && (
            <p className="text-danger"> {errors.amount.message} </p>
          )}
        </div>
        <label htmlFor="date" className="form-label">
          Date
        </label>
        <div className="mb-3">
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker
                placeholderText="Select date"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
              />
            )}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            {...register("category")}
            id="category"
            className="form-control"
          >
            <option value=""></option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-danger"> {errors.category.message} </p>
          )}
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </>
  );
};

export default Form;
