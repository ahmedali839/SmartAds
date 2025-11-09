import Post from "../models/post.model.js";
import { uploadFileToCloudinary } from "../config/cloudinaryConfig.js";
// import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// ⚙️ Initialize OpenAI client
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// // ⚙️ Configure Cloudinary (optional: move to separate config file)
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// ===========================================================
// 🟢 1️⃣ CREATE NEW POST
// ===========================================================


export const createPost = async (req, res) => {
    const file = req.file
    try {
        const {
            title,
            description,
            price,
            category,
            subCategory,
            expiryAt,
        } = req.body;

        // Validate required fields
        if (!title || !description || !price || !category || !subCategory) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let mediaUrl = null;
        let mediaType = "text";

        // ✅ Handle media upload if file exists
        if (file) {
            const uploadResult = await uploadFileToCloudinary(file)
            mediaUrl = uploadResult.secure_url;
            mediaType = uploadResult.resource_type === "video" ? "video" : "image";
            //   const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
            //     resource_type: "auto",
            //   });
        }

        // ✅ Step 1: Generate AI Description & Hashtags
        let aiDescription = "";
        let hashtags = [];
        //     try {
        //         const prompt = `
        //   Write a catchy and concise advertisement for:
        //   Title: ${title}
        //   Category: ${category} / ${subCategory}
        //   Description: ${description}
        //   Price: ${price}
        //   Output in this format:
        //   ---
        //   Description: (text)
        //   Hashtags: (comma-separated)
        //   ---
        //   `;
        //         const aiResponse = await openai.chat.completions.create({
        //             model: "gpt-4o-mini",
        //             messages: [{ role: "user", content: prompt }],
        //         });

        //         const aiText = aiResponse.choices[0].message.content;
        //         const descMatch = aiText.match(/Description:(.*)/i);
        //         const tagMatch = aiText.match(/Hashtags:(.*)/i);

        //         aiDescription = descMatch ? descMatch[1].trim() : description;
        //         hashtags = tagMatch
        //             ? tagMatch[1]
        //                 .split(",")
        //                 .map((tag) => tag.trim().replace(/^#?/, "#"))
        //             : [];
        //     } catch (err) {
        //         console.error("AI generation failed:", err.message);
        //         aiDescription = description;
        //         hashtags = [];
        //     }

        //     // ✅ Step 2: Generate Promotional Image (optional)
        let promoImageUrl = null;
        //     try {
        //         const imgPrompt = `Create a promotional ad banner for: ${title} in category ${category}.`;
        //         const imageResult = await openai.images.generate({
        //             model: "gpt-image-1",
        //             prompt: imgPrompt,
        //             size: "512x512",
        //         });
        //         promoImageUrl = imageResult.data[0].url;
        //     } catch (err) {
        //         console.error("AI image generation failed:", err.message);
        //     }

        // ✅ Step 3: Create Post in DB
        const newPost = await Post.create({
            user: req.user._id,
            title,
            description,
            aiDescription,
            hashtags,
            price,
            category,
            subCategory,
            mediaUrl,
            mediaType,
            promoImageUrl,
            expiryAt,
        });

        return res.status(201).json({
            message: "Ad posted successfully!",
            data: newPost,
        });
    } catch (error) {
        console.error("Create Post Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


// GET ALL POSTS (Feed)
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username email")
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Get All Posts Error:", error);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
};


//  GET POSTS BY USER
export const getPostsByUser = async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id;
        const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Get User Posts Error:", error);
        res.status(500).json({ message: "Failed to fetch user's posts" });
    }
};


//  UPDATE POST
export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const updates = req.body;

        const updatedPost = await Post.findByIdAndUpdate(postId, updates, {
            new: true,
        });
        if (!updatedPost)
            return res.status(404).json({ message: "Post not found" });

        res.status(200).json({ message: "Post updated", post: updatedPost });
    } catch (error) {
        console.error("Update Post Error:", error);
        res.status(500).json({ message: "Failed to update post" });
    }
};


// DELETE POST
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const deleted = await Post.findByIdAndDelete(postId);
        if (!deleted)
            return res.status(404).json({ message: "Post not found" });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Delete Post Error:", error);
        res.status(500).json({ message: "Failed to delete post" });
    }
};


// 🟢 6️⃣ MOCK SOCIAL MEDIA SHARE
// // ===========================================================
// const mockSocialMediaShare = async (post) => {
//     try {
//         // Simulated API calls
//         console.log("📤 Sending ad to WhatsApp mock API...");
//         console.log("📤 Sending ad to Facebook mock API...");

//         // You could send POST requests here to your mock endpoints if needed.
//         // Example:
//         // await axios.post(`${process.env.META_MOCK_URL}/facebook`, post);
//         // await axios.post(`${process.env.WHATSAPP_MOCK_URL}/send`, post);

//         return ["facebook", "whatsapp"];
//     } catch (err) {
//         console.error("Mock social media share failed:", err.message);
//         return [];
//     }
// };
