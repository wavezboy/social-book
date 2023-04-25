import { Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";

import book from "../models/book";

interface CreateBooksBody {
  title?: string;
  author?: string;
  genre?: string;
  publisher?: string;
  publish_year?: number;
}

export const createBook: RequestHandler<
  unknown,
  unknown,
  CreateBooksBody,
  unknown
> = async (req, res, next) => {
  const title = req.body.title;
  const author = req.body.author;
  const genre = req.body.genre;
  const publish_year = req.body.publish_year;
  const publisher = req.body.publisher;

  try {
    if (!title) {
      throw createHttpError("book must be title");
    }

    if (typeof publish_year !== "number") {
      throw createHttpError("invalid year");
    }

    const newBook = await book.create({
      title: title,
      author: author,
      genre: genre,
      publish_year: publish_year,
      publisher: publisher,
    });
    res.status(201).json(newBook);

    // (Aleternative method)

    // const newBook = new book(req.body);
    // await newBook.save();
    // res.status(500).json({ message: "book created" });
  } catch (error) {
    next(error);
  }
};

export const getBooks: RequestHandler<
  unknown,
  unknown,
  CreateBooksBody,
  unknown
> = async (req, res, next) => {
  try {
    const myBooks = await book.find().exec();
    res.status(200).json({ myBooks });
  } catch (error) {
    console.log(error);
    next(error);

    // res.status(500).json({ message: "server error" });
  }
};

export const getBook = async (req: Request, res: Response): Promise<void> => {
  const bookId = req.params.bookId;
  try {
    const myBook = await book.findById(bookId);
    res.status(201).json({ myBook });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};
