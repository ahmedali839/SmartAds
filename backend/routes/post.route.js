import express from "express";
import {
    createPost,
    getAllPosts,
    getPostsByUser,
    updatePost,
    deletePost,
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { multerMiddleware } from "../config/cloudinaryConfig.js";

const router = express.Router();


router.post("/", authMiddleware, multerMiddleware, createPost);

// Get all posts (feed)
router.get("/", getAllPosts);

// Get posts by logged-in user
router.get("/user", authMiddleware, getPostsByUser);

// Update or delete post
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
