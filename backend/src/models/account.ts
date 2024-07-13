import { InferSchemaType, Schema, model } from "mongoose";

//variables to be stored in database
const accountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    count: { type: Number, required: false },
  },
  { timestamps: true }
);

//for defining TypeScript types that correspond to database schema structures, allowing for type safety in TypeScript code interacting with databases
type Account = InferSchemaType<typeof accountSchema>;

export default model<Account>("Account", accountSchema);
