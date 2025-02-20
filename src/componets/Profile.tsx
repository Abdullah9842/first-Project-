




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
//          <button
//         onClick={() => navigate('/follow-system')}  // Navigate to follow system
//         className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-300 mt-5"
//       >
//         الذهاب إلى نظام المتابعين
//       </button>
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
// import PostCard from "./PostCard";
// import FormToPost from "./FormToPost";
// import { addDoc, collection, query, where, onSnapshot } from "firebase/firestore";
// import { db } from "./firebase";
// import Settings from "./Settings";
// import "../index.css";
// import { MdOutlineSettingsSuggest } from "react-icons/md";
// import { signOut } from "firebase/auth";
// import { auth } from "./firebase";
// import { useNavigate } from "react-router-dom"; // استيراد useNavigate

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
//   const navigate = useNavigate(); // تهيئة التنقل

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
//         setPosts([]); // إذا لم يكن هناك مستخدم
//       }
//     });

//     return () => unsubscribe();
//   }, []);

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
//         onClick={() => navigate('/follow-system')} // التنقل إلى نظام المتابعين
//         className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-300 mt-5"
//       >
//         الذهاب إلى نظام المتابعين
//       </button>
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

import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";
import FormToPost from "./FormToPost";
import { addDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import Settings from "./Settings";
import "../index.css";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom"; // استيراد useNavigate

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

const Profile: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<string[]>([]); // قائمة الأصدقاء
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const navigate = useNavigate(); // تهيئة التنقل

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // جلب قائمة الأصدقاء
        const fetchFriends = async () => {
          const friendsQuery = query(
            collection(db, "Friends"),
            where("userId1", "==", user.uid) // أو يمكنك إضافة userId2 أيضًا حسب هيكل البيانات
          );
          onSnapshot(friendsQuery, (querySnapshot) => {
            const friendsList: string[] = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              return data.userId2 || data.userId1; // جلب id الأصدقاء
            });
            setFriends(friendsList);
          });
        };

        fetchFriends();

        // جلب المنشورات للمستخدم والأصدقاء
        const q = query(
          collection(db, "Posts"),
          where("userId", "in", [user.uid, ...friends]) // تصفية المنشورات للمستخدم والأصدقاء
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
        setPosts([]); // إذا لم يكن هناك مستخدم
      }
    });

    return () => unsubscribe();
  }, [friends]); // عند تغيير الأصدقاء

  const handleSubmit = async (text: string, image: string | null, mediaUrl: string) => {
    try {
      const newPost = {
        text,
        image,
        mediaUrl,
        liked: false,
        likeCount: 0,
        timestamp: new Date(),
        userId: auth.currentUser?.uid || "",
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
        onClick={() => navigate('/follow-system')} // التنقل إلى نظام المتابعين
        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-300 mt-5"
      >
        الذهاب إلى نظام المتابعين
      </button>
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
    </div>
  );
};

export default Profile;
