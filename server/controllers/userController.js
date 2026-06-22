import User from "../models/User.js";

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