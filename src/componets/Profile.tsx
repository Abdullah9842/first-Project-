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
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.log("No authenticated user found");
        setLoadingPosts(false);
        return;
      }

      try {
        console.log("Starting data fetch for user:", user.uid);

        // جلب بيانات الأصدقاء
        const friendsQuery1 = query(
          collection(db, "Friends"),
          where("userId1", "==", user.uid)
        );
        const friendsQuery2 = query(
          collection(db, "Friends"),
          where("userId2", "==", user.uid)
        );

        console.log("Fetching friends data...");
        const [friendsSnapshot1, friendsSnapshot2] = await Promise.all([
          getDocs(friendsQuery1).catch((error) => {
            console.error("Error fetching friends query 1:", error);
            return { docs: [] };
          }),
          getDocs(friendsQuery2).catch((error) => {
            console.error("Error fetching friends query 2:", error);
            return { docs: [] };
          }),
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

        console.log("Friends list fetched:", friendsList);
        setFriendsCount(friendsList.length);

        // جلب المنشورات
        const userAndFriendIds = [
          user.uid,
          ...friendsList.map((friend) => friend.userId),
        ];
        console.log("Fetching posts for users:", userAndFriendIds);

        if (userAndFriendIds.length === 0) {
          console.log("No users to fetch posts for");
          setLoadingPosts(false);
          return;
        }

        const postsQuery = query(
          collection(db, "Posts"),
          where("userId", "in", userAndFriendIds),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        const unsubscribe = onSnapshot(
          postsQuery,
          (snapshot) => {
            console.log(
              "Posts snapshot received, docs count:",
              snapshot.docs.length
            );
            const postsData = snapshot.docs
              .map((doc) => {
                try {
                  const postData = doc.data();
                  const postTimestamp = postData.timestamp
                    ? typeof postData.timestamp.toMillis === "function"
                      ? postData.timestamp.toMillis()
                      : postData.timestamp
                    : 0;

                  console.log("Post data:", {
                    id: doc.id,
                    userId: postData.userId,
                    currentUser: user.uid,
                    isCurrentUser: postData.userId === user.uid,
                  });

                  // إذا كان المنشور للمستخدم نفسه، اعرضه دائماً
                  if (postData.userId === user.uid) {
                    console.log("✅ Showing current user post:", doc.id);
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
                    const friendshipTimestamp =
                      friend.friendshipDate instanceof Timestamp
                        ? friend.friendshipDate.toMillis()
                        : friend.friendshipDate;

                    console.log("Comparing timestamps:", {
                      postId: doc.id,
                      postTimestamp,
                      friendshipTimestamp,
                      shouldShow: postTimestamp >= friendshipTimestamp,
                    });

                    if (postTimestamp >= friendshipTimestamp) {
                      console.log("Showing friend post:", doc.id);
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

                  console.log("Filtering out post:", doc.id);
                  return null;
                } catch (error) {
                  console.error("Error processing post doc:", error);
                  return null;
                }
              })
              .filter((post) => post !== null);

            console.log("Filtered posts count:", postsData.length);
            setPosts(postsData);
            setLoadingPosts(false);
          },
          (error) => {
            console.error("Error in posts snapshot:", error);
            setError("Failed to load posts. Please try again later.");
            setLoadingPosts(false);
          }
        );

        return () => {
          console.log("Cleaning up posts subscription");
          unsubscribe();
        };
      } catch (error) {
        console.error("Error in fetchData:", error);
        setError("Failed to load posts. Please try again later.");
        setLoadingPosts(false);
      }
    };

    fetchData();
  }, []);

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
