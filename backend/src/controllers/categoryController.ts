import { RequestHandler } from "express";
import categoryModel from "../models/category";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getCategories: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    const categories = await categoryModel
      .find({ userId: authenticatedUserId })
      .exec();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategory: RequestHandler = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    //if format of categoryID is invalid
    if (!mongoose.isValidObjectId(categoryId)) {
      throw createHttpError(400, "Invalid expenseID");
    }

    const category = await categoryModel.findById(categoryId).exec();

    //if categoryID given is invalid
    if (!category) {
      throw createHttpError(404, "Expense not found");
    }

    if (!category.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

interface createCategoryBody {
  name: string;
  color: string;
  type: string;
  budget: number;
}

export const createCategory: RequestHandler<
  unknown,
  unknown,
  createCategoryBody,
  unknown
> = async (req, res, next) => {
  const name = req.body.name;
  const color = req.body.color;
  const type = req.body.type;
  const budget = req.body.budget;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    if (!name || !color) {
      throw createHttpError(400, "Please enter all input correctly");
    }

    const newCategory = await categoryModel.create({
      userId: authenticatedUserId,
      name: name,
      color: color,
      type: type,
      budget: budget,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory: RequestHandler = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(categoryId)) {
      throw createHttpError(400, "Invalid categoryID");
    }
    const expense = await categoryModel.findById(categoryId).exec();

    if (!expense) {
      throw createHttpError(404, "Category not found");
    }

    if (!expense.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "No access");
    }

    await categoryModel.findByIdAndDelete(categoryId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
