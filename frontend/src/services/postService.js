import api from "../utlis/Api";

// API FUNCTIONS 

//  Create Post
export const createPost = async (formData) => {
    try {
        const response = await api.post("/", formData, {
            headers: { "Content-Type": "multipart/form-data" }, // for file uploads
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error creating post" };
    }
};

//  Get All Posts (Feed)
export const getAllPosts = async () => {
    try {
        const response = await api.get("/posts");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error fetching posts" };
    }
};

//  Get Posts by Logged-in User
export const getUserPosts = async () => {
    try {
        const response = await api.get("/posts/user");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error fetching user posts" };
    }
};

// Update Post
export const updatePost = async (postId, updates) => {
    try {
        const response = await api.put(`/${postId}`, updates);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error updating post" };
    }
};

// Delete Post
export const deletePost = async (postId) => {
    try {
        const response = await api.delete(`/${postId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error deleting post" };
    }
};
