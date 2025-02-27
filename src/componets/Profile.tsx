import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import FormToPost from "./FormToPost";
import {
  collection,
  query,
  where,
  onSnapshot,
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
      return;
    }

    console.log("Starting posts fetch for user:", userId);

    // 1. جلب منشورات المستخدم أولاً
    const userPostsQuery = query(
      collection(db, "posts"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      userPostsQuery,
      async (snapshot) => {
        console.log(`Received ${snapshot.docs.length} user posts`);

        // تجهيز منشورات المستخدم
        const userPosts = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text || "",
            timestamp: data.timestamp,
            userId: data.userId,
            image: data.image || null,
            mediaUrl: data.mediaUrl || "",
            liked: Boolean(data.liked),
            likeCount: Number(data.likeCount) || 0,
            isOwnPost: true,
            isFriendPost: false,
          };
        });

        // 2. جلب قائمة الأصدقاء
        try {
          const friendsQuery = query(
            collection(db, "Friends"),
            where("userId1", "==", userId)
          );
          const friendsSnapshot = await getDocs(friendsQuery);
          const friendsList = friendsSnapshot.docs.map(
            (doc) => doc.data().userId2
          );

          console.log("Friends list:", friendsList);

          // 3. جلب منشورات الأصدقاء إذا وجدوا
          if (friendsList.length > 0) {
            const friendsPostsQuery = query(
              collection(db, "posts"),
              where("userId", "in", friendsList)
            );

            const friendsPostsSnapshot = await getDocs(friendsPostsQuery);
            const friendsPosts = friendsPostsSnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                text: data.text || "",
                timestamp: data.timestamp,
                userId: data.userId,
                image: data.image || null,
                mediaUrl: data.mediaUrl || "",
                liked: Boolean(data.liked),
                likeCount: Number(data.likeCount) || 0,
                isOwnPost: false,
                isFriendPost: true,
              };
            });

            // 4. دمج وترتيب جميع المنشورات
            const allPosts = [...userPosts, ...friendsPosts];
            allPosts.sort((a, b) => {
              const timeA = normalizeTimestamp(a.timestamp);
              const timeB = normalizeTimestamp(b.timestamp);
              return timeB - timeA;
            });

            console.log(
              `Total posts after adding friends' posts: ${allPosts.length}`
            );
            setPosts(allPosts);
          } else {
            // إذا لم يكن هناك أصدقاء، نعرض منشورات المستخدم فقط
            userPosts.sort((a, b) => {
              const timeA = normalizeTimestamp(a.timestamp);
              const timeB = normalizeTimestamp(b.timestamp);
              return timeB - timeA;
            });
            setPosts(userPosts);
          }
        } catch (error) {
          console.error("Error fetching friends posts:", error);
          // في حالة الخطأ، نعرض منشورات المستخدم على الأقل
          setPosts(userPosts);
        }

        setLoadingPosts(false);
      },
      (error) => {
        console.error("Error fetching user posts:", error);
        setError("Failed to load posts");
        setLoadingPosts(false);
      }
    );

    return () => unsubscribe();
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
