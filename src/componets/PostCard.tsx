

import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface Post {
  image: string | null;
  text: string;
  id: number;
  liked: boolean;
  likeCount: number;
  mediaUrl?: string; // تم تغيير spotifyUrl إلى mediaUrl لدعم منصات متعددة
}

interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
  onLike: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onLike }) => {
  // التحقق من أن الرابط خاص بـ Spotify
  const isSpotifyUrl = (url: string): boolean => {
    return url.includes("open.spotify.com");
  };

  return (
    <div className="bg-gray-400 p-4 shadow-lg rounded-lg w-full max-w-lg">
      {/* عرض الصورة إذا كانت متاحة */}
      {post.image && (
        <img src={post.image} alt="User Upload" className="w-full h-auto rounded-lg mb-3" />
      )}

      {/* عرض النص */}
      <p className="text-base text-white">{post.text}</p>

      {/* عرض Spotify كمشغل مضمن */}
      {post.mediaUrl && isSpotifyUrl(post.mediaUrl) && (
        <iframe
          src={`https://open.spotify.com/embed/track/${post.mediaUrl.split('/').pop()}`}
          className="w-full h-24 md:h-32 lg:h-40 rounded-lg"
          allow="encrypted-media"
        ></iframe>
      )}

      {/* عرض الروابط الأخرى كنص */}
      {post.mediaUrl && !isSpotifyUrl(post.mediaUrl) && (
        <a
          href={post.mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {post.mediaUrl}
        </a>
      )}

      {/* أزرار الحذف والإعجاب */}
      <div className="flex justify-between items-center mt-3">
        <button
          aria-label="Delete post"
          className="text-gray-500 hover:text-black transition"
          onClick={() => onDelete(post.id)}
        >
          <AiFillDelete />
        </button>
        <button
          aria-label="Like post"
          onClick={() => onLike(post.id)}
          className="text-gray-500 hover:text-red-500 transition"
        >
          {post.liked ? <FaHeart /> : <FaRegHeart />} {post.likeCount}
        </button>
      </div>
    </div>
  );
};

export default PostCard;