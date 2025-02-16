import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {Post} from "../types/types"
interface PostItemProps {
  post: Post;
  onDelete: (id: number) => void;
  onLikes: (id: number) => void;
}




const PostItem: React.FC<PostItemProps> = ({ post, onDelete, onLikes }) => {
  return (
    <div className="bg-gray-400 p-4 shadow-lg rounded-lg w-full max-w-lg">
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
          onClick={() => onDelete(post.id)}
        >
          <AiFillDelete />
        </button>
        <button
          onClick={() => onLikes(post.id)}
          className="text-gray-500 hover:text-red-500 transition"
        >
          {post.liked ? <FaHeart /> : <FaRegHeart />} {post.likeCount}
        </button>
      </div>
    </div>
  );
};

export default PostItem;
