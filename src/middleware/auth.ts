import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requestAuth: RequestHandler = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    next(createHttpError(401, "user not authenticated"));
  }
};
