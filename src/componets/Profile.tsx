import { useState, useEffect, useCallback } from "react";
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
  DocumentData,
  QueryDocumentSnapshot,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, useParams } from "react-router-dom";
import { Post } from "./PostInterface";
import { FaUserFriends } from "react-icons/fa";
import Settings from "./Settings";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const normalizeTimestamp = (
  timestamp: Timestamp | Date | string | number | null
): number => {
  if (timestamp instanceof Timestamp) return timestamp.toMillis();
  if (timestamp instanceof Date) return timestamp.getTime();
  if (typeof timestamp === "number") return timestamp;
  if (typeof timestamp === "string") return new Date(timestamp).getTime();
  return Date.now();
};

const PostSkeleton = () => (
  <div className="bg-gray-400 rounded-3xl overflow-hidden shadow-md w-full max-w-lg mb-4 animate-pulse">
    <div className="p-4 flex items-center">
      <div className="w-8 h-8 bg-gray-500 rounded-md mr-3" />
      <div className="h-4 bg-gray-500 rounded w-24" />
    </div>
    <div className="px-4 mb-4">
      <div className="h-4 bg-gray-500 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-500 rounded w-1/2" />
    </div>
    <div className="h-48 bg-gray-500 w-full" />
    <div className="px-4 py-4 flex justify-between items-center">
      <div className="w-16 h-4 bg-gray-500 rounded" />
      <div className="w-8 h-4 bg-gray-500 rounded" />
    </div>
  </div>
);

function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [friendCount, setFriendCount] = useState<number>(0);
  const navigate = useNavigate();

  // Helper function to convert Firestore doc to Post type
  const convertDocToPost = useCallback(
    (doc: QueryDocumentSnapshot<DocumentData>, isOwnPost: boolean): Post => ({
      id: doc.id,
      text: doc.data().text || "",
      timestamp: doc.data().timestamp,
      userId: doc.data().userId,
      image: doc.data().image || null,
      mediaUrl: doc.data().mediaUrl || "",
      liked: Boolean(doc.data().liked),
      likeCount: Number(doc.data().likeCount) || 0,
      isOwnPost,
      isFriendPost: !isOwnPost,
    }),
    []
  );

  const fetchFriendsWithRetry = useCallback(
    async (retries = 3): Promise<string[]> => {
      try {
        const friendsQuery1 = query(
          collection(db, "Friends"),
          where("userId1", "==", userId)
        );
        const friendsQuery2 = query(
          collection(db, "Friends"),
          where("userId2", "==", userId)
        );

        const [snapshot1, snapshot2] = await Promise.all([
          getDocs(friendsQuery1),
          getDocs(friendsQuery2),
        ]);

        const friendsList = new Set<string>();

        snapshot1.docs.forEach((doc) => {
          friendsList.add(doc.data().userId2);
        });

        snapshot2.docs.forEach((doc) => {
          friendsList.add(doc.data().userId1);
        });

        console.log(
          "Found friends in both directions:",
          Array.from(friendsList)
        );
        return Array.from(friendsList);
      } catch {
        if (retries > 0) {
          console.log(`Retrying friends fetch. Attempts left: ${retries - 1}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return fetchFriendsWithRetry(retries - 1);
        }
        return [];
      }
    },
    [userId]
  );

  // Add real-time friend count listener
  useEffect(() => {
    if (!userId) return;

    const unsubscribeFriends1 = onSnapshot(
      query(collection(db, "Friends"), where("userId1", "==", userId)),
      (snapshot1) => {
        const unsubscribeFriends2 = onSnapshot(
          query(collection(db, "Friends"), where("userId2", "==", userId)),
          (snapshot2) => {
            const totalFriends = snapshot1.size + snapshot2.size;
            setFriendCount(totalFriends);
          }
        );
        return () => unsubscribeFriends2();
      }
    );

    return () => unsubscribeFriends1();
  }, [userId]);

  // Modify fetchAllPosts to use real-time listeners
  const fetchAllPosts = useCallback(async () => {
    if (!userId) return;

    try {
      // Set up real-time listener for user's posts
      const userPostsQuery = query(
        collection(db, "posts"),
        where("userId", "==", userId)
      );

      const unsubscribeUserPosts = onSnapshot(
        userPostsQuery,
        async (userPostsSnapshot) => {
          const userPosts = userPostsSnapshot.docs.map((doc) =>
            convertDocToPost(doc, true)
          );

          // Get friends list and set up listeners for their posts
          const friendsList = await fetchFriendsWithRetry();

          const friendsPostsPromises = friendsList.map((friendId) => {
            const friendPostsQuery = query(
              collection(db, "posts"),
              where("userId", "==", friendId)
            );

            return new Promise<Post[]>((resolve) => {
              onSnapshot(friendPostsQuery, (friendPostsSnapshot) => {
                const friendPosts = friendPostsSnapshot.docs.map((doc) =>
                  convertDocToPost(doc, false)
                );
                resolve(friendPosts);
              });
            });
          });

          const friendsPostsArrays = await Promise.all(friendsPostsPromises);
          const friendsPosts = friendsPostsArrays.flat();

          const allPosts = [...userPosts, ...friendsPosts].sort(
            (a: Post, b: Post) => {
              const timeA = normalizeTimestamp(a.timestamp);
              const timeB = normalizeTimestamp(b.timestamp);
              return timeB - timeA;
            }
          );

          setPosts(allPosts);
          setLoadingPosts(false);
        }
      );

      return () => {
        unsubscribeUserPosts();
      };
    } catch (error) {
      console.error("Error setting up real-time posts:", error);
      setError("Failed to load posts");
      setLoadingPosts(false);
    }
  }, [userId, fetchFriendsWithRetry, convertDocToPost]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  // Add this function to handle profile updates
  const handleProfileUpdate = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoadingPosts(false);
      setError("No user ID provided");
      return;
    }

    console.log("Starting posts fetch for user:", userId);
    setLoadingPosts(true);
    fetchAllPosts();
  }, [userId, fetchAllPosts, refreshTrigger]); // Add refreshTrigger to dependencies

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
    <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6 relative">
      <button
        onClick={() => navigate("/follow-system")}
        className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-green-300 mt-0 flex items-center gap-2"
      >
        <FaUserFriends />
        <span className="text-sm font-medium">{friendCount}</span>
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
          onProfileUpdate={handleProfileUpdate}
        />
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center transition-all transform hover:scale-110 z-50"
      >
        <IoMdAdd className="text-2xl" />
      </button>

      {showForm && (
        <FormToPost
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}

      <div className="w-full max-w-2xl mt-6 space-y-4">
        {loadingPosts ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
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
