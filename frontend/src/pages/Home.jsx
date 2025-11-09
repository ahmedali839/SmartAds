import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "../services/postService";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllPosts();
      setPosts(res);
    } catch (err) {
      setError("Failed to fetch posts. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-lg text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>

      <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight mb-4 sm:mb-0 text-center sm:text-left">
              Explore Latest Ads
            </h1>
            <Link
              to="/create"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-all duration-200"
            >
              + Create Ad
            </Link>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 text-lg">
                No posts available yet.
              </p>
            ) : (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col"
                >
                  {post.mediaUrl && (
                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                      className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  )}

                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {post.aiDescription || post.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-lg font-bold text-blue-600">
                        ${post.price}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        {post.user?.username || "Unknown"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {post.hashtags?.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t flex justify-between items-center text-xs text-gray-400 bg-gray-50">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="capitalize">{post.category || "N/A"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
