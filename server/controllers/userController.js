import User from "../models/User.js";
import Post from "../models/Post.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUserById = async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isOwner =
            user._id.toString() === req.user._id.toString();

        if (
            !isOwner &&
            user.settings.profileVisibility === "private"
        ) {
            return res.status(403).json({
                message: "This profile is private."
            });
        }

        res.json(user);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};

export const searchUsers = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query) {
            return res.json([]);
        }

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { name: { $regex: query, $options: "i" } },
            ],
        })
            .select("name username profilePic")
            .limit(10);

        res.json(users);

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};


export const deleteAccount = async (req, res) => {
    try {

        const userId = req.user._id;

        // Delete all posts created by the user
        await Post.deleteMany({
            user: userId,
        });

        // Delete all messages
        await Message.deleteMany({
            $or: [
                { sender: userId },
                { receiver: userId },
            ],
        });

        // Delete all notifications
        await Notification.deleteMany({
            $or: [
                { sender: userId },
                { recipient: userId },
            ],
        });

        // Remove user from every follower/following list
        await User.updateMany(
            {},
            {
                $pull: {
                    followers: userId,
                    following: userId,
                },
            }
        );

        // Remove likes and comments made by this user
        await Post.updateMany(
            {},
            {
                $pull: {
                    likes: userId,
                    comments: {
                        user: userId,
                    },
                },
            }
        );

        // Delete the user account
        await User.findByIdAndDelete(userId);

        // Logout
        res.clearCookie("jwt");

        res.status(200).json({
            message: "Account deleted successfully.",
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};