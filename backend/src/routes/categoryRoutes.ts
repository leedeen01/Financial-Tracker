import express from "express";
import * as categoryController from "../controllers/categoryController";

const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/:categoryId", categoryController.getCategory);
router.post("/", categoryController.createCategory);
router.put("/:categoryId", categoryController.updateCategory);
router.delete("/:categoryId", categoryController.deleteCategory);
export default router;