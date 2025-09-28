import { Router } from "express";
import { createNote, getNotes, deleteNote } from "../controllers/noteController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);
router.delete("/:id", deleteNote);

export default router;
