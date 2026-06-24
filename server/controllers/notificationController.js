import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user.id,
        })
            .populate("sender", "name username profilePic")
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const markNotificationRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(
            req.params.id,
            {
                isRead: true,
            }
        );

        res.json({
            message: "Notification marked as read",
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};


export const clearNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({
            recipient: req.user.id,
        });

        res.json({
            message: "Notifications cleared",
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};


export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user.id,
            isRead: false,
        });

        res.json({ count });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};