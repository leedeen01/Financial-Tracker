import express from "express";
import * as geminiController from "../controllers/geminiController";

const router = express.Router();

router.post("/getSuggestion", geminiController.getSuggestion);

export default router;
