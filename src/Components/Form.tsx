import "bootstrap/dist/css/bootstrap.css";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";

const schema = z.object({
  description: z.string().min(1, { message: "Please fill in the description" }),
  amount: z
    .number({ invalid_type_error: "Please enter valid amount" })
    .min(0, { message: "Amount must be positive" }),
  category: z.string().nonempty({ message: "Please choose a category" }),
});

type FormData = z.infer<typeof schema>;

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FieldValues) => {
    const formDataObject = {
      description: data.description,
      amount: data.amount,
      category: data.category,
    };
    console.log(data);
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
            <option value="Groceries">Groceries</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
          </select>
          {errors.category && (
            <p className="text-danger"> {errors.category.message} </p>
          )}
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>

      <div className="mb-3 mt-5">
        <select className="form-control" id="dropdown">
          <option value="N/A">All categories</option>
          <option value="">Groceries</option>
          <option value="">Utilities</option>
          <option value="">Entertainment</option>
        </select>
      </div>
    </>
  );
};

export default Form;
