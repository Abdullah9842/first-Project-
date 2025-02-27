import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import FormToPost from "./FormToPost";
import {
  addDoc,
  collection,
  query,
  where,
  limit,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import Settings from "./Settings";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, useParams } from "react-router-dom";
import { Post } from "./PostInterface";
import { FaUserFriends } from "react-icons/fa";
import PostSkeleton from "./PostSkeleton";
import { Timestamp } from "firebase/firestore";

interface User {
  name: string;
  username: string;
  photoURL: string;
  // ... أي خصائص أخرى للمستخدم
}

function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [friendsCount, setFriendsCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          console.log("Fetching data for user:", user.uid);

          // جلب بيانات الأصدقاء
          const friendsQuery1 = query(
            collection(db, "Friends"),
            where("userId1", "==", user.uid)
          );
          const friendsQuery2 = query(
            collection(db, "Friends"),
            where("userId2", "==", user.uid)
          );

          const [friendsSnapshot1, friendsSnapshot2] = await Promise.all([
            getDocs(friendsQuery1),
            getDocs(friendsQuery2),
          ]);

          const friendsList = [
            ...friendsSnapshot1.docs.map((doc) => ({
              userId: doc.data().userId2,
              friendshipDate: doc.data().friendshipDate || 0,
            })),
            ...friendsSnapshot2.docs.map((doc) => ({
              userId: doc.data().userId1,
              friendshipDate: doc.data().friendshipDate || 0,
            })),
          ];

          console.log("All friends list:", friendsList);
          setFriendsCount(friendsList.length); // تحديث عدد الأصدقاء

          // جلب المنشورات
          const postsQuery = query(
            collection(db, "Posts"),
            where("userId", "in", [
              user.uid,
              ...friendsList.map((friend) => friend.userId),
            ]),
            orderBy("timestamp", "desc"),
            limit(10)
          );

          const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
            const postsData = snapshot.docs
              .map((doc) => {
                const postData = doc.data();
                const postTimestamp = postData.timestamp
                  ? typeof postData.timestamp.toMillis === "function"
                    ? postData.timestamp.toMillis()
                    : postData.timestamp
                  : 0;

                // إذا كان المنشور للمستخدم نفسه، اعرضه دائماً
                if (postData.userId === user.uid) {
                  return {
                    id: doc.id,
                    image: postData.image || null,
                    text: postData.text,
                    liked: postData.liked || false,
                    likeCount: postData.likeCount || 0,
                    mediaUrl: postData.mediaUrl,
                    userId: postData.userId || "",
                    timestamp: postTimestamp,
                  };
                }

                // للأصدقاء، تحقق من تاريخ المنشور مقارنة بتاريخ الصداقة
                const friend = friendsList.find(
                  (f) => f.userId === postData.userId
                );

                if (friend) {
                  // تحويل تاريخ الصداقة إلى milliseconds
                  const friendshipTimestamp =
                    friend.friendshipDate instanceof Timestamp
                      ? friend.friendshipDate.toMillis()
                      : friend.friendshipDate;

                  // مقارنة التواريخ بعد تحويلها إلى milliseconds
                  if (postTimestamp >= friendshipTimestamp) {
                    return {
                      id: doc.id,
                      image: postData.image || null,
                      text: postData.text,
                      liked: postData.liked || false,
                      likeCount: postData.likeCount || 0,
                      mediaUrl: postData.mediaUrl,
                      userId: postData.userId || "",
                      timestamp: postTimestamp,
                    };
                  }
                }

                return null; // تجاهل المنشورات التي لا تحقق الشروط
              })
              .filter((post) => post !== null);

            console.log("Filtered posts:", postsData);
            setPosts(postsData);
            setLoadingPosts(false);
          });

          return () => unsubscribe(); // Cleanup function
        } catch (error) {
          console.error("Error fetching data: ", error);
          setError("Failed to load posts. Please try again later.");
          setLoadingPosts(false);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        const userDoc = await getDoc(doc(db, "Users", userId));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSubmit = async (
    text: string,
    image: string | null,
    mediaUrl: string
  ) => {
    try {
      const newPost = {
        text,
        image,
        mediaUrl,
        liked: false,
        likeCount: 0,
        timestamp: Date.now(),
        userId: auth.currentUser?.uid || "",
      };

      await addDoc(collection(db, "Posts"), newPost);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Posts", id));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const postRef = doc(db, "Posts", id);
      const post = posts.find((post) => post.id === id);

      if (post) {
        const newLikedState = !post.liked;
        const newLikeCount = newLikedState
          ? post.likeCount + 1
          : post.likeCount - 1;

        await updateDoc(postRef, {
          liked: newLikedState,
          likeCount: newLikeCount,
        });

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id
              ? { ...post, liked: newLikedState, likeCount: newLikeCount }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error updating like: ", error);
    }
  };

  if (loading) {
    return <PostSkeleton />;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
      <button
        onClick={() => navigate("/follow-system")}
        className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-green-300 mt-0 flex items-center gap-2"
      >
        <FaUserFriends />
        <p>{friendsCount}</p>
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
        className="bg-blue-500 z-10 text-white px-4 py-2 rounded-full hover:bg-blue-300 fixed bottom-5 right-6 transition mb-5"
        onClick={() => setShowForm(true)}
      >
        +
      </button>

      {showForm && (
        <FormToPost
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="mt-30 w-full flex flex-col items-center gap-4">
        {loadingPosts ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : error ? (
          <div className="text-red-500 text-lg">{error}</div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10">
            <p className="text-gray-600 text-lg mb-4">لا توجد منشورات بعد.</p>
          </div>
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
