import Message from "../models/Message.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// SEND MESSAGE
export const sendMessage = async (req, res) => {
    try {
        const receiver = await User.findById(req.body.receiverId);

        if (!receiver.settings?.allowMessages) {
            return res.status(403).json({ message: "User has disabled messages" });
        }

        const message = await Message.create({
            sender: req.user.id,
            receiver: req.body.receiverId,
            text: req.body.text,
        });

        if (
            req.user.id !== req.body.receiverId
            &&
            receiver.settings?.pushNotifications) {

            const existingNotification =
                await Notification.findOne({
                    recipient: req.body.receiverId,
                    sender: req.user.id,
                    type: "message",
                    isRead: false,
                });

            let notification = existingNotification;

            if (!notification) {
                notification = await Notification.create({
                    recipient: req.body.receiverId,
                    sender: req.user.id,
                    type: "message",
                });
            }
        }

        res.json(message);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET CHAT
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id },
            ],
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        })
            .sort({ createdAt: -1 })
            .populate("sender", "name username profilePic")
            .populate("receiver", "name username profilePic");

        const conversationsMap = new Map();

        messages.forEach((msg) => {

            const otherUser =
                msg.sender._id.toString() === currentUserId
                    ? msg.receiver
                    : msg.sender;

            const otherUserId = otherUser._id.toString();

            if (!conversationsMap.has(otherUserId)) {
                conversationsMap.set(otherUserId, {
                    userId: otherUser._id,
                    name: otherUser.username || otherUser.name,
                    profilePic: otherUser.profilePic,
                    isOnline: otherUser.isOnline,
                    lastSeen: otherUser.lastSeen,
                    lastMessage: msg.text,
                    lastMessageTime: msg.createdAt,
                    unreadCount: 0,
                });
            }

            if (
                msg.receiver._id.toString() === currentUserId &&
                !msg.isSeen
            ) {
                conversationsMap.get(otherUserId).unreadCount += 1;
            }
        });

        res.json(Array.from(conversationsMap.values()));

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const markMessagesAsSeen = async (req, res) => {
    try {
        const result = await Message.updateMany(
            {
                sender: req.params.userId,
                receiver: req.user.id,
            },
            {
                isSeen: true,
            }
        );

        res.json({
            message: "Messages marked as seen",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message,
        });
    }
};