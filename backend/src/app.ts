import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoute";
import noteRoutes from "./routes/noteRoute";

const app = express();

// ✅ Add CORS
app.use(cors({
  origin: "*", // You can change "*" to your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

export default app;
