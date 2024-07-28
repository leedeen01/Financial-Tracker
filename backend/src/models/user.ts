import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true,  select: false},
  password: { type: String, required: true, select: false },
  friendlist: { type: [String], required: true },
  friendRequest: { type: [String], required: true },
  topay: { type: [], required: true },
  picture: { type: String, required: false },
  currency: { type: String, required: true },
  verified: { type: Boolean, required: true },
  createdAt: { type: Date, required: true },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
