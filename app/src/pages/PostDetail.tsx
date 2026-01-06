import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface VideoPost {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  description: string;
  views: number;
}

export default function Posts() {
  const [posts, setPosts] = useState<VideoPost[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/posts")
      .then(res => res.json())
      .then(data => setPosts(data.data)) // backend `data` field ichida postlar bor
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <Link
          key={post.id}
          to={`/post/${post.slug}`}
          className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
        >
          <img src={post.thumbnail} alt={post.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="font-bold text-lg">{post.title}</h2>
            <p className="text-gray-500 text-sm mt-1">{post.description.slice(0, 60)}...</p>
            <p className="text-gray-400 text-xs mt-2">{post.views} views</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
