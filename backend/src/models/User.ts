import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  dob?: Date;
  googleId?: string;
  otp?: string;
  isVerified: boolean;
  notes: Types.ObjectId[];        // notes created by the user
  sharedNotes: Types.ObjectId[];  // notes shared with the user
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date },
    googleId: { type: String },
    otp: { type: String },
    isVerified: { type: Boolean, default: false },

    // Notes created by user
    notes: [{ type: Schema.Types.ObjectId, ref: "Note" }],

    // Notes shared with user
    sharedNotes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
