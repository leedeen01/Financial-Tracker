import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import expenseRoutes from "./routes/expenseRoutes";
import userRoutes from "./routes/userRoutes";
import geminiRoutes from "./routes/geminiRoutes"
import categoryRoutes from "./routes/categoryRoutes";
import accountRoutes from "./routes/accountRoutes";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import cors from "cors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

const app = express();
const corsOptions = {
  credentials: true,
  origin: true, // Whitelist the domains you want to allow
};
app.use(cors(corsOptions));

//to get a console log message for any request
app.use(morgan("dev"));
//setup express to accept json bodies
app.use(express.json());

app.set("trust proxy", 1); // trust first proxyS

app.use(
  session({
    secret: process.env.SESSION_SECRET || env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    name: "MyCoolWebAppCookieName", // This needs to be unique per-host.
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: false,
      sameSite: "none",
      secure: true,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGO_CONNECTION_STRING || env.MONGO_CONNECTION_STRING,
    }),
  })
);
app.use("/api/gemini", geminiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expenses", requiresAuth, expenseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/accounts", accountRoutes);


app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

//error handling function for reusability
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error();
  let errorMessage = "An unknown error occured";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
