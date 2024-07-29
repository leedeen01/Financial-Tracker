import { RequestHandler } from "express";
import accountModel from "../models/account";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getAccounts: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    const categories = await accountModel
      .find({ userId: authenticatedUserId })
      .exec();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const getAccount: RequestHandler = async (req, res, next) => {
  const accountId = req.params.accountId;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    //if format of accountID is invalid
    if (!mongoose.isValidObjectId(accountId)) {
      throw createHttpError(400, "Invalid expenseID");
    }

    const account = await accountModel.findById(accountId).exec();

    //if accountID given is invalid
    if (!account) {
      throw createHttpError(404, "Account not found");
    }

    if (!account.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "No access");
    }
    res.status(200).json(account);
  } catch (error) {
    next(error);
  }
};

interface createAccountBody {
  name: string;
  amount: number;
  type: string;
  count: number;
}

export const createAccount: RequestHandler<
  unknown,
  unknown,
  createAccountBody,
  unknown
> = async (req, res, next) => {
  const name = req.body.name;
  const amount = req.body.amount;
  const type = req.body.type;
  const count = req.body.count;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    if (!name || !amount || !type) {
      throw createHttpError(400, "Please enter all input correctly");
    }

    const regex = new RegExp(name, "i"); // Case-insensitive search regex
    const sameAccountArray = await accountModel
      .find({ name: { $regex: regex }, userId: authenticatedUserId })
      .exec();
    if (sameAccountArray.length > 0) {
      const sameAccount = sameAccountArray[0];
      if (type === "Stock") {
        sameAccount.amount =
          (sameAccount.amount * sameAccount.count! +
            Number(amount) * Number(count)) /
          (sameAccount.count! + Number(count));
        sameAccount.count = sameAccount.count! + Number(count);
      } else {
        sameAccount.amount = sameAccount.amount + Number(amount);
      }
      const updatedAccount = await sameAccount.save();
      res.status(200).json(updatedAccount);
    } else {
      const newAccount = await accountModel.create({
        userId: authenticatedUserId,
        name: name,
        amount: amount,
        type: type,
        count: count,
      });

      res.status(201).json(newAccount);
    }
  } catch (error) {
    next(error);
  }
};

interface updateAccountParams {
  accountId: string;
}

interface updateAccountBody {
  name?: string;
  amount?: number;
  count?: number;
}

export const updateAccount: RequestHandler<
  updateAccountParams,
  unknown,
  updateAccountBody,
  unknown
> = async (req, res, next) => {
  const accountId = req.params.accountId;
  const newName = req.body.name;
  const newAmount = req.body.amount;
  const newCount = req.body.count ?? 1;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(accountId)) {
      throw createHttpError(400, "Invalid accountID");
    }
    if (!newName || !newAmount) {
      throw createHttpError(400, "Please enter all input correctly");
    }
    const account = await accountModel.findById(accountId).exec();

    if (!account) {
      throw createHttpError(404, "Account not found");
    }

    if (!account.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "No access");
    }

    account.name = newName;
    account.amount = newAmount;
    account.count = newCount;

    const updatedAccount = await account.save();

    res.status(200).json(updatedAccount);
  } catch (error) {
    next(error);
  }
};

export const deleteAccount: RequestHandler = async (req, res, next) => {
  const accountId = req.params.accountId;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(accountId)) {
      throw createHttpError(400, "Invalid accountID");
    }
    const account = await accountModel.findById(accountId).exec();

    if (!account) {
      throw createHttpError(404, "Account not found");
    }

    if (!account.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "No access");
    }

    await accountModel.findByIdAndDelete(accountId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
