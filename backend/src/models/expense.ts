import { InferSchemaType, Schema, model } from "mongoose";

//variables to be stored in database
const expenseSchema = new Schema(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

//for defining TypeScript types that correspond to database schema structures, allowing for type safety in TypeScript code interacting with databases
type Expense = InferSchemaType<typeof expenseSchema>;

export default model<Expense>("Expense", expenseSchema);
