import { Router } from "express";
import { signup, login, googleLogin } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin);

export default router;
