import React, { useState, useEffect, useCallback } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { deleteDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import "../index.css";

interface Users {
  id: string;
  name: string;
  photoURL: string;
}

interface Post {
  id: string;
  // content: string;
  text?: string;
  timestamp: Timestamp | Date | string;
  userId: string;
  image: string | null;
  liked: boolean;
  likeCount: number;
  mediaUrl?: string;
}

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
}

const DEFAULT_AVATAR = "/default-avatar.png";
const DEFAULT_NAME = "Unknown User";

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onLike }) => {
  const [userData, setUserData] = useState<Users | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // استخدام useCallback لمنع إعادة إنشاء الدالة في كل render
  const fetchUserData = useCallback(async () => {
    if (!post?.userId) {
      setIsLoading(false);
      return;
    }

    // تحقق من وجود البيانات في الذاكرة المؤقتة
    const cachedData = sessionStorage.getItem(`user_${post.userId}`);
    if (cachedData) {
      setUserData(JSON.parse(cachedData));
      setIsLoading(false);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "Users", post.userId));

      if (!userDoc.exists()) {
        setIsLoading(false);
        return;
      }

      const data = userDoc.data();

      // إضافة القيم الافتراضية إذا كانت البيانات غير كاملة
      const userData = {
        id: userDoc.id,
        name: data?.name || DEFAULT_NAME,
        photoURL: data?.photoURL || DEFAULT_AVATAR,
      };

      // تخزين البيانات في الذاكرة المؤقتة
      sessionStorage.setItem(`user_${post.userId}`, JSON.stringify(userData));
      setUserData(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Error fetching user data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [post?.userId]);

  // تخزين مؤقت للصور التي فشل تحميلها
  const [failedImages] = useState(new Set<string>());

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.target as HTMLImageElement;
    const originalSrc = img.src;

    if (!failedImages.has(originalSrc)) {
      failedImages.add(originalSrc);
      img.src = DEFAULT_AVATAR;
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const postDocRef = doc(db, "Posts", id);
      await deleteDoc(postDocRef);
      onDelete(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting document:", error.message);
        setError("Failed to delete post");
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (isLoading) {
    return (
      <div className="bg-gray-400 rounded-3xl overflow-hidden shadow-md w-full max-w-lg mb-4 animate-pulse">
        <div className="p-4 flex items-center">
          {/* Profile Image Skeleton */}
          <div className="w-8 h-8 rounded-md bg-gray-500 mr-3 flex-shrink-0" />

          {/* Name Skeleton */}
          <div className="h-4 bg-gray-500 rounded w-24" />
        </div>

        {/* Content Skeleton */}
        <div className="px-4 mb-4">
          <div className="h-4 bg-gray-500 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-500 rounded w-1/2" />
        </div>

        {/* Actions Skeleton */}
        <div className="px-4 py-4 flex justify-between items-center">
          <div className="w-16 h-4 bg-gray-500 rounded" />
          <div className="w-8 h-4 bg-gray-500 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>; // عرض رسالة الخطأ
  }

  return (
    <div className="bg-gray-400 rounded-3xl overflow-hidden shadow-md w-full max-w-lg mb-4">
      <div className="p-4 flex items-center">
        {/* Profile Image */}
        <div className="w-8 h-8 rounded-md overflow-hidden mr-3 flex-shrink-0">
          {!isLoading && userData?.photoURL && (
            <img
              src={userData.photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          )}
        </div>

        {/* User Name */}
        <span className="text-lg font-medium truncate">
          {isLoading ? "Loading..." : error ? "Unknown User" : userData?.name}
        </span>
      </div>

      {/* Content */}
      {post.text && (
        <div className="px-4 mb-4">
          <p className="text-white">{post.text}</p>
        </div>
      )}

      {/* Media */}
      {post.image && (
        <div className="w-full">
          <img src={post.image} alt="Post content" className="w-full" />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-4 flex justify-between items-center">
        <button
          onClick={() => onLike(post.id)}
          className="flex items-center text-white"
        >
          {post.liked ? <FaHeart /> : <FaRegHeart />}
          <span className="ml-2">{post.likeCount}</span>
        </button>

        <button onClick={() => handleDelete(post.id)} className="text-white">
          <AiFillDelete />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
