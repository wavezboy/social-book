import express from "express";
import * as noteController from "../controller/notesController";

const router = express.Router();

router.get("/", noteController.getNotes);
router.post("/", noteController.createNotes);
router.get("/:noteId", noteController.getNote);
router.patch("/:noteId", noteController.updateNote);
router.delete("/:noteId", noteController.deleteNote);
export default router;
