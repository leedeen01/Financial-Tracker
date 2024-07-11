import { InferSchemaType, Schema, model } from "mongoose";

//variables to be stored in database
const categorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    background: { type: String, required: true },
    border: { type: String, required: true },
    budget: { type: Number, required: false },
  },
  { timestamps: true }
);

//for defining TypeScript types that correspond to database schema structures, allowing for type safety in TypeScript code interacting with databases
type Category = InferSchemaType<typeof categorySchema>;

export default model<Category>("Category", categorySchema);
