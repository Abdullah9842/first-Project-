import React, { useState, useEffect, useCallback } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
  collection,
  addDoc,
  arrayRemove,
  arrayUnion,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import MediaHandling from "./MediaHandling";
import "../index.css";
import defaultAvatar from "../assets/pngtree-cat-default-avatar-image_2246581.jpg";
import { useTranslation } from "react-i18next";
import { auth } from "./firebase";

interface Users {
  id: string;
  name: string;
  photoURL: string;
}

interface Post {
  id: string;
  text?: string;
  timestamp: Timestamp | Date | string;
  userId: string;
  image: string | null;
  liked: boolean;
  likeCount: number;
  mediaUrl?: string;
  likedBy?: string[];
}

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
}

const DEFAULT_AVATAR = defaultAvatar;
const DEFAULT_NAME = "Unknown User";

// إضافة دالة للتحقق من نوع النص
const isArabicText = (text: string) => {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
};

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onLike }) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<Users | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = auth.currentUser;

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
      const postDocRef = doc(db, "posts", id);
      await deleteDoc(postDocRef);
      onDelete(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting document:", error.message);
        setError("Failed to delete post");
      }
    }
  };

  const fetchUserData = useCallback(async () => {
    if (!post?.userId) {
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
      const userData = {
        id: userDoc.id,
        name: data?.name || DEFAULT_NAME,
        photoURL: data?.photoURL || DEFAULT_AVATAR,
      };

      setUserData(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Error fetching user data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [post?.userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData, post.userId]); // Add post.userId to dependencies

  const handleLike = async (postId: string) => {
    try {
      if (!currentUser) {
        console.log("لم يتم تسجيل الدخول");
        return;
      }

      const postRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        console.error("المنشور غير موجود");
        return;
      }

      const postData = postDoc.data();
      const currentLikes = postData.likedBy || [];
      const isLiked = currentLikes.includes(currentUser.uid);

      // تحديث حالة الإعجاب محلياً أولاً
      onLike(postId);

      try {
        // تحديث Firestore
        await updateDoc(postRef, {
          likedBy: isLiked
            ? arrayRemove(currentUser.uid)
            : arrayUnion(currentUser.uid),
          likeCount: increment(isLiked ? -1 : 1),
        });

        // إضافة إشعار فقط عند الإعجاب (وليس عند إلغاء الإعجاب)
        if (!isLiked && postData.userId !== currentUser.uid) {
          const notificationRef = collection(db, "Notifications");
          await addDoc(notificationRef, {
            type: "like",
            postId,
            postText: postData.text || "",
            fromUserId: currentUser.uid,
            fromUserName: currentUser.displayName || "مستخدم",
            fromUserPhoto: currentUser.photoURL,
            toUserId: postData.userId,
            timestamp: serverTimestamp(),
            read: false,
            createdAt: serverTimestamp(),
          });

          const userRef = doc(db, "Users", postData.userId);
          await updateDoc(userRef, {
            unreadNotifications: increment(1),
          });
        }
      } catch (error) {
        // إذا فشلت العملية، نعيد الحالة المحلية
        onLike(postId);
        console.error("خطأ في تحديث الإعجاب:", error);
      }
    } catch (error) {
      console.error("خطأ في معالجة الإعجاب:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-400 rounded-l-md overflow-hidden shadow-md w-full max-w-lg mb-4 animate-pulse">
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
    return (
      <div className="text-center py-4 text-red-500">{t("error.occurred")}</div>
    );
  }

  return (
    <div className="bg-gray-400 rounded-3xl overflow-hidden shadow-md w-full max-w-lg mb-4">
      <div className="p-4 flex items-center" style={{ direction: "ltr" }}>
        <div className="w-9 h-9 rounded-full overflow-hidden mr-3 flex-shrink-0">
          {!isLoading && userData?.photoURL && (
            <img
              src={userData.photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          )}
        </div>
        <span className="text-lg text-white font-medium truncate">
          {isLoading ? "Loading..." : error ? "Unknown User" : userData?.name}
        </span>
      </div>

      {post.image && (
        <div className="w-full">
          <img src={post.image} alt="Post content" className="w-full" />
        </div>
      )}

      {post.text && (
        <div className="px-4 mt-5 mb-4">
          <p
            className="text-white"
            style={{
              direction: isArabicText(post.text) ? "rtl" : "ltr",
              textAlign: isArabicText(post.text) ? "right" : "left",
            }}
          >
            {post.text}
          </p>
        </div>
      )}

      {post.mediaUrl && (
        <div className="px-2 mb-2">
          <MediaHandling spotifyUrl={post.mediaUrl} />
        </div>
      )}

      <div
        className="px-4 py-2 flex justify-between items-center"
        style={{ direction: "ltr" }}
      >
        <button
          onClick={() => handleLike(post.id)}
          className="flex items-center text-white"
          aria-label={t("profile.like")}
        >
          {post.liked ? <FaHeart /> : <FaRegHeart />}
          <span className="ml-2">{post.likeCount}</span>
        </button>

        {currentUser && post.userId === currentUser.uid && (
          <button
            onClick={() => handleDelete(post.id)}
            className="text-white"
            aria-label={t("profile.delete")}
          >
            <AiFillDelete />
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
