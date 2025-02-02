import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import friendRequestRoutes from "./routes/friendrequest.route.js";
import { protectRoute } from "./middleware/auth.middleware.js";



dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Middleware configuration
app.use(express.json({ limit: "10mb" })); // Increase payload size limit for JSON
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase limit for URL-encoded data
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/friendrequests",protectRoute, friendRequestRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start the server
server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
