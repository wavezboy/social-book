import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notesRoute";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import booksRoutes from "./routes/booksRoute";
import userRoutes from "./routes/userRoute";
// import cors from "cors";
import session from "express-session";
import env from "./utill/validateEnv";
import MongoStore from "connect-mongo";
import { requestAuth } from "./middleware/auth";
import cors from "cors";

const app = express();

app.use(morgan("dev"));

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://wavez-note-app.netlify.app"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
      // secure: env.isProduction,      // sameSite: env.isProduction ? "none" : "strict",
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_FILE_STRING,
    }),
  })
);

const origin =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:5173";

app.use(
  cors({
    origin,
    credentials: true,
  })
);

app.use("/api/notes", requestAuth, notesRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMesage = "an unknown error has occured";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMesage = error.message;
  }
  res.status(statusCode).json({ error: errorMesage });
});

export default app;
