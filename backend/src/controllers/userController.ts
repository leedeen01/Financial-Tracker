import { RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import ExpenseModel from "../models/expense";
import AccountModel from "../models/account";
import CategoryModel from "../models/category";
import VerificationModel from "../models/userVerification";
import expenseModel from "../models/expense";
import bcrypt from "bcrypt";
import { assertIsDefined } from "../util/assertIsDefined";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

//const website = "http://localhost:6969";
const website = "https://financial-tracker-mtpk.onrender.com";

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "Mailgun",
  host: "smtp.mailgun.org",
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS,
  },
});

interface UserVerify {
  _id: string;
  email: string;
}

const sendVerificationEmail = async (
  { _id, email }: UserVerify,
  res: Response
) => {
  const uniqueString = uuidv4() + _id;

  const mailOptions = {
    from: process.env.MAILGUN_USER,
    to: [email],
    subject: "Verify your account for Trackspence",
    html: `<h2>Verify your account</h2>
      <p>Click on this link to verify your account to complete your signup for Trackspence!</p>
      <p>This link <b>expires in 6 hours</b>.</p>
      <p>Press <a href=${
        website + "/api/users/verify/" + _id + "/" + uniqueString
      }>here</a> to proceed</p>`,
  };

  try {
    const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
    const newVerification = new VerificationModel({
      userId: _id,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 21600000,
    });

    await newVerification.save();
    await transporter.sendMail(mailOptions);
    console.log("Email Sent!");
  } catch (error) {
    console.error("Failed to send verification email: ", error);
  }
};

export const verifyUser: RequestHandler = async (req, res, next) => {
  const { userId, uniqueString } = req.params;

  try {
    const verificationRecord = await VerificationModel.findOne({ userId });

    if (!verificationRecord) {
      const message =
        "Account record does not exist or has been verified already. Please sign up or log in.";
      return res.redirect(
        `/api/users/verified?error=true&message=${encodeURIComponent(message)}`
      );
    }

    const { expiresAt, uniqueString: hashedUniqueString } = verificationRecord;

    if (expiresAt.getTime() < Date.now()) {
      // Verification has expired
      await VerificationModel.deleteOne({ userId });
      await UserModel.deleteOne({ _id: userId });

      const message = "Verification link has expired. Please sign up again.";
      return res.redirect(
        `/api/users/verified?error=true&message=${encodeURIComponent(message)}`
      );
    }

    const isMatch = await bcrypt.compare(uniqueString, hashedUniqueString);
    if (isMatch) {
      await UserModel.updateOne({ _id: userId }, { verified: true });
      await VerificationModel.deleteOne({ userId });

      res.sendFile(path.join(__dirname, "./../verified.html"));
    } else {
      const message =
        "Invalid verification details. Check your inbox and try again.";
      return res.redirect(
        `/api/users/verified?error=true&message=${encodeURIComponent(message)}`
      );
    }
  } catch (error) {
    console.error("Verification error: ", error);
    next(error);
    const message = "An error occurred during verification. Please try again.";
    return res.redirect(
      `/api/users/verified?error=true&message=${encodeURIComponent(message)}`
    );
  }
};

export const verifiedUser: RequestHandler = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "./../verified.html"));
};

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
  picture?: string;
  currency?: string;
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
  const picture = req.body.picture;
  const currency = req.body.currency;

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
      picture: picture,
      currency: currency,
      verified: false,
      createdAt: Date.now(),
    });

    // req.session.userId = newUser._id;

    await sendVerificationEmail(
      { _id: newUser._id.toString(), email: newUser.email },
      res
    );

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface updateUserParams {
  userId: string;
}

interface updateUserBody {
  username?: string;
  email?: string;
  currency?: string;
  profileImage?: string;
}

export const updateUser: RequestHandler<
  updateUserParams,
  unknown,
  updateUserBody,
  unknown
