import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import FormToPost from "./FormToPost";
import {
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  getDoc,
  setDoc,
  Timestamp,
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
import { normalizeTimestamp } from "./PostInterface";

interface User {
  userId: string;
  name: string;
  email?: string;
  photoURL: string;
  username: string;
  createdAt?: Timestamp;
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
    const fetchFriendsCount = async () => {
      if (!userId) return;

      try {
        const friendsQuery = query(
          collection(db, "Friends"),
          where("userId1", "==", userId)
        );

        const friendsSnapshot = await getDocs(friendsQuery);
        setFriendsCount(friendsSnapshot.size);
      } catch (error) {
        console.error("Error fetching friends count:", error);
      }
    };

    fetchFriendsCount();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoadingPosts(false);
        return;
      }

      try {
        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", userId),
          orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
          const postsData: Post[] = snapshot.docs.map((doc) => {
            const data = doc.data();

            const post: Post = {
              id: doc.id,
              text: data.text || "",
              timestamp: normalizeTimestamp(data.timestamp),
              userId: data.userId || "",
              image: data.image || null,
              mediaUrl: data.mediaUrl || "",
              liked: Boolean(data.liked),
              likeCount: Number(data.likeCount) || 0,
              isOwnPost: data.userId === userId,
              isFriendPost: false,
            };

            return post;
          });

          setPosts(postsData);
          setLoadingPosts(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts");
        setLoadingPosts(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        console.log("No userId provided");
        setLoading(false);
        return;
      }

      try {
        // تحقق من وجود المستخدم في Authentication
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log("No authenticated user");
          navigate("/login");
          return;
        }

        // جلب بيانات المستخدم من مجموعة Users
        const userDoc = await getDoc(doc(db, "Users", currentUser.uid));

        if (!userDoc.exists()) {
          // إذا لم يكن المستخدم موجوداً في مجموعة Users، قم بإنشائه
          const newUser = {
            userId: currentUser.uid,
            name: currentUser.displayName || "مستخدم جديد",
            email: currentUser.email,
            photoURL: currentUser.photoURL || "/default-avatar.png",
            username: currentUser.email?.split("@")[0] || "user" + Date.now(),
            createdAt: Timestamp.now(),
          };

          // إضافة المستخدم إلى مجموعة Users
          await setDoc(doc(db, "Users", currentUser.uid), newUser);
          setUser(newUser as User);
        } else {
          // إذا كان المستخدم موجوداً، استخدم بياناته
          setUser(userDoc.data() as User);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

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
