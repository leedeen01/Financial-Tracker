import { InferSchemaType, model, Schema } from "mongoose";

const userVerificationSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  uniqueString: { type: String, required: true, unique: true},
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

type UserVerification = InferSchemaType<typeof userVerificationSchema>;

export default model<UserVerification>("UserVerification", userVerificationSchema);
