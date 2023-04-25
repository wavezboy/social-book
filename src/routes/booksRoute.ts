import express from "express";
import * as booksController from "../controller/bookController";

const router = express.Router();

router.post("/", booksController.createBook);
router.get("/", booksController.getBooks);
router.get("/:bookId", booksController.getBook);
export default router;
