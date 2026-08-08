import express from "express";
import helmet from "helmet";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import mongoSanitize from "@exortek/express-mongo-sanitize";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import adminRoutes from "./routes/admin.route.js";
import commentRoutes from "./routes/comments.route.js";
import notificationRoutes from "./routes/notification.route.js";
import leaderboardRoutes from "./routes/leaderboard.route.js";


const app = express();
app.use(helmet());
app.use(compression());
app.use(mongoSanitize());
app.use(apiLimiter);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "15kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("CampusCode API is running...");
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);
export default app;
