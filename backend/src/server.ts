import dotenv from "dotenv";
import app from "./app";
import connectDB from "./utils/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI!);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
