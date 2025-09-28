import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateOTP } from "../utils/generateOTP";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.password) return res.status(400).json({ message: "Use Google login" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ message: "Google login failed" });

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({ name: payload.name, email: payload.email, googleId: payload.sub });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
