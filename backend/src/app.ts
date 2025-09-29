import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoute";
import noteRoutes from "./routes/noteRoute";

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "https://ayushmaangupta261.github.io/Highway-Delight-Assignment/", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies
  })
);

// Parse JSON requests
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

export default app;
