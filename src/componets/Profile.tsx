import { useState, useEffect, useCallback } from "react";
import PostCard from "./PostCard";
import FormToPost from "./FormToPost";
import {
  collection,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
  onSnapshot,
  getDoc,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { Post } from "./PostInterface";
import { FaUserFriends } from "react-icons/fa";
import Settings from "./Settings";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

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
  const navigate = useNavigate();

  // State hooks
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [friendCount, setFriendCount] = useState<number>(0);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);

  // Helper functions
  const convertDocToPost = useCallback(
    (doc: QueryDocumentSnapshot<DocumentData>, isOwnPost: boolean): Post => {
      const data = doc.data();
      const currentUserId = auth.currentUser?.uid;

      let likedBy: string[] = [];
      if (Array.isArray(data.likedBy)) {
        likedBy = data.likedBy;
      }

      let timestamp = data.timestamp;
      if (typeof timestamp === "number") {
        timestamp = new Date(timestamp);
      }

      return {
        id: doc.id,
        text: data.text || "",
        timestamp: timestamp,
        userId: data.userId,
        image: data.image || null,
        mediaUrl: data.mediaUrl || "",
        liked: currentUserId ? likedBy.includes(currentUserId) : false,
        likeCount: likedBy.length,
        likedBy: likedBy,
        isOwnPost,
        isFriendPost: !isOwnPost,
      };
    },
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

        return Array.from(friendsList);
      } catch {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return fetchFriendsWithRetry(retries - 1);
        }
        return [];
      }
    },
    [userId]
  );

  const fetchAllPosts = useCallback(() => {
    if (!userId) return () => {};

    const unsubscribeCallbacks: (() => void)[] = [];

    try {
      // Fetch user's own posts
      const userPostsQuery = query(
        collection(db, "posts"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(20)
      );

      const unsubscribeUserPosts = onSnapshot(
        userPostsQuery,
        (snapshot) => {
          const userPosts = snapshot.docs.map((doc) =>
            convertDocToPost(doc, true)
          );
          setPosts((prevPosts) => {
            const currentPostIds = new Set(prevPosts.map((post) => post.id));
            const newPosts = userPosts.filter(
              (post) => !currentPostIds.has(post.id)
            );
            return [...prevPosts, ...newPosts];
          });
          setLoadingPosts(false);
        },
        (error) => {
          console.error("Error fetching user posts:", error);
          setError("Failed to load posts");
          setLoadingPosts(false);
        }
      );

      unsubscribeCallbacks.push(unsubscribeUserPosts);

      // Fetch friends' posts
      const friendsQuery = query(
        collection(db, "Friends"),
        where("userId1", "in", [userId, auth.currentUser?.uid]),
        limit(100)
      );

      const unsubscribeFriends = onSnapshot(friendsQuery, async (snapshot) => {
        const friendIds = new Set<string>();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.userId1 === userId) {
            friendIds.add(data.userId2);
          } else if (data.userId2 === userId) {
            friendIds.add(data.userId1);
          }
        });

        // Fetch posts for each friend
        const friendPostsQuery = query(
          collection(db, "posts"),
          where("userId", "in", Array.from(friendIds)),
          orderBy("timestamp", "desc"),
          limit(20)
        );

        const unsubscribeFriendPosts = onSnapshot(
          friendPostsQuery,
          (friendSnapshot) => {
            const friendPosts = friendSnapshot.docs.map((doc) =>
              convertDocToPost(doc, false)
            );
            setPosts((prevPosts) => {
              const currentPostIds = new Set(prevPosts.map((post) => post.id));
              const newPosts = friendPosts.filter(
                (post) => !currentPostIds.has(post.id)
              );
              return [...prevPosts, ...newPosts];
            });
          },
          (error) => {
            console.error("Error fetching friend posts:", error);
          }
        );

        unsubscribeCallbacks.push(unsubscribeFriendPosts);
      });

      unsubscribeCallbacks.push(unsubscribeFriends);
    } catch (error) {
      console.error("Error setting up post listeners:", error);
      setError("Failed to load posts");
      setLoadingPosts(false);
    }

    return () => {
      unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
    };
  }, [userId, convertDocToPost]);

  const handleProfileUpdate = useCallback(() => {
    setPosts([]);
    setLoadingPosts(true);
    fetchAllPosts();
  }, [fetchAllPosts]);

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const checkLikeStatus = async (postId: string) => {
    if (!auth.currentUser) return false;

    try {
      const postDoc = await getDoc(doc(db, "posts", postId));
      if (!postDoc.exists()) return false;

      const data = postDoc.data();
      const likedBy = data.likedBy || [];

      return likedBy.includes(auth.currentUser.uid);
    } catch (error) {
      console.error("Error checking like status:", error);
      return false;
    }
  };

  const handleLike = async (postId: string) => {
    if (!auth.currentUser) {
      console.error("Must be logged in");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        console.error("Post not found");
        return;
      }

      const postData = postSnap.data();
      const currentUserId = auth.currentUser.uid;

      const likedBy: string[] = Array.isArray(postData.likedBy)
        ? [...postData.likedBy]
        : [];

      const isLiked = likedBy.includes(currentUserId);

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const updatedLikedBy = isLiked
              ? (post.likedBy || []).filter((id) => id !== currentUserId)
              : [...(post.likedBy || []), currentUserId];

            return {
              ...post,
              liked: !isLiked,
              likedBy: updatedLikedBy,
              likeCount: updatedLikedBy.length,
            };
          }
          return post;
        })
      );

      const updatedLikedBy = isLiked
        ? likedBy.filter((id) => id !== currentUserId)
        : [...likedBy, currentUserId];

      await updateDoc(postRef, {
        likedBy: updatedLikedBy,
        likeCount: updatedLikedBy.length,
      });
    } catch (error) {
      console.error("Error updating like:", error);

      checkLikeStatus(postId).then((actualLikeStatus) => {
        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              return { ...post, liked: actualLikeStatus };
            }
            return post;
          })
        );
      });
    }
  };

  const handleSubmit = async (
    text: string,
    imageUrl: string | null,
    spotifyUrl: string
  ) => {
    try {
      if (!auth.currentUser?.uid) {
        console.error("Not logged in");
        return;
      }

      const postData = {
        text: text || "",
        image: imageUrl,
        mediaUrl: spotifyUrl || "",
        timestamp: serverTimestamp(),
        userId: auth.currentUser.uid,
        likedBy: [],
        likeCount: 0,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "posts"), postData);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding post:", error);
      setError("Failed to add post");
    }
  };

  const syncPostsWithFirestore = useCallback(async () => {
    if (!userId || !auth.currentUser) return;

    try {
      const currentPosts = [...posts];
      const postIds = currentPosts.map((post) => post.id);

      const postsSnapshot = await Promise.all(
        postIds.map((id) => getDoc(doc(db, "posts", id)))
      );

      const updatedPosts = currentPosts.map((post, index) => {
        const docSnapshot = postsSnapshot[index];
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const likedBy = data.likedBy || [];
          const isLiked = likedBy.includes(auth.currentUser?.uid);

          if (post.liked !== isLiked || post.likeCount !== likedBy.length) {
            return {
              ...post,
              liked: isLiked,
              likeCount: likedBy.length,
              likedBy,
            };
          }
        }
        return post;
      });

      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error syncing posts:", error);
    }
  }, [posts, userId]);

  // Effect hooks
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setIsAuthorized(false);
          setIsLoadingAuth(false);
          return;
        }

        if (currentUser.uid === userId) {
          setIsAuthorized(true);
          setIsLoadingAuth(false);
          return;
        }

        // Check friendship in Friends collection
        const friendsQuery = query(
          collection(db, "Friends"),
          where("userId1", "in", [currentUser.uid, userId]),
          where("userId2", "in", [currentUser.uid, userId]),
          limit(1)
        );

        const snapshot = await getDocs(friendsQuery);
        const isFriend = !snapshot.empty;

        setIsAuthorized(isFriend);
        setIsLoadingAuth(false);
      } catch (error) {
        console.error("Error checking authorization:", error);
        setIsAuthorized(false);
        setIsLoadingAuth(false);
      }
    };

    checkAuthorization();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const friendsQuery = query(
      collection(db, "Friends"),
      where("userId1", "in", [userId, auth.currentUser?.uid]),
      limit(100)
    );

    const unsubscribeFriends = onSnapshot(friendsQuery, (snapshot) => {
      const friendSet = new Set<string>();

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.userId1 === userId) {
          friendSet.add(data.userId2);
        } else if (data.userId2 === userId) {
          friendSet.add(data.userId1);
        }
      });

      setFriendCount(friendSet.size);
    });

    return () => unsubscribeFriends();
  }, [userId]);

  useEffect(() => {
    const unsubscribe = fetchAllPosts();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchAllPosts]);

  useEffect(() => {
    const interval = setInterval(() => {
      syncPostsWithFirestore();
    }, 30000);

    return () => clearInterval(interval);
  }, [syncPostsWithFirestore]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  // Loading and authorization checks
  if (isLoadingAuth) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

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
          <div className="text-red-500 text-center">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500">No posts yet</div>
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
