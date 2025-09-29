import { Router } from "express";
import { sendSignupOtp, verifySignupOtp, sendLoginOtp, verifyLoginOtp, googleLogin } from "../controllers/authController";

const router = Router();

router.post("/send-signup-otp", sendSignupOtp);
router.post("/send-login-otp", sendLoginOtp);
router.post("/signup", verifySignupOtp);
router.post("/login", verifyLoginOtp);
router.post("/google-login", googleLogin);

export default router;