import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateOTP } from "../utils/generateOTP";
import { sendEmail } from "../utils/sendEmail";
import { OAuth2Client } from "google-auth-library";
import { otpEmailTemplate } from "../constant/otpEmailTemplate";
import { loginSuccessTemplate } from "../constant/loginSucessTemplate";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// otp signup section 
export const sendSignupOtp = async (req: Request, res: Response) => {
  try {
    const { name, email, dob } = req.body;

    console.log("Received signup request for:", email);

    if (!name || !email || !dob) {
      return res.status(400).json(
        {
          message: "Name, email, and DOB are required",
          sucess: false
        });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        // User already verified
        return res.status(400).json(
          {
            message: "User already exists",
            sucess: false
          });
      } else {
        // User exists but not verified → resend OTP
        const otp = await generateOTP();
        existingUser.otp = otp;
        await existingUser.save();

        const mail = otpEmailTemplate(otp)
        const subject = "OTP for Authentication"

        await sendEmail(email, subject, mail);

        return res.json(
          {
            message: "OTP resent to email",
            userId: existingUser._id,
            success: true
          });
      }
    }

    // New user → create and send OTP
    const otp = await generateOTP();
    console.log("Generated OTP:", otp);

    const user = await User.create({
      name,
      email,
      dob,
      otp,
      isVerified: false,
    });




    const mail = otpEmailTemplate(otp)
    const subject = "OTP for Authentication"

    await sendEmail(email, subject, mail);

    res.json({
      message: "OTP sent to email",
      userId: user._id,
      success: true
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};


export const verifySignupOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    console.log("Verifying signup OTP for:", email);


    const user = await User.findOne({ email });

    console.log("Verifying OTP for user:", email, "with OTP:", otp);


    // not registered
    if (!user) return res.status(400).json({
      message: "User not found",
      success: false
    });

    // check the otp
    if (user.otp !== otp) return res.status(400).json({
      message: "Invalid OTP",
      success: false
    });

    // verify and save the user
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const mail = loginSuccessTemplate(user.name)
    const subject = "Authenticated successfully"
    await sendEmail(email, subject, mail);


    // return response with jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.json({
      message: "Signup successful",
      user,
      token,
      success: true
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      success: false
    });
  }
};


// otp login section
export const sendLoginOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    console.log("Received login request for:", email);


    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false
      });
    }

    const user = await User.findOne({ email });

    // user not registered
    if (!user) return res.status(400).json({
      message: "User not found",
      success: false
    });

    // user is not verified
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please complete your signup before logging in",
        success: false,
      });
    }

    // generate otp 
    const otp = generateOTP();
    user.otp = otp;
    await user.save();


    // send otp
    const mail = otpEmailTemplate(otp)
    const subject = "OTP for Authentication"
    await sendEmail(email, subject, mail);

    // return response
    res.json({
      message: "OTP sent to email",
      userId: user._id,
      success: true
    });
  } catch (err) {
    console.log("Error -> ", err);

    res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

export const verifyLoginOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // return if otp doesnt mathces
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false
      });
    }


    user.otp = undefined;
    await user.save();

    const mail = loginSuccessTemplate(user.name)
    const subject = "Authenticated successfully"
    await sendEmail(email, subject, mail);

    // allow user to login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.json({
      message: "Login successful",
      user,
      token,
      success: true
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

// google login section
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ message: "Google login failed" });

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        isVerified: true,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
