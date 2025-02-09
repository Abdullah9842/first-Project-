import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface Post {
  image: string | null;
  text: string;
  id: number;
  liked: boolean;
  likeCount: number;
  spotifyUrl?: string;
}

const ClientPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      const allPosts = JSON.parse(storedPosts);
      const clientPosts = allPosts.filter((post: Post) => post.id === Number(clientId));
      setPosts(clientPosts);
    }
  }, [clientId]);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts((prev) => {
        const updatedPosts = prev.filter((post) => post.id !== id);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
        return updatedPosts;
      });
    }
  };

  const handleLikes = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post
      )
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
      <div className="mt-6 w-full flex flex-col items-center gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-400 p-4 shadow-lg rounded-lg w-full max-w-lg"
          >
            {post.image && (
              <img
                src={post.image}
                alt="User Upload"
                className="w-full h-auto rounded-lg mb-3"
              />
            )}
            <p className="text-base text-white">{post.text}</p>
            {post.spotifyUrl && (
              <iframe
                src={`https://open.spotify.com/embed/track/${post.spotifyUrl.split('/').pop()}`}
                className="w-full h-24 md:h-32 lg:h-40 rounded-lg"
                allow="encrypted-media"
              ></iframe>
            )}
            <div className="flex justify-between items-center mt-3">
              <button
                className="text-gray-500 hover:text-black transition"
                onClick={() => handleDelete(post.id)}
              >
                <AiFillDelete />
              </button>
              <button
                onClick={() => handleLikes(post.id)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                {post.liked ? <FaHeart /> : <FaRegHeart />} {post.likeCount}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientPage;