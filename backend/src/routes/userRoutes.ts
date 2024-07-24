import express from "express";
import * as UserController from "../controllers/userController";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requiresAuth, UserController.getAuthenticatedUser);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.get("/searchUsername/:username", UserController.searchUsersByUsername);

router.get("/searchId/:Id", UserController.searchUsersById);

router.put(
  "/acceptFriend/:_id",

  UserController.acceptFriendRequest
);

router.put("/sendRequest/:_id", UserController.sendFriendRquest);

router.put(
  "/deleteRequest/:_id",
  requiresAuth,
  UserController.deleteFriendRquest
);

router.put("/deleteFriend/:_id", UserController.deleteFriend);

router.put("/sendExpenseRequest/:_id", UserController.sendExpenseRequest);

router.put("/acceptExpenseRequest/:_id", UserController.acceptExpenseRequest);

router.put("/declineExpenseRequest/:_id", UserController.declineExpenseRequest);

router.put("/settleExpenseRequest/:_id", UserController.settleExpenseRequest);

router.put("/updateUser/:_id", UserController.updateUser);

router.delete("/:_id", UserController.deleteUser);

router.get("/verify/:userId/:uniqueString", UserController.verifyUser);

router.get("/verified", UserController.verifiedUser);

export default router;
