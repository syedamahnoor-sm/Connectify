import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        profilePic: {
            type: String,
            default: ""
        },
        coverPic: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            default: "",
        },

        location: String,
        website: String,

        joinedAt: {
            type: Date,
            default: Date.now
        },

        about: {
            work: String,
            education: String,
            relationship: String,
            interests: [String],
        },

        settings: {
            emailNotifications: { type: Boolean, default: true },
            pushNotifications: { type: Boolean, default: true },
            profileVisibility: { type: String, default: "public" },
            showOnlineStatus: { type: Boolean, default: true },
            allowMessages: { type: Boolean, default: true },
            showActivity: { type: Boolean, default: true },
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpire: {
            type: Date
        }
    }, { timestamps: true },
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);

});
export default mongoose.model("User", userSchema);