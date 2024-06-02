//this file makes sure that the values here are declared, if not the server will crash
import { cleanEnv } from "envalid";
import { str } from "envalid";

export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING: str(),
  SESSION_SECRET: str(),
});
