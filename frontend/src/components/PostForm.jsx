import React, { useState } from "react";
import api from "../utlis/Api";
import { useNavigate } from "react-router-dom";

export default function PostForm({ onPostCreated }) {

  const navigate = useNavigate();
  const token = localStorage.getItem("token")
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    expiryAt: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Login required");

    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => data.append(key, val));
    if (file) data.append("media", file);

    try {
      setLoading(true);
      const res = await api.post("/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Ad created!");
      onPostCreated(res.data.data);
      setForm({
        title: "",
        description: "",
        price: "",
        category: "",
        subCategory: "",
        expiryAt: "",
      });
      setFile(null);
      navigate("/me");
    } catch (err) {
      console.error(err);
      alert("Failed to post ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg mt-6 space-y-3"
    >
      <h2 className="text-xl font-semibold">Create New Ad</h2>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          value={form[key]}
          onChange={handleChange}
          placeholder={key}
          required
          className="w-full border p-2 rounded"
        />
      ))}

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Posting..." : "Post Ad"}
      </button>
    </form>
  );
}
