import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import FormToPost from "./FormToPost";
import {
  collection,
  query,
  where,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, useParams } from "react-router-dom";
import { Post } from "./PostInterface";
import { FaUserFriends } from "react-icons/fa";
import Settings from "./Settings";
import { MdOutlineSettingsSuggest } from "react-icons/md";

const normalizeTimestamp = (
  timestamp: Timestamp | Date | string | number | null
): number => {
  if (timestamp instanceof Timestamp) return timestamp.toMillis();
  if (timestamp instanceof Date) return timestamp.getTime();
  if (typeof timestamp === "number") return timestamp;
  if (typeof timestamp === "string") return new Date(timestamp).getTime();
  return Date.now();
};

function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoadingPosts(false);
      setError("No user ID provided");
      return;
    }

    console.log("Starting posts fetch for user:", userId);
    setLoadingPosts(true);

    const fetchAllPosts = async () => {
      try {
        // 1. First fetch user's own posts
        const userPostsQuery = query(
          collection(db, "posts"),
          where("userId", "==", userId)
        );
        const userPostsSnapshot = await getDocs(userPostsQuery);
        const userPosts = userPostsSnapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text || "",
          timestamp: doc.data().timestamp,
          userId: doc.data().userId,
          image: doc.data().image || null,
          mediaUrl: doc.data().mediaUrl || "",
          liked: Boolean(doc.data().liked),
          likeCount: Number(doc.data().likeCount) || 0,
          isOwnPost: true,
          isFriendPost: false,
        }));

        // 2. Fetch friends list
        const friendsQuery = query(
          collection(db, "Friends"),
          where("userId1", "==", userId)
        );
        const friendsSnapshot = await getDocs(friendsQuery);
        const friendsList = friendsSnapshot.docs.map(
          (doc) => doc.data().userId2
        );

        console.log("Friends list:", friendsList);

        // 3. Fetch friends' posts
        const friendsPosts = [];
        for (const friendId of friendsList) {
          try {
            const friendPostsQuery = query(
              collection(db, "posts"),
              where("userId", "==", friendId)
            );
            const friendPostsSnapshot = await getDocs(friendPostsQuery);
            const posts = friendPostsSnapshot.docs.map((doc) => ({
              id: doc.id,
              text: doc.data().text || "",
              timestamp: doc.data().timestamp,
              userId: doc.data().userId,
              image: doc.data().image || null,
              mediaUrl: doc.data().mediaUrl || "",
              liked: Boolean(doc.data().liked),
              likeCount: Number(doc.data().likeCount) || 0,
              isOwnPost: false,
              isFriendPost: true,
            }));
            friendsPosts.push(...posts);
          } catch (error) {
            console.error(
              `Error fetching posts for friend ${friendId}:`,
              error
            );
          }
        }

        // 4. Combine and sort all posts
        const allPosts = [...userPosts, ...friendsPosts].sort((a, b) => {
          const timeA = normalizeTimestamp(a.timestamp);
          const timeB = normalizeTimestamp(b.timestamp);
          return timeB - timeA;
        });

        console.log("Total posts fetched:", allPosts.length);
        setPosts(allPosts);
        setLoadingPosts(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts");
        setLoadingPosts(false);
      }
    };

    fetchAllPosts();

    // No need for cleanup function as we're not using real-time listeners
    return () => {};
  }, [userId]);

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const postRef = doc(db, "posts", postId);
      const post = posts.find((p) => p.id === postId);
      if (post) {
        const newLikedState = !post.liked;
        await updateDoc(postRef, {
          liked: newLikedState,
          likeCount: newLikedState ? post.likeCount + 1 : post.likeCount - 1,
        });
      }
    } catch (error) {
      console.error("Error updating like: ", error);
    }
  };

  const handleSubmit = async (
    text: string,
    imageUrl: string | null,
    spotifyUrl: string,
    audioUrl: string | null,
    timestamp: number
  ) => {
    try {
      if (!auth.currentUser?.uid) {
        console.error("No user logged in");
        return;
      }

      // إضافة المنشور الجديد إلى قاعدة البيانات
      await addDoc(collection(db, "posts"), {
        text,
        image: imageUrl,
        mediaUrl: spotifyUrl,
        audioUrl,
        timestamp: Timestamp.fromMillis(timestamp),
        userId: auth.currentUser.uid,
        liked: false,
        likeCount: 0,
        createdAt: Timestamp.now(),
      });

      console.log("Post added successfully!");
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
      <button
        onClick={() => navigate("/follow-system")}
        className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-green-300 mt-0 flex items-center gap-2"
      >
        <FaUserFriends />
      </button>

      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 left-4 text-gray-600 px-4 py-2 rounded-full hover:bg-blue-600 transition"
      >
        <MdOutlineSettingsSuggest className="text-2xl" />
      </button>

      {showSettings && auth.currentUser?.uid && (
        <Settings
          userId={auth.currentUser.uid}
          onClose={() => setShowSettings(false)}
          handleLogout={handleLogout}
        />
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 mt-4"
      >
        {showForm ? "إلغاء" : "إنشاء منشور جديد"}
      </button>

      {showForm && (
        <FormToPost
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}

      <div className="w-full max-w-2xl mt-6 space-y-4">
        {loadingPosts ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500">لا توجد منشورات</div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onLike={handleLike}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
