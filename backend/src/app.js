import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("CampusCode API is running...");
});
// Routes
app.use("/api/auth", authRoutes);

export default app;
