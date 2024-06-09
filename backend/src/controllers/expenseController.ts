import { RequestHandler } from "express";
import expenseModel from "../models/expense";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getExpenses: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    const expenses = await expenseModel
      .find({ userId: authenticatedUserId })
      .exec();
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpense: RequestHandler = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    //if format of expenseID is invalid
    if (!mongoose.isValidObjectId(expenseId)) {
      throw createHttpError(400, "Invalid expenseID");
    }

    const expense = await expenseModel.findById(expenseId).exec();

    //if epenseID given is invalid
    if (!expense) {
      throw createHttpError(404, "Expense not found");
    }

    if (!expense.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }
    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

interface createExpenseBody {
  description?: string;
  date?: Date;
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
  const date = req.body.date;
  const amount = req.body.amount;
  const category = req.body.category;
  /*const time = req.body.category;*/
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    if (!description || !amount || !category || !date) {
      throw createHttpError(400, "Please enter all input correctly");
    }
    const newExpense = await expenseModel.create({
      userId: authenticatedUserId,
      date: date,
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
  date?: Date;
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
  const newDate = req.body.date;
  const newAmount = req.body.amount;
  const newCategory = req.body.category;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(expenseId)) {
      throw createHttpError(400, "Invalid expenseID");
    }
    if (!newDescription || !newAmount || !newCategory || !newDate) {
      throw createHttpError(400, "Please enter all input correctly");
    }
    const expense = await expenseModel.findById(expenseId).exec();

    if (!expense) {
      throw createHttpError(404, "Expense not found");
    }

    if (!expense.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    expense.description = newDescription;
    expense.date = newDate;
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
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(expenseId)) {
      throw createHttpError(400, "Invalid expenseID");
    }
    const expense = await expenseModel.findById(expenseId).exec();

    if (!expense) {
      throw createHttpError(404, "Expense not found");
    }

    if (!expense.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    await expenseModel.findByIdAndDelete(expenseId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
