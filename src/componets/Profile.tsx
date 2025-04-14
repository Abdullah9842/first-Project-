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
  getDoc,
  serverTimestamp,
  orderBy,
  limit,
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
    (doc: QueryDocumentSnapshot<DocumentData>, isOwnPost: boolean): Post => {
      const data = doc.data();
      const currentUserId = auth.currentUser?.uid;

      // التأكد من أن likedBy موجودة قبل استخدامها
      let likedBy: string[] = [];
      if (Array.isArray(data.likedBy)) {
        likedBy = data.likedBy;
      }

      // تحويل timestamp إلى النوع المناسب إذا كان رقم
      let timestamp = data.timestamp;
      if (typeof timestamp === "number") {
        timestamp = new Date(timestamp);
      }

      return {
        id: doc.id,
        text: data.text || "",
        timestamp: timestamp, // استخدام القيمة المحولة
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

  // تحسين دالة جلب الأصدقاء
  useEffect(() => {
    if (!userId) return;

    // استخدام حل أكثر كفاءة مع batch
    const friendsQuery = query(
      collection(db, "Friends"),
      where("userId1", "in", [userId, auth.currentUser?.uid]),
      limit(100)
    );

    const unsubscribeFriends = onSnapshot(friendsQuery, (snapshot) => {
      // تخزين الأصدقاء في مجموعة لتجنب التكرار
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

  // تحسين دالة fetchAllPosts
  const fetchAllPosts = useCallback(() => {
    if (!userId) return () => {};

    const unsubscribeCallbacks: (() => void)[] = [];

    try {
      // 1. جلب منشورات المستخدم
      const userPostsQuery = query(
        collection(db, "posts"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(20)
      );

      const unsubscribeUserPosts = onSnapshot(
        userPostsQuery,
        (snapshot) => {
          console.log(`Fetched ${snapshot.docs.length} posts for current user`);

          const userPosts = snapshot.docs.map((doc) =>
            convertDocToPost(doc, true)
          );

          // استخدام معرف للمنشورات الحالية للتحقق من التكرار
          const currentPostIds = new Set(userPosts.map((post) => post.id));

          setPosts((prevPosts) => {
            // الاحتفاظ فقط بمنشورات الأصدقاء من الحالة السابقة
            const friendPosts = prevPosts.filter(
              (post) => !currentPostIds.has(post.id) && post.userId !== userId
            );

            return [...userPosts, ...friendPosts].sort((a, b) => {
              const timeA = normalizeTimestamp(a.timestamp);
              const timeB = normalizeTimestamp(b.timestamp);
              return timeB - timeA;
            });
          });

          setLoadingPosts(false);
        },
        (error) => {
          console.error("Error fetching user posts:", error);
          setLoadingPosts(false);
        }
      );

      unsubscribeCallbacks.push(unsubscribeUserPosts);

      // 2. جلب منشورات الأصدقاء
      fetchFriendsWithRetry().then((friendIds) => {
        console.log("Got friend IDs:", friendIds);

        // إذا لم يكن هناك أصدقاء
        if (friendIds.length === 0) {
          return;
        }

        // جلب منشورات الأصدقاء (حد أقصى 10 أصدقاء في كل مرة للأداء)
        const friendBatches = [];
        for (let i = 0; i < friendIds.length; i += 10) {
          friendBatches.push(friendIds.slice(i, i + 10));
        }

        friendBatches.forEach((batch) => {
          // استخدام استعلام مركب للحصول على منشورات كل الأصدقاء في دفعة واحدة
          const friendsPostsQuery = query(
            collection(db, "posts"),
            where("userId", "in", batch),
            orderBy("timestamp", "desc"),
            limit(50)
          );

          const unsubscribeFriendsPosts = onSnapshot(
            friendsPostsQuery,
            (snapshot) => {
              console.log(
                `Fetched ${snapshot.docs.length} posts for ${batch.length} friends`
              );

              const newFriendPosts = snapshot.docs.map((doc) =>
                convertDocToPost(doc, false)
              );
              const friendPostIds = new Set(
                newFriendPosts.map((post) => post.id)
              );

              setPosts((prevPosts) => {
                // حذف المنشورات القديمة التي تم استبدالها
                const otherPosts = prevPosts.filter(
                  (post) =>
                    !friendPostIds.has(post.id) && !batch.includes(post.userId)
                );

                return [...otherPosts, ...newFriendPosts].sort((a, b) => {
                  const timeA = normalizeTimestamp(a.timestamp);
                  const timeB = normalizeTimestamp(b.timestamp);
                  return timeB - timeA;
                });
              });
            },
            (error) => {
              console.error("Error fetching friends posts:", error);
            }
          );

          unsubscribeCallbacks.push(unsubscribeFriendsPosts);
        });
      });

      return () => {
        unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
      };
    } catch (error) {
      console.error("Error setting up post listeners:", error);
      setLoadingPosts(false);
      setError("حدث خطأ في تحميل المنشورات");
      return () => {};
    }
  }, [userId, convertDocToPost, fetchFriendsWithRetry]);

  useEffect(() => {
    if (!userId) {
      setLoadingPosts(false);
      setError("No user ID provided");
      return;
    }

    if (!auth.currentUser) {
      setLoadingPosts(false);
      setError("User not authenticated");
      return;
    }

    console.log("Current user:", auth.currentUser.uid);
    console.log("Fetching posts for user:", userId);

    setLoadingPosts(true);
    const unsubscribe = fetchAllPosts();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, fetchAllPosts, refreshTrigger]);

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

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  // دالة مساعدة للتأكد من حالة اللايك
  const checkLikeStatus = async (postId: string) => {
    if (!auth.currentUser) return false;

    try {
      const postDoc = await getDoc(doc(db, "posts", postId));
      if (!postDoc.exists()) return false;

      const data = postDoc.data();
      const likedBy = data.likedBy || [];

      console.log("حالة اللايك:", {
        postId,
        likedBy,
        isLiked: likedBy.includes(auth.currentUser.uid),
        likeCount: likedBy.length,
        currentUser: auth.currentUser.uid,
      });

      return likedBy.includes(auth.currentUser.uid);
    } catch (error) {
      console.error("خطأ في التحقق من حالة اللايك:", error);
      return false;
    }
  };

  // استدعاء الدالة بعد عملية اللايك
  const handleLike = async (postId: string) => {
    if (!auth.currentUser) {
      console.error("يجب تسجيل الدخول");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        console.error("المنشور غير موجود");
        return;
      }

      const postData = postSnap.data();
      const currentUserId = auth.currentUser.uid;

      // تأكد من أن likedBy موجود دائماً كمصفوفة
      const likedBy: string[] = Array.isArray(postData.likedBy)
        ? [...postData.likedBy]
        : [];

      // تحقق من حالة الإعجاب
      const isLiked = likedBy.includes(currentUserId);

      // تحديث UI أولاً للاستجابة السريعة
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

      // تحديث Firestore بطريقة مباشرة بدون استخدام arrayUnion/arrayRemove
      const updatedLikedBy = isLiked
        ? likedBy.filter((id) => id !== currentUserId)
        : [...likedBy, currentUserId];

      // استخدام كائن بسيط محدد جيداً
      await updateDoc(postRef, {
        likedBy: updatedLikedBy,
        likeCount: updatedLikedBy.length,
      });
    } catch (error) {
      console.error("خطأ في تحديث الإعجاب:", error);

      // في حالة الفشل، استعادة الحالة الأصلية
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
    spotifyUrl: string,
    // استخدام underscore للإشارة إلى أن هذه المتغيرات غير مستخدمة
   
  ) => {
    try {
      if (!auth.currentUser?.uid) {
        console.error("لم يتم تسجيل الدخول");
        return;
      }

      // 1. إعداد بيانات المنشور بشكل صحيح
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

      console.log("جاري إضافة منشور جديد:", postData);

      // 2. إضافة المنشور إلى Firestore
      const docRef = await addDoc(collection(db, "posts"), postData);
      console.log("تم إضافة المنشور بنجاح!", docRef.id);

      // 4. إغلاق نافذة الإضافة
      setShowForm(false);
    } catch (error) {
      console.error("خطأ في إضافة المنشور:", error);
      setError("حدث خطأ في إضافة المنشور");
    }
  };

  // دالة لمزامنة حالة المنشورات من قاعدة البيانات
  const syncPostsWithFirestore = useCallback(async () => {
    if (!userId || !auth.currentUser) return;

    try {
      console.log("جاري مزامنة المنشورات مع قاعدة البيانات...");

      // 1. جلب المنشورات الحالية من الحالة المحلية
      const currentPosts = [...posts];
      const postIds = currentPosts.map((post) => post.id);

      // 2. جلب البيانات المحدثة من فايرستور
      const postsSnapshot = await Promise.all(
        postIds.map((id) => getDoc(doc(db, "posts", id)))
      );

      // 3. تحديث المنشورات المحلية بالبيانات من قاعدة البيانات
      const updatedPosts = currentPosts.map((post, index) => {
        const docSnapshot = postsSnapshot[index];
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const likedBy = data.likedBy || [];
          const isLiked = likedBy.includes(auth.currentUser?.uid);

          // تحديث فقط إذا اختلفت البيانات
          if (post.liked !== isLiked || post.likeCount !== likedBy.length) {
            console.log(
              `تحديث المنشور ${post.id}: isLiked من ${post.liked} إلى ${isLiked}, likeCount من ${post.likeCount} إلى ${likedBy.length}`
            );
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

      // 4. تحديث الحالة بالمنشورات المحدثة
      setPosts(updatedPosts);
      console.log("تمت مزامنة المنشورات بنجاح!");
    } catch (error) {
      console.error("خطأ في مزامنة المنشورات:", error);
    }
  }, [posts, userId]);

  // استدعاء دالة المزامنة عند الضرورة
  useEffect(() => {
    // مزامنة المنشورات كل 30 ثانية
    const interval = setInterval(() => {
      syncPostsWithFirestore();
    }, 30000);

    return () => clearInterval(interval);
  }, [syncPostsWithFirestore]);

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
