import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"
import sendEmail from "../utils/sendEmail.js";

//REGISTER
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            username,
        });

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            profilePic: user.profilePic,
            email: user.email,
            token
        });

    } catch (error) {
        console.log("REGISTER ERROR:", error);

        console.log("REGISTER ERROR MESSAGE:", error.message);

        console.log("REGISTER ERROR STACK:", error.stack);
        res.status(500).json({ message: error.message,stack: error.stack });
    }
};

//LOGIN 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 4. Send response
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            profilePic: user.profilePic,
            email: user.email,
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 1. Generate token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // 2. Hash token and save
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;

        // 3. Expiry (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // 4. Create reset URL
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // 4. Create email message
        const message = `
                        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px;">
                         <div style="max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 10px; text-align: center;">
    
                         <h2 style="color: #4f46e5; margin-bottom: 10px;">
                        Connectify
                        </h2>

                         <h3 style="color: #333;">Reset Your Password</h3>

                        <p style="color: #555; font-size: 14px;">
                         We received a request to reset your password.
                          Click the button below to proceed.
                        </p>

                         <a href="${resetUrl}" 
                        style="
                          display: inline-block;
                          margin-top: 20px;
                          padding: 12px 25px;
                          background-color: #4f46e5;
                          color: white;
                          text-decoration: none;
                          border-radius: 5px;
                          font-weight: bold;
                        ">
                        Reset Password
                     </a>

                     <p style="margin-top: 25px; font-size: 12px; color: #888;">
                       This link will expire in 10 minutes.
                     </p>

                     <p style="font-size: 12px; color: #aaa;">
                       If you didn’t request this, you can safely ignore this email.
                     </p>
                 
                   </div>
                 </div>
                 `;

        await sendEmail({
            email: user.email,
            subject: "Reset Your Password",
            message,
        });

        res.json({
            message: "Email sent successfully",
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//RESET PASSWORD
export const resetPassword = async (req, res) => {
    try {
        // 1. Hash token from URL
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        // 2. Find user with token + valid expiry
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // 3. Update password
        user.password = req.body.password;

        // 4. Clear reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};