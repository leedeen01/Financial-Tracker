import { InferSchemaType, model, Schema } from "mongoose";
import expense from "./expense";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, select: false },
  password: { type: String, required: true, select: false },
  friendlist: { type: [String], required: true },
  friendRequest: { type: [String], required: true },
  topay: { type: [], required: true },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
