
// import React, { useState, useEffect } from "react";
// import PostCard from "./PostCard";
// import FormToPost from "./FormToPost";
// import { addDoc, collection, query, where } from "firebase/firestore";
// import { db } from "./firebase"; // تأكد من استيراد Firestore
// import Settings from "./Settings";
// import "../index.css";
// import { MdOutlineSettingsSuggest } from "react-icons/md";
// import { signOut } from "firebase/auth"; // استيراد signOut من Firebase
// import { auth } from "./firebase"; // تأكد من استيراد auth
// import { onSnapshot } from "firebase/firestore";

// interface Post {
//   image: string | null;
//   text: string;
//   id: string; // تغيير النوع إلى string لأن Firestore يستخدم معرفات نصية
//   liked: boolean;
//   likeCount: number;
//   mediaUrl?: string;
//   userId?: string; // جعل userId اختياريًا
// }

// const Profile: React.FC = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [showSettings, setShowSettings] = useState<boolean>(false);

//   // useEffect(() => {
//   //   const fetchPosts = async () => {
//   //     try {
//   //       if (auth.currentUser) {
//   //         // استعلام للحصول على البوستات الخاصة بالمستخدم
//   //         const q = query(
//   //           collection(db, "Posts"),
//   //           where("userId", "==", auth.currentUser.uid) // فقط البوستات الخاصة بالمستخدم
//   //         );
//   //         const querySnapshot = await getDocs(q);
//   //         const postsData = querySnapshot.docs.map((doc) => ({
//   //           id: doc.id,
//   //           ...doc.data(),
//   //         })) as Post[];
//   //         setPosts(postsData);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching posts: ", error);
//   //     }
//   //   };

//   //   fetchPosts();
//   // }, []);

//   useEffect(() => {
//     let unsubscribe;
//     if (auth.currentUser) {
//       const q = query(
//         collection(db, "Posts"),
//         where("userId", "==", auth.currentUser.uid)
//       );
//       unsubscribe = onSnapshot(q, (querySnapshot) => {
//         const postsData = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Post[];
//         setPosts(postsData);
//       });
//     }
//     return () => unsubscribe && unsubscribe();
//   }, [auth.currentUser]);

//   const handleSubmit = async (text: string, image: string | null, mediaUrl: string) => {
//     try {
//       const newPost = {
//         text,
//         image,
//         mediaUrl,
//         liked: false,
//         likeCount: 0,
//         timestamp: new Date(),
//         userId: auth.currentUser?.uid || "", // التأكد من أن userId ليس undefined
//       };

//       const docRef = await addDoc(collection(db, "Posts"), newPost);
//       setPosts((prevPosts) => [{ id: docRef.id, ...newPost }, ...prevPosts]);
//       setShowForm(false);
//     } catch (error) {
//       console.error("Error adding post: ", error);
//     }
//   };

//   const handleDelete = (id: string) => {
//     setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
//   };

//   const handleLike = (id: string) => {
//     setPosts((prevPosts) =>
//       prevPosts.map((post) =>
//         post.id === id
//           ? { ...post, liked: !post.liked, likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1 }
//           : post
//       )
//     );
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth); // تسجيل الخروج من Firebase
//       // هنا يمكن إضافة إعادة التوجيه إلى صفحة تسجيل الدخول بعد الخروج
//     } catch (error) {
//       console.error("Error logging out: ", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
//       <button 
//         onClick={() => setShowSettings(true)} 
//         className="absolute top-4 left-4 text-gray-600 px-4 py-2 rounded-full hover:bg-blue-600 transition"
//       >
//         <MdOutlineSettingsSuggest className="text-2xl" />
//       </button>

//       {showSettings && <Settings onClose={() => setShowSettings(false)} handleLogout={handleLogout} />}

//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-300 fixed bottom-5 right-6 transition mb-5"
//         onClick={() => setShowForm(true)}
//       >
//         +
//       </button>

//       {showForm && <FormToPost onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}

//       <div className="mt-30 w-full flex flex-col items-center gap-4">
//         {posts.map((post) => (
//           <PostCard key={post.id} post={post} onDelete={handleDelete} onLike={handleLike} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Profile;


























