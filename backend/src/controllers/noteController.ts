import { Request, Response } from "express";
import Note from "../models/Note";
import { IUser } from "../models/User";

interface AuthRequest extends Request {
  user?: IUser;
}

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ title, content, user: req.user!._id });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ user: req.user!._id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
