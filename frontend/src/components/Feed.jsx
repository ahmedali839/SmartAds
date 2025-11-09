import React, { useEffect, useState } from "react";
import api from "../utlis/Api";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/posts");
      setPosts(res.data);
    })();
  }, []);

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div key={post._id} className="bg-white shadow-md rounded-lg p-4">
          {post.mediaUrl && (
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="w-full h-48 object-cover rounded-md mb-2"
            />
          )}
          <h3 className="font-bold text-lg">{post.title}</h3>
          <p>{post.description}</p>
          <p className="text-blue-600 font-semibold">${post.price}</p>
        </div>
      ))}
    </div>
  );
}