// import React, { useState, useEffect } from "react";
// import PostCard from "./PostCard";
// import FormToPost from "./FormToPost";
// import { addDoc, collection, query, where, onSnapshot } from "firebase/firestore";
// import { db } from "./firebase";
// import Settings from "./Settings";
// import "../index.css";
// import { MdOutlineSettingsSuggest } from "react-icons/md";
// import { signOut } from "firebase/auth";
// import { auth } from "./firebase";

// // واجهة البيانات للبوسات
// interface Post {
//   image: string | null;
//   text: string;
//   id: string;
//   liked: boolean;
//   likeCount: number;
//   mediaUrl?: string;
//   userId?: string;
// }

// const Profile: React.FC = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [showSettings, setShowSettings] = useState<boolean>(false);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         const q = query(
//           collection(db, "Posts"),
//           where("userId", "==", user.uid)
//         );

//         const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
//           const postsData = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           })) as Post[];

//           setPosts(postsData);
//         });

//         // إرجاع دالة لإلغاء الاشتراك في الاستماع للتغييرات
//         return () => unsubscribeSnapshot();
//       } else {
//         setPosts([]); // إذا لم يكن هناك مستخدم
//       }
//     });

//     // إرجاع دالة لإلغاء الاشتراك في التغيير في حالة المستخدم
//     return () => unsubscribe();
//   }, []); // التبعيات فارغة لأننا لا نحتاج لمراقبة auth.currentUser بشكل مباشر هنا

//   const handleSubmit = async (text: string, image: string | null, mediaUrl: string) => {
//     try {
//       const newPost = {
//         text,
//         image,
//         mediaUrl,
//         liked: false,
//         likeCount: 0,
//         timestamp: new Date(),
//         userId: auth.currentUser?.uid || "",
//       };

//       const docRef = await addDoc(collection(db, "Posts"), newPost);
//       setPosts((prevPosts) => [{ id: docRef.id, ...newPost }, ...prevPosts]);
//       setShowForm(false);
//     } catch (error) {
//       console.error("Error adding post: ", error);
//     }
//   };

//   const handleDelete = (id: string) => {
//     setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
//   };

//   const handleLike = (id: string) => {
//     setPosts((prevPosts) =>
//       prevPosts.map((post) =>
//         post.id === id
//           ? { ...post, liked: !post.liked, likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1 }
//           : post
//       )
//     );
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Error logging out: ", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
//       <button
//         onClick={() => setShowSettings(true)}
//         className="absolute top-4 left-4 text-gray-600 px-4 py-2 rounded-full hover:bg-blue-600 transition"
//       >
//         <MdOutlineSettingsSuggest className="text-2xl" />
//       </button>

//       {showSettings && <Settings onClose={() => setShowSettings(false)} handleLogout={handleLogout} />}

//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-300 fixed bottom-5 right-6 transition mb-5"
//         onClick={() => setShowForm(true)}
//       >
//         +
//       </button>

//       {showForm && <FormToPost onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}

//       <div className="mt-30 w-full flex flex-col items-center gap-4">
//         {posts.length === 0 ? (
//           <p>لا يوجد بوستات بعد. من فضلك أضف واحدة.</p>
//         ) : (
//           posts.map((post) => (
//             <PostCard key={post.id} post={post} onDelete={handleDelete} onLike={handleLike} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;




// import React, { useState, useEffect } from "react";
// import { addDoc, collection, query, where, onSnapshot, doc, setDoc } from "firebase/firestore";
// import { db } from "./firebase";
// import { signOut } from "firebase/auth";
// import { auth } from "./firebase";
// import Settings from "./Settings";
// import { MdOutlineSettingsSuggest } from "react-icons/md";
// import "../index.css";
// import FormToPost from "./FormToPost";
// import PostCard from "./PostCard";

// // واجهة البيانات للبوسات
// interface Post {
//   image: string | null;
//   text: string;
//   id: string;
//   liked: boolean;
//   likeCount: number;
//   mediaUrl?: string;
//   userId?: string;
// }

// interface Follow {
//   followerId: string;
//   followingId: string;
//   approved: boolean;
// }

