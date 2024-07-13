import express from "express";
import * as accountController from "../controllers/accountController";

const router = express.Router();

router.get("/", accountController.getAccounts);
router.get("/:accountId", accountController.getAccount);
router.post("/", accountController.createAccount);
router.delete("/:accountId", accountController.deleteAccount);
export default router;