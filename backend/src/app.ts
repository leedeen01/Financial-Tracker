import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import expenseModel from "./models/expense";

const app = express();

app.get("/", async (req, res, next) => {
  try {
    const expenses = await expenseModel.find().exec();
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  next(Error("Endpoint not found"));
});
//error handling function for reusability
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error();
  let errorMessage = "An unknown error occured";
  if (error instanceof Error) errorMessage = error.message;
  res.status(500).json({ error: errorMessage });
});

export default app;
