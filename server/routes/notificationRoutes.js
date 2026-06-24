import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getNotifications, markNotificationRead, clearNotifications, getUnreadCount } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markNotificationRead);
router.delete("/", protect, clearNotifications);
router.get("/unread-count", protect, getUnreadCount);

export default router;