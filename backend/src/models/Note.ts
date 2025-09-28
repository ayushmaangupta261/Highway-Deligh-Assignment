import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
  user: Types.ObjectId;
  title: string;
  content: string;
}

const noteSchema = new Schema<INote>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // <- fix here
  title: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<INote>("Note", noteSchema);
