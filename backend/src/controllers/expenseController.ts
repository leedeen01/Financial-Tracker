import { RequestHandler } from "express";
import expenseModel from "../models/expense";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getExpenses: RequestHandler = async (req, res, next) => {
  try {
    const expenses = await expenseModel.find().exec();
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpense: RequestHandler = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  try {
    //if format of expenseID is invalid
    if (!mongoose.isValidObjectId(expenseId)) {
      throw createHttpError(400, "Invalid expenseID");
    }

    const expense = await expenseModel.findById(expenseId).exec();

    //if epenseID given is invalid
    if (!expense) {
      throw createHttpError(404, "Expense not found");
    }
    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

interface createExpenseBody {
  description?: string;
  amount?: number;
  category?: string;
}

export const createExpense: RequestHandler<
  unknown,
  unknown,
  createExpenseBody,
  unknown
> = async (req, res, next) => {
  const description = req.body.description;
  const amount = req.body.amount;
  const category = req.body.category;
  /*const time = req.body.category;*/

  try {
    if (!description || !amount || !category) {
      throw createHttpError(400, "Please enter all input correctly");
    }
    const newExpense = await expenseModel.create({
      description: description,
      amount: amount,
      category: category,
      /*time: time,*/
    });

    res.status(201).json(newExpense);
  } catch (error) {
    next(error);
  }
};

interface updateExpenseParams {
  expenseId: string;
}

interface updateExpenseBody {
  description?: string;
  amount?: number;
  category?: string;
}

export const updateExpense: RequestHandler<
  updateExpenseParams,
  unknown,
  updateExpenseBody,
  unknown
> = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const newDescription = req.body.description;
  const newAmount = req.body.amount;
  const newCategory = req.body.category;

  try {
    if (!mongoose.isValidObjectId(expenseId)) {
      throw createHttpError(400, "Invalid expenseID");
    }
    if (!newDescription || !newAmount || !newCategory) {
      throw createHttpError(400, "Please enter all input correctly");
    }
    const expense = await expenseModel.findById(expenseId).exec();

    if (!expense) {
      throw createHttpError(404, "Expense not found");
    }
    expense.description = newDescription;
    expense.amount = newAmount;
    expense.category = newCategory;

    const updatedExpense = await expense.save();

    res.status(200).json(updatedExpense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense: RequestHandler = async (req, res, next) => {
  const expenseId = req.params.expenseId;

  try {
    if (!mongoose.isValidObjectId(expenseId)) {
      throw createHttpError(400, "Invalid expenseID");
    }
    const expense = await expenseModel.findById(expenseId).exec();

    if (!expense) {
      throw createHttpError(404, "Expense not found");
    }

    await expenseModel.findByIdAndDelete(expenseId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
