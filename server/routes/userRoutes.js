import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAllUsers, getUserById, searchUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});

router.get("/search", protect, searchUsers);

router.get("/", protect, getAllUsers);

router.get("/:id", protect, getUserById);

export default router;