import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import expenseRoutes from "./routes/expenseRoutes";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import cors from "cors";

const app = express();

app.use(cors());
//to get a console log message for any request
app.use(morgan("dev"));
//setup express to accept json bodies
app.use(express.json());

app.use("/api/expenses", expenseRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

//error handling function for reusability
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error();
  let errorMessage = "An unknown error occured";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
