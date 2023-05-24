import { RequestHandler } from "express";
import user2 from "../models/user2";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

// AUTHENTICATION

// SIGNUP
interface sigUpType {
  username: string;
  email: string;
  password: string;
}
export const signUpUser: RequestHandler<
  unknown,
  unknown,
  sigUpType,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    // check for parameter
    if (!username || !email || !passwordRaw) {
      createHttpError(400, "parameter missing");
    }

    // check for existing username from the database
    const existingUsername = await user2.findOne({ username: username }).exec();

    if (existingUsername) {
      throw createHttpError(404, "username already taken");
    }

    // check for existing email

    const existingEmail = await user2.findOne({ email: email }).exec();

    if (existingEmail) {
      throw createHttpError(404, "email already taken");
    }

    // processing the password for hashing

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    // creation of new user

    const newUser = await user2.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// LOGIN

interface loginType {
  username?: string;
  password?: string;
}

export const loginUser: RequestHandler<
  unknown,
  unknown,
  loginType,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  //   check for parameter

  try {
    if (!username || !password) {
      createHttpError(404, "parameter missing");
    }

    // check user

    const user = await user2
      .findOne({ username: username })
      .select("+password +email")
      .exec();
  } catch (error) {
    next(error);
  }
};
