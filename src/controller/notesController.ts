import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import noteModel from "../models/note";
import { assertIsDefine } from "../utill/assertIsDefine";

export const getNotes: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefine(authenticatedUserId);

    const notes = await noteModel.find({ userId: authenticatedUserId }).exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefine(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "invalid id");
    }
    const note = await noteModel.findById(noteId).exec();

    if (!note) {
      createHttpError(400, "note not found");
    }

    if (note?.userId && !note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "you cannot access this note");
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

interface createNotesBody {
  title?: string;
  text?: string;
}

export const createNotes: RequestHandler<
  unknown,
  unknown,
  createNotesBody,
  unknown
> = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefine(authenticatedUserId);
    if (!title) {
      throw createHttpError(400, "note must have a title");
    }

    const newNote = await noteModel.create({
      userId: authenticatedUserId,
      title: title,
      text: text,
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

interface updatenoteParam {
  noteId: string;
}

interface updateNoteBody {
  title?: string;
  text?: string;
}

export const updateNote: RequestHandler<
  updatenoteParam,
  unknown,
  updateNoteBody,
  unknown
> = async (req, res, next) => {
  const noteId = req.params.noteId;
  const newTitle = req.body.title;
  const newText = req.body.text;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefine(authenticatedUserId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "invalid note id");
    }

    if (!newTitle) {
      throw createHttpError(400, "note must have a value");
    }

    const note = await noteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "note not found");
    }
    if (note?.userId && !note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "you cannot access this note");
    }
    note.title = newTitle;
    note.text = newText;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefine(authenticatedUserId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "invalide note id");
    }

    const note = await noteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(400, "note not found");
    }
    if (note?.userId && !note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "you cannot access this note");
    }

    await note.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
