import { RequestHandler } from "express";
import expenseModel from "../models/expense";
import createHttpError from "http-errors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import env from "../util/validateEnv";
import { assertIsDefined } from "../util/assertIsDefined";

interface getSuggestionBody {
  prompt: string;
}

export const getSuggestion: RequestHandler<
  unknown,
  unknown,
  getSuggestionBody,
  unknown
> = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  const prompt = req.body.prompt;
  try {
    assertIsDefined(authenticatedUserId);

    const expenses = await expenseModel
      .find({ userId: authenticatedUserId })
      .exec();
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      throw new Error("API_KEY is not defined in the environment variables.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    res.json({ suggestion: text });
  } catch (error) {
    console.error("Error generating suggestion:", error);
    next(createHttpError(500, "Internal Server Error"));
  }
};
