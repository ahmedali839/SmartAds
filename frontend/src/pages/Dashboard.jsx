import { Link, useNavigate } from "react-router-dom";
import { checkAuth, logoutUser } from "../services/authService";
import { useEffect, useState } from "react";
import { getUserPosts } from "../services/postService";
import { FiLogOut } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchUserPosts = async () => {
        try {
            setLoading(true);
            const res = await getUserPosts();
            const result = await checkAuth();
            setPosts(res);
            setUser(result?.data);
        } catch (err) {
            setError("Failed to fetch posts. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPosts();
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate("/");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                <p className="animate-pulse text-lg font-medium">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col">
            {/* Top Section (User Info + Logout) */}
            <header className="w-full bg-white shadow-md py-4 px-6 flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                        {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            Welcome, {user?.username || "User"}
                        </h3>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200"
                >
                    <FiLogOut size={18} />
                    Logout
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 text-center sm:text-left">
                        Your Posts
                    </h1>

                    <Link
                        to="/create"
                        className="mt-3 sm:mt-0 inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-all duration-200"
                    >
                        <AiOutlinePlus size={20} />
                        Create New Post
                    </Link>
                </div>

                {/* Error */}
                {error && (
                    <div className="text-center text-red-500 mb-4 font-medium">{error}</div>
                )}

                {/* Posts Grid */}
                {posts.length === 0 ? (
                    <p className="text-center text-gray-500">No posts available yet.</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="bg-white shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden flex flex-col"
                            >
                                {post.mediaUrl && (
                                    <img
                                        src={post.mediaUrl}
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}

                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 mb-1">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 text-sm line-clamp-3">
                                            {post.aiDescription || post.description}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="font-semibold text-blue-600">
                                            ${post.price}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {post.category}
                                        </span>
                                    </div>

                                    {post.hashtags?.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {post.hashtags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-3 text-xs text-gray-400 text-right">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
