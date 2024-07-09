import express from "express";
import * as geminiController from "../controllers/geminiController";

const router = express.Router();

router.get("/getSuggestion", geminiController.getSuggestion);

export default router;
