import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import { assertIsDefined } from "../util/assertIsDefined";
import mongoose from "mongoose";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId)
      .select("+email")
      .exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "Parameters missing");
    }

    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();
    if (existingUsername) {
      throw createHttpError(
        409,
        "Username already taken. Please choose a different name or log in instead."
      );
    }

    const existingEmail = await UserModel.findOne({ email: email }).exec();
    if (existingEmail) {
      throw createHttpError(
        409,
        "A user with this email address already exist. Please log in instead."
      );
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwordHashed,
      friendlist: [],
    });

    req.session.userId = newUser._id;

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await UserModel.findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};

interface AddFriendParams {
  _id?: string;
}
interface AddFriendBody {
  newFriend: string;
}

//add 2 users as friends
export const acceptFriendRequest: RequestHandler<
  AddFriendParams,
  unknown,
  AddFriendBody,
  unknown
> = async (req, res, next) => {
  const _id = req.params._id;
  const newFriend = req.body.newFriend;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(_id)) {
      throw createHttpError(400, "Invalid user ID");
    }

    if (!mongoose.isValidObjectId(newFriend)) {
      throw createHttpError(400, "Invalid friend ID");
    }

    const user = await UserModel.findById(_id).exec();
    const friendUser = await UserModel.findById(newFriend).exec();

    if (!user || !friendUser) {
      throw createHttpError(404, "User not found");
    }

    if (!user._id.equals(authenticatedUserId)) {
      throw createHttpError(
        401,
        "You are not authorized to add friends for this user"
      );
    }

    //skip adding if they are already friends
    if (!user.friendlist.includes(newFriend)) {
      user.friendlist.push(newFriend);
      friendUser.friendlist.push(_id!);
    }

    //removes friend request
    user.friendRequest = user.friendRequest.filter(
      (friend) => friend !== newFriend
    );

    const updatedUser = await user.save();
    await friendUser.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error adding friend:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

//sending friend request
//if user1 send friend request to user2
//user2 will store user1 _id in its friendRequest array
//user2 will need to accept the request by calling addFriend above to add Friend

interface SendFriendRequestParams {
  _id?: string; // ID of the recipient user (to whom friend request is sent)
}

interface SendFriendRequestBody {
  friendRequest: string; // ID of the recipient user
}

export const sendFriendRquest: RequestHandler<
  SendFriendRequestParams,
  unknown,
  SendFriendRequestBody,
  unknown
> = async (req, res, next) => {
  const _id = req.params._id;
  const friendRequest = req.body.friendRequest;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(_id)) {
      throw createHttpError(400, "Invalid user ID");
    }

    if (!mongoose.isValidObjectId(friendRequest)) {
      throw createHttpError(400, "Invalid friend ID");
    }

    const user = await UserModel.findById(_id).exec();
    const friendUser = await UserModel.findById(friendRequest).exec();

    if (!user || !friendUser) {
      throw createHttpError(404, "User not found");
    }

    if (!user._id.equals(authenticatedUserId)) {
      throw createHttpError(
        401,
        "You are not authorized to add friends for this user"
      );
    }

    // Assuming friendlist is an array of strings in the UserModel schema
    if (
      !friendUser.friendRequest.includes(_id!) ||
      !friendUser.friendlist.includes(_id!)
    ) {
      friendUser.friendRequest.push(_id!);
    }
    const updatedUser = await friendUser.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error adding friend:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

interface DeleteFriendRequestParams {
  _id?: string; // ID of the recipient user (to whom friend request is sent)
}

interface DeleteFriendRequestBody {
  friendRequest: string; // ID of the recipient user
}

export const deleteFriendRquest: RequestHandler<
  DeleteFriendRequestParams,
  unknown,
  DeleteFriendRequestBody,
  unknown
> = async (req, res, next) => {
  const _id = req.params._id;
  const friendRequest = req.body.friendRequest;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(_id)) {
      throw createHttpError(400, "Invalid user ID");
    }

    if (!mongoose.isValidObjectId(friendRequest)) {
      throw createHttpError(400, "Invalid friend ID");
    }

    const user = await UserModel.findById(_id).exec();
    const friendUser = await UserModel.findById(friendRequest).exec();

    if (!user || !friendUser) {
      throw createHttpError(404, "User not found");
    }

    if (!user._id.equals(authenticatedUserId)) {
      throw createHttpError(
        401,
        "You are not authorized to add friends for this user"
      );
    }

    // Assuming friendlist is an array of strings in the UserModel schema
    //removes friend request
    user.friendRequest = user.friendRequest.filter(
      (friend) => friend !== friendRequest
    );

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error adding friend:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

interface DeleteFriendParams {
  _id?: string; // ID of the recipient user (to whom friend request is sent)
}

interface DeleteFriendBody {
  friendRequest: string; // ID of the recipient user
}

export const deleteFriend: RequestHandler<
  DeleteFriendParams,
  unknown,
  DeleteFriendBody,
  unknown
> = async (req, res, next) => {
  const _id = req.params._id;
  const friendRequest = req.body.friendRequest;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(_id)) {
      throw createHttpError(400, "Invalid user ID");
    }

    if (!mongoose.isValidObjectId(friendRequest)) {
      throw createHttpError(400, "Invalid friend ID");
    }

    const user = await UserModel.findById(_id).exec();
    const friendUser = await UserModel.findById(friendRequest).exec();

    if (!user || !friendUser) {
      throw createHttpError(404, "User not found");
    }

    if (!user._id.equals(authenticatedUserId)) {
      throw createHttpError(
        401,
        "You are not authorized to add friends for this user"
      );
    }

    // Assuming friendlist is an array of strings in the UserModel schema
    //removes friend request
    user.friendlist = user.friendlist.filter(
      (friend) => friend !== friendRequest
    );

    friendUser.friendlist = friendUser.friendlist.filter(
      (friend) => friend !== _id
    );

    const updatedUser = await user.save();
    await friendUser.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error adding friend:", error);
    next(error); // Pass the error to the error handling middleware
  }
};
