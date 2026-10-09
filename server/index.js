import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import User from "./models/User.js";
import http from "http";
import { Server } from "socket.io";
import notificationRoutes from "./routes/notificationRoutes.js";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import multer from "multer";

const app = express();
const server = http.createServer(app);

// Render/Vercel sit behind a proxy: needed for correct client IPs (rate limiting)
app.set("trust proxy", 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL
    ],
    methods: ["GET", "POST"]
  },
});

// ---------------------------------------------------------------
// SOCKET AUTH: identity comes from the verified JWT, never from
// data the client sends. Clients connect with { auth: { token } }.
// ---------------------------------------------------------------
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id settings");
    if (!user) return next(new Error("User not found"));

    socket.userId = user._id.toString();
    socket.showOnlineStatus = user.settings?.showOnlineStatus !== false;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

// Number of open sockets per user (multiple tabs/devices are supported)
const connections = new Map();

// Only users who allow it are announced to everyone else
const visibleOnlineUsers = () => {
  const ids = [];
  for (const [userId, { visible }] of connections) {
    if (visible) ids.push(userId);
  }
  return ids;
};

const isValidId = (id) => typeof id === "string" && mongoose.isValidObjectId(id);

io.on("connection", (socket) => {
  const userId = socket.userId;

  // Each user has a private room; emitting to it reaches all of their tabs
  socket.join(userId);

  const entry = connections.get(userId) || { count: 0, visible: socket.showOnlineStatus };
  entry.count += 1;
  entry.visible = socket.showOnlineStatus;
  connections.set(userId, entry);

  const markOnline = async () => {
    if (socket.showOnlineStatus) {
      await User.findByIdAndUpdate(userId, { isOnline: true });
    }
    io.emit("getUsers", visibleOnlineUsers());
  };
  markOnline().catch((err) => console.error("presence error:", err));

  // Kept for backward compatibility with the client; the argument is ignored.
  socket.on("addUser", () => {
    socket.emit("getUsers", visibleOnlineUsers());
  });

  // SEND MESSAGE REAL-TIME (sender is always the authenticated user)
  socket.on("sendMessage", async ({ receiverId, text } = {}) => {
    try {
      if (!isValidId(receiverId)) return;
      if (typeof text !== "string" || !text.trim() || text.length > 2000) return;

      io.to(receiverId).emit("receiveMessage", {
        sender: userId,
        receiver: receiverId,
        text,
        createdAt: new Date(),
        isSeen: false,
      });

      io.to(receiverId).emit("conversationUpdated");
      io.to(userId).emit("conversationUpdated");

      const sender = await User.findById(userId)
        .select("_id username name profilePic");

      io.to(receiverId).emit("newNotification", {
        _id: Date.now().toString(),
        type: "message",
        sender,
        createdAt: new Date(),
        isRead: false,
      });
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  });

  socket.on("typing", ({ receiverId } = {}) => {
    if (isValidId(receiverId)) {
      io.to(receiverId).emit("userTyping", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ receiverId } = {}) => {
    if (isValidId(receiverId)) {
      io.to(receiverId).emit("userStoppedTyping", { senderId: userId });
    }
  });

  socket.on("disconnect", async () => {
    try {
      const current = connections.get(userId);
      if (current) {
        current.count -= 1;
        if (current.count <= 0) {
          connections.delete(userId);

          if (socket.showOnlineStatus) {
            await User.findByIdAndUpdate(userId, {
              isOnline: false,
              lastSeen: new Date(),
            });
          }
        }
      }
      io.emit("getUsers", visibleOnlineUsers());
    } catch (err) {
      console.error("disconnect error:", err);
    }
  });
});

// Multer / upload errors and anything else uncaught in routes
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err?.message?.startsWith("Only image")) {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
