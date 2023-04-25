import { RequestHandler } from "express";
import createHttpError from "http-errors";
import userModel from "../models/user";
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userModel
      .findById(req.session.userId)
      .select("+email")
      .exec();

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

interface signUpBody {
  username?: string;
  email?: string;
  password: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  signUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      createHttpError(400, "parameter missing");
    }

    const existingUsername = await userModel
      .findOne({ username: username })
      .exec();

    if (existingUsername) {
      throw createHttpError(
        409,
        "username already taken, choose another username or login instead"
      );
    }

    const existingEmail = await userModel.findOne({ email: email }).exec();

    if (existingEmail) {
      throw createHttpError(
        409,
        "a user with this email already exist, login instead"
      );
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await userModel.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    req.session.userId = newUser._id;

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface loginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  loginBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, "parameter missing");
    }

    const user = await userModel
      .findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "invalid credential");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createHttpError(401, "invalid credential");
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logOut: RequestHandler = async (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