// const Profile: React.FC = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [showSettings, setShowSettings] = useState<boolean>(false);
//   const [isFollowing, setIsFollowing] = useState<boolean>(false);
//   const currentUserId = auth.currentUser?.uid;

//   // جلب البوستات
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         const q = query(
//           collection(db, "Posts"),
//           where("userId", "==", user.uid)
//         );

//         const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
//           const postsData = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           })) as Post[];

//           setPosts(postsData);
//         });

//         return () => unsubscribeSnapshot();
//       } else {
//         setPosts([]);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // التحقق إذا كنت تتابع الشخص
//   useEffect(() => {
//     if (currentUserId) {
//       const q = query(
//         collection(db, "Follows"),
//         where("followerId", "==", currentUserId),
//         where("followingId", "==", currentUserId)
//       );

//       const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
//         setIsFollowing(querySnapshot.docs.length > 0);
//       });

//       return () => unsubscribeSnapshot();
//     }
//   }, [currentUserId]);

//   const handleSubmit = async (text: string, image: string | null, mediaUrl: string) => {
//     try {
//       const newPost = {
//         text,
//         image,
//         mediaUrl,
//         liked: false,
//         likeCount: 0,
//         timestamp: new Date(),
//         userId: currentUserId || "",
//       };

//       const docRef = await addDoc(collection(db, "Posts"), newPost);
//       setPosts((prevPosts) => [{ id: docRef.id, ...newPost }, ...prevPosts]);
//       setShowForm(false);
//     } catch (error) {
//       console.error("Error adding post: ", error);
//     }
//   };

//   const handleDelete = (id: string) => {
//     setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
//   };

//   const handleLike = (id: string) => {
//     setPosts((prevPosts) =>
//       prevPosts.map((post) =>
//         post.id === id
//           ? { ...post, liked: !post.liked, likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1 }
//           : post
//       )
//     );
//   };

//   const handleFollow = async (userId: string) => {
//     if (currentUserId) {
//       const followData: Follow = {
//         followerId: currentUserId,
//         followingId: userId,
//         approved: false,  // يحتاج إلى موافقة
//       };

//       try {
//         await addDoc(collection(db, "Follows"), followData);
//       } catch (error) {
//         console.error("Error following user: ", error);
//       }
//     }
//   };

//   const handleApproveFollow = async (userId: string) => {
//     try {
//       const followRef = doc(db, "Follows", userId);
//       await setDoc(followRef, { approved: true }, { merge: true });
//     } catch (error) {
//       console.error("Error approving follow: ", error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Error logging out: ", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
//       <button
//         onClick={() => setShowSettings(true)}
//         className="absolute top-4 left-4 text-gray-600 px-4 py-2 rounded-full hover:bg-blue-600 transition"
//       >
//         <MdOutlineSettingsSuggest className="text-2xl" />
//       </button>

//       {showSettings && <Settings onClose={() => setShowSettings(false)} handleLogout={handleLogout} />}

//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-300 fixed bottom-5 right-6 transition mb-5"
//         onClick={() => setShowForm(true)}
//       >
//         +
//       </button>

//       {showForm && <FormToPost onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}

//       <div className="mt-30 w-full flex flex-col items-center gap-4">
//         {posts.length === 0 ? (
//           <p>لا يوجد بوستات بعد. من فضلك أضف واحدة.</p>
//         ) : (
//           posts.map((post) => (
//             <PostCard key={post.id} post={post} onDelete={handleDelete} onLike={handleLike} />
//           ))
//         )}
//       </div>

//       {isFollowing ? (
//         <button
//           className="bg-gray-500 text-white px-4 py-2 rounded-full mt-4"
//           onClick={() => handleFollow("someUserId")}
//         >
//           متابعة
//         </button>
//       ) : (
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded-full mt-4"
//           onClick={() => handleFollow("someUserId")}
//         >
//           إلغاء متابعة
//         </button>
//       )}

//       {/* زر موافقة المتابعة */}
//       <button
//         className="bg-green-500 text-white px-4 py-2 rounded-full mt-4"
//         onClick={() => handleApproveFollow("someUserId")}
//       >
//         موافقة على المتابعة
//       </button>
//     </div>
//   );
// };

// export default Profile;
import React, { useState, useEffect } from "react";
import { addDoc, collection, query, where, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import Settings from "./Settings";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import "../index.css";
import FormToPost from "./FormToPost";
import PostCard from "./PostCard";
// واجهة البيانات للبوسات
interface Post {
  image: string | null;
  text: string;
  id: string;
  liked: boolean;
  likeCount: number;
  mediaUrl?: string;
  userId?: string;
}

interface Follow {
  followerId: string;
  followingId: string;
  approved: boolean;
}

const Profile: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // حالة المتابعة
  const [userToFollow, setUserToFollow] = useState<string>("");  // حقل لإدخال اسم المستخدم
  const currentUserId = auth.currentUser?.uid;

  // جلب البوستات
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(
          collection(db, "Posts"),
          where("userId", "==", user.uid)
        );

        const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          const postsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];

          setPosts(postsData);
        });

        return () => unsubscribeSnapshot();
      } else {
        setPosts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // التحقق إذا كنت تتابع الشخص
  useEffect(() => {
    if (currentUserId) {
      const q = query(
        collection(db, "Follows"),
        where("followerId", "==", currentUserId),
        where("followingId", "==", userToFollow) // نراقب المتابعة بناءً على اسم المستخدم
      );

      const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
        setIsFollowing(querySnapshot.docs.length > 0);
      });

      return () => unsubscribeSnapshot();
    }
  }, [currentUserId, userToFollow]);

  const handleSubmit = async (text: string, image: string | null, mediaUrl: string) => {
    try {
      const newPost = {
        text,
        image,
        mediaUrl,
        liked: false,
        likeCount: 0,
        timestamp: new Date(),
        userId: currentUserId || "",
      };

      const docRef = await addDoc(collection(db, "Posts"), newPost);
      setPosts((prevPosts) => [{ id: docRef.id, ...newPost }, ...prevPosts]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  const handleDelete = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  const handleLike = (id: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1 }
          : post
      )
    );
  };

  const handleFollow = async () => {
    if (currentUserId && userToFollow) {
      const followData: Follow = {
        followerId: currentUserId,
        followingId: userToFollow,
        approved: false,  // يحتاج إلى موافقة
      };

      try {
        await addDoc(collection(db, "Follows"), followData);
      } catch (error) {
        console.error("Error following user: ", error);
      }
    }
  };

  const handleApproveFollow = async (userId: string) => {
    try {
      const followRef = doc(db, "Follows", userId);
      await setDoc(followRef, { approved: true }, { merge: true });
    } catch (error) {
      console.error("Error approving follow: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 left-4 text-gray-600 px-4 py-2 rounded-full hover:bg-blue-600 transition"
      >
        <MdOutlineSettingsSuggest className="text-2xl" />
      </button>

      {showSettings && <Settings onClose={() => setShowSettings(false)} handleLogout={handleLogout} />}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-300 fixed bottom-5 right-6 transition mb-5"
        onClick={() => setShowForm(true)}
      >
        +
      </button>

      {showForm && <FormToPost onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}

      <div className="mt-30 w-full flex flex-col items-center gap-4">
        {posts.length === 0 ? (
          <p>لا يوجد بوستات بعد. من فضلك أضف واحدة.</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handleDelete} onLike={handleLike} />
          ))
        )}
      </div>

      {/* إدخال اسم المستخدم المتابع */}
      <div className="mt-4">
        <input
          type="text"
          value={userToFollow}
          onChange={(e) => setUserToFollow(e.target.value)}
          placeholder="أدخل اسم المستخدم لمتابعته"
          className="px-4 py-2 border rounded-lg"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full mt-2"
          onClick={handleFollow}
          disabled={isFollowing} // إذا كنت تتابع بالفعل، زر "متابعة" يكون معطلاً
        >
          {isFollowing ? "أنت تتابع هذا الشخص" : "متابعة"}
        </button>
      </div>

      {/* زر موافقة المتابعة */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-full mt-4"
        onClick={() => handleApproveFollow(userToFollow)}
      >
        موافقة على المتابعة
      </button>
    </div>
  );
};

export default Profile;
