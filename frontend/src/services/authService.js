// src/services/authService.js
import axios from "axios";

const API_URL = `${import.meta.env.VITE_APP_BACKEND_URL}`; // adjust if needed

// Send OTP
export const sendOtp = async (email) => {
    const res = await axios.post(`${API_URL}/auth/send-otp`, { email });
    return res.data;
};

// Verify OTP + Create Account
export const verifyOtp = async (userName, email, otp, password) => {
    const res = await axios.post(`${API_URL}/auth/verify-otp`, { userName, email, otp, password });
    if (res.data.data?.token) {
        localStorage.setItem("token", res.data.data.token);
    }
    return res.data;
};

// Login
export const loginUser = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/user-login`, { email, password });
    if (res.data.data?.token) {
        localStorage.setItem("token", res.data.data.token);
    }
    return res.data;
};

// Logout
export const logoutUser = () => {
    localStorage.removeItem("token");
};

// Check authentication
export const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/auth/check-auth`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
