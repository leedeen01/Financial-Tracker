import express from "express";
import * as UserController from "../controllers/userController";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requiresAuth, UserController.getAuthenticatedUser);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.put(
  "/acceptFriend/:_id",
  requiresAuth,
  UserController.acceptFriendRequest
);

router.put("/sendRequest/:_id", requiresAuth, UserController.sendFriendRquest);

router.put(
  "/deleteRequest/:_id",
  requiresAuth,
  UserController.deleteFriendRquest
);

router.put("/deleteFriend/:_id", requiresAuth, UserController.deleteFriend);

export default router;
