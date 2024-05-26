import express from "express";
import * as expenseController from "../controllers/expenseController";

const router = express.Router();

router.get("/", expenseController.getExpenses);
router.get("/:expenseId", expenseController.getExpense);
router.post("/", expenseController.createExpense);
router.put("/:expenseId", expenseController.updateExpense);
router.delete("/:expenseId", expenseController.deleteExpense);
export default router;
