import { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import User, { IUser } from "../models/User"; // assuming you have a User model
import { sendEmail } from "../utils/sendEmail";
import { noteSharedTemplate } from "../constant/noteSharedTemplate";

interface AuthRequest extends Request {
  user?: IUser;
}

// Create a new note
export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, } = req.body;
    const user = req.user;



    // Create the note
    const note = await Note.create({
      title,
      content,
      user: user?._id,
    });


    // Push note ID into user's notes array
    await User.findByIdAndUpdate(req.user!._id, {
      $push: { notes: note._id },
      new: true
    });

    res.status(201).json({ success: true, note });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};


// Get all notes for a user (own + shared) separately
export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    // Find user and populate own notes
    const user = await User.findById(userId)
      .populate("notes") // user's own notes
      .populate({
        path: "sharedNotes", // notes shared with the user
        populate: { path: "user", select: "name" } // populate owner info from Note
      })
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Map own notes
    const ownNotes = (user.notes as any[]).map(note => ({
      _id: note._id,
      title: note.title,
      content: note.content,
      sharedWith: note.sharedWith, // array of user IDs
      isOwner: true,
    }));

    // Map shared notes
    const sharedNotes = (user.sharedNotes as any[]).map(note => ({
      _id: note._id,
      title: note.title,
      content: note.content,
      ownerName: note.user?.name || "Unknown", // owner of the note
      isOwner: false,
    }));

    res.json({
      success: true,
      ownNotes,
      sharedNotes,
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};



// Delete a note
export const deleteNote = async (req: AuthRequest, res: Response) => {

  const noteId = req.params.id;
  const userId = req.user!._id; //  user in req from auth middleware


  try {
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    // Only owner can delete
    if (note.user.toString() !== userId.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    // Remove note from owner's notes
    await User.findByIdAndUpdate(userId, { $pull: { notes: note._id } });

    // Remove note from all shared users
    if (note.sharedWith && note.sharedWith.length > 0) {
      await User.updateMany(
        { email: { $in: note.sharedWith } }, // find all users the note was shared with
        { $pull: { sharedNotes: note._id } } // remove note reference
      );
    }

    // Delete the note itself
    await note.deleteOne();

    return res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete Note Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// Share a note with another user via email
export const shareNote = async (req: AuthRequest, res: Response) => {
  try {
    const noteId = req.params.id;
    const { emails } = req.body;

    if (!emails) return res.status(400).json({ success: false, message: "No emails provided" });

    // Convert emails to array
    const emailList: string[] = Array.isArray(emails)
      ? emails.map(e => e.trim()).filter(Boolean)
      : emails.split(",").map((e: string) => e.trim()).filter(Boolean);

    if (emailList.length === 0) return res.status(400).json({ success: false, message: "No valid emails provided" });

    
    // Find note
    const note = await Note.findById(noteId).populate<{ user: IUser }>('user');
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    // Only owner can share
    if (note.user._id.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to share this note" });
    }

    // Find users by email
    const users = await User.find({ email: { $in: emailList } });
    const foundUsers = users.map(u => u._id);
    const foundEmails = users.map(u => u.email);
    const notFoundEmails = emailList.filter(e => !foundEmails.includes(e));

    if (foundUsers.length === 0) {
      return res.status(404).json({ success: false, message: "No valid users found", notFoundEmails });
    }

    // Update note.sharedWith with user IDs, avoiding duplicates
    note.sharedWith = Array.from(new Set([...(note.sharedWith || []), ...foundUsers]));
    await note.save();

    // Update each user's sharedNotes
    for (const u of users) {
      if (!Array.isArray(u.sharedNotes)) u.sharedNotes = [];
      if (!u.sharedNotes.includes(note._id)) {
        u.sharedNotes.push(note._id);
        await u.save();
      }
    }

    // Send emails

    const mail = noteSharedTemplate((note?.user?.name as any), note?.title);

    const subject = "A note is shared with you"
    for (const email of foundEmails) {
      await sendEmail(email, subject, mail);
    }

    res.json({
      success: true,
      message: "Note shared successfully",
      sharedWith: foundEmails,
      notFoundEmails
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};


// editthe note
export const editNote = async (req: AuthRequest, res: Response) => {
  const noteId = req.params.id;
  const { title, content } = req.body;
  const userId = req.user!._id; // assuming you have user in req from auth middleware

  try {
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    // Only owner can edit
    if (note.user.toString() !== userId.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    note.title = title || note.title;
    note.content = content || note.content;
    await note.save();

    return res.status(200).json({ success: true, note });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
