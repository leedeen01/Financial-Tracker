import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import expenseRoutes from "./routes/expenseRoutes";
import userRoutes from "./routes/userRoutes";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import cors from "cors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";

const app = express();
const corsOptions = {
  credentials: true,
  origin: ["7f947cef-e496-4272-a361-fce8733fc0a3"], // Whitelist the domains you want to allow
};
app.use(cors(corsOptions));

//to get a console log message for any request
app.use(morgan("dev"));
//setup express to accept json bodies
app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

app.use("/api/expenses", expenseRoutes);
app.use("/api/users", userRoutes);

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
