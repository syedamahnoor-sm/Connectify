import User from "../models/User.js";
import cloudinary from "../config/Cloudinary.js";

// GET PROFILE
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("followers", "_id")
            .populate("following", "_id");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // BASIC
        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.location = req.body.location || user.location;
        user.website = req.body.website || user.website;

        // ABOUT
        user.about = {
            work: req.body.work || user.about?.work,
            education: req.body.education || user.about?.education,
            relationship: req.body.relationship || user.about?.relationship,
            interests: req.body.interests
                ? JSON.parse(req.body.interests)
                : user.about?.interests,
        };

        // SETTINGS
        if (req.body.settings) {
            user.settings = JSON.parse(req.body.settings);
        }

        // PROFILE IMAGE
        if (req.files?.profilePic) {
            const upload = await cloudinary.uploader.upload(
                req.files.profilePic[0].path
            );
            user.profilePic = upload.secure_url;
        }

        // COVER IMAGE
        if (req.files?.coverPic) {
            const upload = await cloudinary.uploader.upload(
                req.files.coverPic[0].path
            );
            user.coverPic = upload.secure_url;
        }

        await user.save();

        res.json(user);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//UPDATE SETTINGS
export const updateSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.settings = {
            ...user.settings,
            ...req.body
        };

        await user.save();

        res.json(user.settings);

    } catch (err) {
        console.log("SETTINGS ERROR:", err);
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// FOLLOW / UNFOLLOW
export const toggleFollow = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = user.following
            .map(id => id.toString())
            .includes(targetUser._id.toString());

        if (isFollowing) {
            user.following = user.following.filter(
                id => id.toString() !== targetUser._id.toString()
            );

            targetUser.followers = targetUser.followers.filter(
                id => id.toString() !== user._id.toString()
            );
        } else {
            user.following.push(targetUser._id);
            targetUser.followers.push(user._id);
        }

        await user.save();
        await targetUser.save();

        res.json({
            following: !isFollowing,
            followersCount: targetUser.followers.length,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};