> = async (req, res, next) => {
  const userId = req.session.userId;
  const newUsername = req.body.username;
  const newEmail = req.body.email;
  const newCurrency = req.body.currency;
  const profileImage = req.body.profileImage ?? "";

  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }
    if (!newUsername || !newEmail || !newCurrency) {
      throw createHttpError(400, "Please enter all input correctly");
    }

    const user = await UserModel.findById(userId).exec();
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const CurrencyRes = `https://api.fxratesapi.com/latest?api_key=${JSON.stringify(
      process.env.CURRENCY_API_KEY
    )}&base=${
      user.currency
    }&currencies=${newCurrency}&resolution=1m&amount=1&places=6&format=json`;

    const CurrencyResponse = await fetch(CurrencyRes);

    const CurrencyData = await CurrencyResponse.json();

    const CurrencyVal = CurrencyData.rates[newCurrency];

    user.username = newUsername;
    user.email = newEmail;
    user.topay = user.topay.map((u) => ({
      ...u,
      amount: u.amount * CurrencyVal,
    }));
    user.currency = newCurrency;

    user.picture = profileImage;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;
  try {
    assertIsDefined(userId);

    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid userID");
    }
    const user = await UserModel.findById(userId).exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    await UserModel.findByIdAndDelete(userId);

    res.sendStatus(204);
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

    const query = {
      $or: [
        { username: username },
        { email: username }
      ]
    };
    
    const user = await UserModel.findOne(query)
      .select("+password +username +email")
      .exec();
    
    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    // Check if user is verified
    if (!user.verified) {
      const expiresAt = user.createdAt.getTime() + 21600000;
      if (expiresAt < Date.now()) {
        await CategoryModel.deleteMany({ userId: user._id });
        await AccountModel.deleteMany({ userId: user._id });
        await ExpenseModel.deleteMany({ userId: user._id });
        await UserModel.deleteOne({ _id: user._id });
        throw createHttpError(401, "Unverified account has expired. Please sign up again.");
      }
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

export const searchUsersByUsername: RequestHandler = async (req, res, next) => {
  const username = req.params.username;

  try {
    if (!username || typeof username !== "string") {
      throw createHttpError(400, "Username parameter is missing or invalid");
    }

    const regex = new RegExp(username, "i"); // Case-insensitive search regex
    const users = await UserModel.find({ username: { $regex: regex } })
      .select("+email")
      .exec();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users by username:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

export const searchUsersById: RequestHandler = async (req, res, next) => {
  const userId = req.params.Id;

  try {
    if (!userId || typeof userId !== "string") {
      throw createHttpError(400, "userId parameter is missing or invalid");
    }

    const users = await UserModel.findById(userId).select("+email").exec();

    if (!users) {
      const allUsers = await UserModel.find().exec();
      allUsers.forEach(u => {
        u.friendlist = u.friendlist.filter(f => f !== userId);
        u.save();
      });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users by username:", error);
    next(error); // Pass the error to the error handling middleware
  }
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
      !friendUser.friendRequest.includes(_id!) &&
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

interface updatecreateExpenseRequest {
  _id: string;
}

interface createExpenseBody {
  description?: string;
  date?: Date;
  amount?: number;
  currency: string;
  category?: string;
}

interface expenseEmail {
  toEmail: string;
  fromUsername: string;
}

const sendExpenseEmail = async (
  { toEmail, fromUsername }: expenseEmail,
  expense: createExpenseBody
) => {
  const mailOptions = {
    from: process.env.MAILGUN_USER,
    to: [toEmail],
    subject: "Trackspence New Expense",
    html: `<h2>${fromUsername} just shared a new expense!</h2>
        <p>
    Description: ${expense.description || "N/A"}<br>
    Date: ${expense.date ? expense.date : "N/A"}<br>
    Amount: ${
      expense.amount ? `${expense.amount} ${expense.currency}` : "N/A"
    }<br>
    Category: ${expense.category || "N/A"}
  </p>
      <p>This link <b>expires in 6 hours</b>.</p>
      <p>Press <a href=${website + "/friends"}>here</a> to view</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email Sent!");
  } catch (error) {
    console.error("Failed to send expense email: ", error);
  }
};

//creating expense request for another user
export const sendExpenseRequest: RequestHandler<
  updatecreateExpenseRequest,
  unknown,
  createExpenseBody,
  unknown
> = async (req, res, next) => {
  const _id = req.params._id;
  const description = req.body.description;
  const date = req.body.date;
  const amount = req.body.amount;
  const category = req.body.category;
  const currency = req.body.currency;

  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    if (!description || !amount || !category || !date) {
      throw createHttpError(400, "Please enter all input correctly");
    }

    if (!mongoose.isValidObjectId(_id)) {
      throw createHttpError(400, "Invalid friend ID");
    }

    if (!mongoose.isValidObjectId(authenticatedUserId)) {
      throw createHttpError(400, "Invalid user ID");
    }
    const friendUser = await UserModel.findById(_id).select("+email").exec();
    const user = await UserModel.findById(authenticatedUserId).exec();

    if (!friendUser) {
      throw createHttpError(404, "User not found");
    }

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const toCurrencyMulti = `https://api.fxratesapi.com/latest?api_key=${JSON.stringify(
      process.env.CURRENCY_API_KEY
    )}&base=${currency}&currencies=${
      friendUser.currency
    }&resolution=1m&amount=1&places=6&format=json`;
    const fromCurrencyMulti = `https://api.fxratesapi.com/latest?api_key=${JSON.stringify(
      process.env.CURRENCY_API_KEY
    )}&base=${currency}&currencies=${
      user.currency
    }&resolution=1m&amount=1&places=6&format=json`;

    const toCurrencyResponse = await fetch(toCurrencyMulti);
    const fromCurrencyResponse = await fetch(fromCurrencyMulti);

    const toCurrencyData = await toCurrencyResponse.json();
    const fromCurrencyData = await fromCurrencyResponse.json();

    const toCurrencyVal = toCurrencyData.rates[friendUser.currency];
    const fromCurrencyVal = fromCurrencyData.rates[user.currency];

    if (_id === authenticatedUserId.toString()) {
      const newExpense = await expenseModel.create({
        userId: authenticatedUserId,
        date: date,
        description: description,
        amount: amount * fromCurrencyVal,
        category: category,
      });
    } else {
      friendUser.topay.push({
        status: "pending",
        sendMoney: _id,
        sendMoneyName: friendUser.username,
        receiveMoney: authenticatedUserId,
        receiveMoneyName: user.username,
        date: date,
        description: description,
        amount: amount * toCurrencyVal,
        category: category,
      });

      user.topay.push({
        status: "pending",
        sendMoney: _id,
        sendMoneyName: friendUser.username,
        receiveMoney: authenticatedUserId,
        receiveMoneyName: user.username,
        date: date,
        description: description,
        amount: amount * fromCurrencyVal,
        category: category,
      });

      sendExpenseEmail(
        { toEmail: friendUser.email, fromUsername: user.username },
        req.body
      );
    }

    const updatedUser = await user.save();
    await friendUser.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

interface acceptExpenseRequestParams {
  _id?: string;
}
interface acceptExpenseRequestBody {
  status: string;
  sendMoney: string;
  receiveMoney: string;
  description: string;
  date: Date;
  amount: number;
  category: string;
  [key: string]: string | Date | number; // Index signature
}

export const acceptExpenseRequest: RequestHandler<
  acceptExpenseRequestParams,
  unknown,
  acceptExpenseRequestBody,
  unknown
> = async (req, res, next) => {
  const _id = req.params._id;
  const authenticatedUserId = req.session.userId;
  const { description, date, amount, category } =
    req.body as acceptExpenseRequestBody;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(authenticatedUserId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    if (!mongoose.isValidObjectId(_id)) {
      throw createHttpError(400, "Invalid friend ID");
    }

    const user = await UserModel.findById(authenticatedUserId).exec();
    const friendUser = await UserModel.findById(_id).exec();

    if (!user || !friendUser) {
      throw createHttpError(404, "User not found");
    }

    const reqBody = req.body as acceptExpenseRequestBody;

    user.topay = user.topay.map((expense) => {
      if (Object.keys(reqBody).some((key) => reqBody[key] !== expense[key])) {
        return expense;
      } else {
        return {
          status: "accepted",
          sendMoney: _id,
          sendMoneyName: friendUser.username,
          receiveMoney: authenticatedUserId,
          receiveMoneyName: user.username,
          date: date,
          description: description,
          amount: amount,
          category: category,
        };
      }
    });

    // Filter friendUser.topay
    friendUser.topay = friendUser.topay.map((expense) => {
      if (Object.keys(reqBody).some((key) => reqBody[key] !== expense[key])) {
        return expense;
      } else {
        return {
          status: "accepted",
          sendMoney: _id,
          sendMoneyName: friendUser.username,
          receiveMoney: authenticatedUserId,
          receiveMoneyName: user.username,
          date: date,
          description: description,
          amount: amount,
          category: category,
        };
      }
    });

    if (!description || !amount || !category || !date) {
      throw createHttpError(400, "Please enter all input correctly");
    }
    // Create new expense
    const newExpense = await expenseModel.create({
      userId: authenticatedUserId,
      date: date,
      description: description,
      amount: amount,
      category: category,
    });

    await user.save();
    await friendUser.save();
    res.status(200).json(user); // Sending back updated user object
  } catch (error) {
    console.error("Error adding friend:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

export const declineExpenseRequest: RequestHandler<
  acceptExpenseRequestParams,
  unknown,
  acceptExpenseRequestBody,
  unknown
> = async (req, res, next) => {
  const _id = req.params._id;
  const authenticatedUserId = req.session.userId;
  const { description, date, amount, category } =
    req.body as acceptExpenseRequestBody;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(authenticatedUserId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    if (!mongoose.isValidObjectId(_id)) {
      throw createHttpError(400, "Invalid friend ID");
    }

    const user = await UserModel.findById(authenticatedUserId).exec();
    const friendUser = await UserModel.findById(_id).exec();

    if (!user || !friendUser) {
      throw createHttpError(404, "User not found");
    }

    const reqBody = req.body as acceptExpenseRequestBody;

    // Filter user.topay
    user.topay = user.topay.map((expense) => {
      if (Object.keys(reqBody).some((key) => reqBody[key] !== expense[key])) {
        return expense;
      } else {
        return {
          status: "declined",
          sendMoney: _id,
          sendMoneyName: friendUser.username,
          receiveMoney: authenticatedUserId,
          receiveMoneyName: user.username,
          date: date,
          description: description,
          amount: amount,
          category: category,
        };
      }
    });

    // Filter friendUser.topay
    friendUser.topay = friendUser.topay.map((expense) => {
      if (Object.keys(reqBody).some((key) => reqBody[key] !== expense[key])) {
        return expense;
      } else {
        return {
          status: "declined",
          sendMoney: _id,
          sendMoneyName: friendUser.username,
          receiveMoney: authenticatedUserId,
          receiveMoneyName: user.username,
          date: date,
          description: description,
          amount: amount,
          category: category,
        };
      }
    });

    await user.save();
    await friendUser.save();

    // Create new expense
    const newExpense = await expenseModel.create({
      userId: authenticatedUserId,
      date: date,
      description: description,
      amount: amount,
      category: category,
    });

    res.status(200).json(user); // Sending back updated user object
  } catch (error) {
    console.error("Error adding friend:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

interface settleExpenseRequestParams {
  _id?: string; // ID of the recipient user (to whom friend request is sent)
}

export const settleExpenseRequest: RequestHandler<
  settleExpenseRequestParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const friendRequest = req.params._id;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(authenticatedUserId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    if (!mongoose.isValidObjectId(friendRequest)) {
      throw createHttpError(400, "Invalid friend ID");
    }

    const user = await UserModel.findById(authenticatedUserId).exec();
    const friendUser = await UserModel.findById(friendRequest).exec();

    if (!user || !friendUser) {
      throw createHttpError(404, "User not found");
    }

    // Assuming friendlist is an array of strings in the UserModel schema
    //removes friend request
    user.topay = user.topay.filter(
      (expense) =>
        expense.status === "pending" ||
        !(
          expense.sendMoneyName === friendUser.username ||
          expense.receiveMoneyName === friendUser.username
        )
    );

    friendUser.topay = friendUser.topay.filter(
      (expense) =>
        expense.status === "pending" ||
        !(
          expense.sendMoneyName === user.username ||
          expense.receiveMoneyName === user.username
        )
    );

    await friendUser.save();
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error adding friend:", error);
    next(error); // Pass the error to the error handling middleware
  }
};
