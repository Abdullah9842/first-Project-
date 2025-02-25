




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








// import React, { useState, useEffect } from "react";
// import PostCard from "./PostCard";
// import FormToPost from "./FormToPost";
// import { addDoc, collection, query, where, limit, onSnapshot, getDocs } from "firebase/firestore";
// import { db } from "./firebase";
// import Settings from "./Settings";
// import { MdOutlineSettingsSuggest } from "react-icons/md";
// import { signOut } from "firebase/auth";
// import { auth } from "./firebase";
// import { useNavigate } from "react-router-dom";

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
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           // جلب قائمة الأصدقاء
//           const friendsQuery1 = query(
//             collection(db, "Friends"),
//             where("userId1", "==", user.uid)
//           );
//           const friendsQuery2 = query(
//             collection(db, "Friends"),
//             where("userId2", "==", user.uid)
//           );

//           const friendsSnapshot1 = await getDocs(friendsQuery1);
//           const friendsSnapshot2 = await getDocs(friendsQuery2);

//           const friendsList: string[] = [
//             ...friendsSnapshot1.docs.map((doc) => doc.data().userId2),
//             ...friendsSnapshot2.docs.map((doc) => doc.data().userId1),
//           ];

//           // استخدام onSnapshot للحصول على التحديثات الفورية للبوستات
//           const postsQuery = query(
//             collection(db, "Posts"),
//             where("userId", "in", [user.uid, ...friendsList]), // تصفية البوستات حسب المستخدم وأصدقائه
//             limit(10)
//           );

//           // الاستماع لتحديثات البوستات بشكل فوري
//           onSnapshot(postsQuery, (snapshot) => {
//             const postsData = snapshot.docs.map((doc) => ({
//               id: doc.id,
//               image: doc.data().image || null,
//               text: doc.data().text,
//               liked: doc.data().liked || false,
//               likeCount: doc.data().likeCount || 0,
//               mediaUrl: doc.data().mediaUrl,
//               userId: doc.data().userId,
//             }));
//             setPosts(postsData);
//           });

//         } catch (error) {
//           console.error("Error fetching data: ", error);
//         }
//       }
//     };

//     fetchData();
//   }, []); // تفعيل الـ useEffect عند التحميل لأول مرة

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
//         onClick={() => navigate('/follow-system')}
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
//             <PostCard key={post.id} post={post} onDelete={handleDelete} onLike={handleLike} onComment={ () => {}) }/>
//       </div>
//     </div>
//   );
// };

// export default Profile;















// import React, { useState, useEffect } from "react";
// import PostCard from "./PostCard";
// import FormToPost from "./FormToPost";
// import { addDoc, collection, query, where, limit, onSnapshot, getDocs } from "firebase/firestore";
// import { db } from "./firebase";
// import Settings from "./Settings";
// import { MdOutlineSettingsSuggest } from "react-icons/md";
// import { signOut } from "firebase/auth";
// import { auth } from "./firebase";
// import { useNavigate } from "react-router-dom";

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
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const friendsQuery1 = query(
//             collection(db, "Friends"),
//             where("userId1", "==", user.uid)
//           );
//           const friendsQuery2 = query(
//             collection(db, "Friends"),
//             where("userId2", "==", user.uid)
//           );

//           const friendsSnapshot1 = await getDocs(friendsQuery1);
//           const friendsSnapshot2 = await getDocs(friendsQuery2);

//           const friendsList: string[] = [
//             ...friendsSnapshot1.docs.map((doc) => doc.data().userId2),
//             ...friendsSnapshot2.docs.map((doc) => doc.data().userId1),
//           ];

//           const postsQuery = query(
//             collection(db, "Posts"),
//             where("userId", "in", [user.uid, ...friendsList]),
//             limit(10)
//           );

//           onSnapshot(postsQuery, (snapshot) => {
//             const postsData = snapshot.docs.map((doc) => ({
//               id: doc.id,
//               image: doc.data().image || null,
//               text: doc.data().text,
//               liked: doc.data().liked || false,
//               likeCount: doc.data().likeCount || 0,
//               mediaUrl: doc.data().mediaUrl,
//               userId: doc.data().userId,
//             }));
//             setPosts(postsData);
//           });

//         } catch (error) {
//           console.error("Error fetching data: ", error);
//         }
//       }
//     };

//     fetchData();
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
//         onClick={() => navigate('/follow-system')}
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

//       {showSettings && <Settings userId={auth.currentUser?.uid} onClose={() => setShowSettings(false)} handleLogout={handleLogout} />}

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
//             <PostCard onComment={()=>{}} key={post.id} post={post} onDelete={handleDelete} onLike={handleLike} />
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
// import { addDoc, collection, query, where, limit, onSnapshot, getDocs } from "firebase/firestore";
// import { db } from "./firebase";
// import Settings from "./Settings";
// import { MdOutlineSettingsSuggest } from "react-icons/md";
// import { signOut } from "firebase/auth";
// import { auth } from "./firebase";
// import { useNavigate } from "react-router-dom";

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
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const friendsQuery1 = query(
//             collection(db, "Friends"),
//             where("userId1", "==", user.uid)
//           );
//           const friendsQuery2 = query(
//             collection(db, "Friends"),
//             where("userId2", "==", user.uid)
//           );

//           const friendsSnapshot1 = await getDocs(friendsQuery1);
//           const friendsSnapshot2 = await getDocs(friendsQuery2);

//           const friendsList: string[] = [
//             ...friendsSnapshot1.docs.map((doc) => doc.data().userId2),
//             ...friendsSnapshot2.docs.map((doc) => doc.data().userId1),
//           ];

//           const postsQuery = query(
//             collection(db, "Posts"),
//             where("userId", "in", [user.uid, ...friendsList]),
//             limit(10)
//           );

//           onSnapshot(postsQuery, (snapshot) => {
//             const postsData = snapshot.docs.map((doc) => ({
//               id: doc.id,
//               image: doc.data().image || null,
//               text: doc.data().text,
//               liked: doc.data().liked || false,
//               likeCount: doc.data().likeCount || 0,
//               mediaUrl: doc.data().mediaUrl,
//               userId: doc.data().userId,
//             }));
//             setPosts(postsData);
//           });

//         } catch (error) {
//           console.error("Error fetching data: ", error);
//         }
//       }
//     };

//     fetchData();
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
//         onClick={() => navigate('/follow-system')}
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

//       {showSettings && auth.currentUser?.uid && (
//   <Settings userId={auth.currentUser.uid} onClose={() => setShowSettings(false)} handleLogout={handleLogout} />
// )}

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
//             <PostCard onComment={() => {}} key={post.id} post={post} onDelete={handleDelete} onLike={handleLike} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;


// Profile.tsx






// Profile.tsx







// import React, { useState, useEffect } from "react";
// import PostCard from "./PostCard";
// import FormToPost from "./FormToPost";
// import { addDoc, collection, query, where, limit, onSnapshot, getDocs } from "firebase/firestore";
// import { db } from "./firebase";
// import Settings from "./Settings";
// import { MdOutlineSettingsSuggest } from "react-icons/md";
// import { signOut } from "firebase/auth";
// import { auth } from "./firebase";
// import { useNavigate } from "react-router-dom";
// import { Post } from "./PostInterface";

// const Profile: React.FC = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [showSettings, setShowSettings] = useState<boolean>(false);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Error logging out: ", error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const friendsQuery1 = query(
//             collection(db, "Friends"),
//             where("userId1", "==", user.uid)
//           );
//           const friendsQuery2 = query(
//             collection(db, "Friends"),
//             where("userId2", "==", user.uid)
//           );

//           const friendsSnapshot1 = await getDocs(friendsQuery1);
//           const friendsSnapshot2 = await getDocs(friendsQuery2);

//           const friendsList: string[] = [
//             ...friendsSnapshot1.docs.map((doc) => doc.data().userId2),
//             ...friendsSnapshot2.docs.map((doc) => doc.data().userId1),
//           ];

//           const postsQuery = query(
//             collection(db, "Posts"),
//             where("userId", "in", [user.uid, ...friendsList]),
//             limit(10)
//           );

//           onSnapshot(postsQuery, (snapshot) => {
//             const postsData = snapshot.docs.map((doc) => ({
//               id: doc.id,
//               image: doc.data().image || null,
//               text: doc.data().text,
//               liked: doc.data().liked || false,
//               likeCount: doc.data().likeCount || 0,
//               mediaUrl: doc.data().mediaUrl,
//               userId: doc.data().userId ?? "",
//             }));
//             setPosts(postsData);
//           });

//         } catch (error) {
//           console.error("Error fetching data: ", error);
//         }
//       }
//     };

//     fetchData();
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

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
//       <button
//         onClick={() => navigate('/follow-system')}
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

//       {showSettings && auth.currentUser?.uid && (
//         <Settings 
//           userId={auth.currentUser.uid} 
//           onClose={() => setShowSettings(false)} 
//           handleLogout={handleLogout} 
//         />
//       )}

//       <button
//         className="bg-blue-500 z-10 text-white px-4 py-2 rounded-full hover:bg-blue-300 fixed bottom-5 right-6 transition mb-5"
//         onClick={() => setShowForm(true)}
//       >
//         +
//       </button>

//       {showForm && <FormToPost onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}

//       <div className="mt-30 w-full flex flex-col items-center gap-4">
//       {posts.length === 0 ? (
//   <p>لا يوجد بوستات بعد. من فضلك أضف واحدة.</p>
// ) : (
//   posts.map((post) => (
//     <PostCard
//       onComment={() => {}}
//       key={post.id}
//       post={post}
//       onDelete={handleDelete}
//       onLike={handleLike}
//     />
//   ))
// )}

//       </div>
//     </div>
//   );
// };

// export default Profile;




// import  { useState, useEffect } from "react";
// import PostCard from "./PostCard";
// import FormToPost from "./FormToPost";
// import { addDoc, collection, query, where, limit, onSnapshot, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
// import { db } from "./firebase";
// import Settings from "./Settings";
// import { MdOutlineSettingsSuggest } from "react-icons/md";
// import { signOut } from "firebase/auth";
// import { auth } from "./firebase";
// import { useNavigate } from "react-router-dom";
// import { Post } from "./PostInterface";
// import { FaUserFriends } from "react-icons/fa";
// import { useFriends } from "./useFriends";
// function Profile() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [showSettings, setShowSettings] = useState<boolean>(false);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate("/login");
//     } catch (error) {
//       console.error("Error logging out: ", error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const friendsQuery1 = query(
//             collection(db, "Friends"),
//             where("userId1", "==", user.uid)
//           );
//           const friendsQuery2 = query(
//             collection(db, "Friends"),
//             where("userId2", "==", user.uid)
//           );

//           const friendsSnapshot1 = await getDocs(friendsQuery1);
//           const friendsSnapshot2 = await getDocs(friendsQuery2);

//           const friendsList: string[] = [
//             ...friendsSnapshot1.docs.map((doc) => doc.data().userId2),
//             ...friendsSnapshot2.docs.map((doc) => doc.data().userId1),
//           ];

//           const postsQuery = query(
//             collection(db, "Posts"),
//             where("userId", "in", [user.uid, ...friendsList]),
//             limit(10)
//           );

//           const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
//             const postsData = snapshot.docs.map((doc) => ({
//               id: doc.id,
//               image: doc.data().image || null,
//               text: doc.data().text,
//               liked: doc.data().liked || false,
//               likeCount: doc.data().likeCount || 0,
//               mediaUrl: doc.data().mediaUrl,
//               userId: doc.data().userId || "",
//               timestamp: doc.data().timestamp || 0,
//             }));
//             setPosts(postsData);
//           });

//           return () => unsubscribe();
//         } catch (error) {
//           console.error("Error fetching data: ", error);
//         }
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSubmit = async (text: string, image: string | null, mediaUrl: string) => {
//     try {
//       const newPost = {
//         text,
//         image,
//         mediaUrl,
//         liked: false,
//         likeCount: 0,
//         timestamp: Date.now(),
//         userId: auth.currentUser?.uid || "",
//       };

//       const docRef = await addDoc(collection(db, "Posts"), newPost);
//       setPosts((prevPosts) => [{ id: docRef.id, ...newPost }, ...prevPosts]);
//       setShowForm(false);
//     } catch (error) {
//       console.error("Error adding post: ", error);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteDoc(doc(db, "Posts", id));
//       setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
//     } catch (error) {
//       console.error("Error deleting post: ", error);
//     }
//   };

//   const handleLike = async (id: string) => {
//     try {
//       const postRef = doc(db, "Posts", id);
//       const post = posts.find((post) => post.id === id);

//       if (post) {
//         const newLikedState = !post.liked;
//         const newLikeCount = newLikedState ? post.likeCount + 1 : post.likeCount - 1;

//         await updateDoc(postRef, {
//           liked: newLikedState,
//           likeCount: newLikeCount,
//         });

//         setPosts((prevPosts) => prevPosts.map((post) => post.id === id
//           ? { ...post, liked: newLikedState, likeCount: newLikeCount }
//           : post
//         )
//         );
//       }
//     } catch (error) {
//       console.error("Error updating like: ", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
//       <button
//         onClick={() => navigate('/follow-system')}
//         className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-green-300 mt-0 flex items-center gap-2"
//       >
//         <FaUserFriends />
//         {/* <p className="text-sm text-white">{friends.length}</p> */}
//         <p className="text-sm text-white">{distinctFriends.length}</p>

        

//       </button>     <button
//         onClick={() => setShowSettings(true)}
//         className="absolute top-4 left-4 text-gray-600 px-4 py-2 rounded-full hover:bg-blue-600 transition"
//       >
//         <MdOutlineSettingsSuggest className="text-2xl" />
//       </button>

//       {showSettings && auth.currentUser?.uid && (
//         <Settings
//           userId={auth.currentUser.uid}
//           onClose={() => setShowSettings(false)}
//           handleLogout={handleLogout} />
//       )}

//       <button
//         className="bg-blue-500 z-10 text-white px-4 py-2 rounded-full hover:bg-blue-300 fixed bottom-5 right-6 transition mb-5"
//         onClick={() => setShowForm(true)}
//       >
//         +
//       </button>

//       {showForm && <FormToPost onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}

//       <div className="mt-30 w-full flex flex-col items-center gap-4">
//         {posts.length === 0 ? (
//           <div className="flex flex-col items-center justify-center mt-10">
//             <p className="text-gray-600 text-lg mb-4">لا يوجد بوستات بعد. من فضلك أضف واحدة.</p>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
//               onClick={() => setShowForm(true)}
//             >
//               أضف منشورًا
//             </button>
//           </div>
//         ) : (
//           posts.map((post) => (
//             <PostCard
//               key={post.id}
//               post={post}
//               onDelete={handleDelete}
//               onLike={handleLike} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default Profile;




// import { useState, useEffect } from "react";
// import PostCard from "./PostCard";
// import FormToPost from "./FormToPost";
// import { addDoc, collection, query, where, limit, onSnapshot, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
// import { db } from "./firebase";
// import Settings from "./Settings";
// import { MdOutlineSettingsSuggest } from "react-icons/md";
// import { signOut } from "firebase/auth";
// import { auth } from "./firebase";
// import { useNavigate } from "react-router-dom";
// import { Post } from "./PostInterface";
// import { FaUserFriends } from "react-icons/fa";


// interface ProfileProps {
//   friendsCount: number; // إضافة prop جديد لعدد الأصدقاء
// }

// function Profile({ friendsCount }:ProfileProps) {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [showSettings, setShowSettings] = useState<boolean>(false);
//   const [loadingPosts, setLoadingPosts] = useState<boolean>(true);  // Loading state for posts
//   const navigate = useNavigate();
//   // const { distinctFriends } = useFriends(); // Use the custom hook

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate("/login");
//     } catch (error) {
//       console.error("Error logging out: ", error);
//     }
//   };

//   // Fetch posts data based on friends
//   useEffect(() => {
//     const fetchPosts = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const friendsQuery1 = query(collection(db, "Friends"), where("userId1", "==", user.uid));
//           const friendsQuery2 = query(collection(db, "Friends"), where("userId2", "==", user.uid));

//           const friendsSnapshot1 = await getDocs(friendsQuery1);
//           const friendsSnapshot2 = await getDocs(friendsQuery2);

//           const friendsList: string[] = [
//             ...friendsSnapshot1.docs.map((doc) => doc.data().userId2),
//             ...friendsSnapshot2.docs.map((doc) => doc.data().userId1),
//           ];

//           const postsQuery = query(collection(db, "Posts"), where("userId", "in", [user.uid, ...friendsList]), limit(10));

//           const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
//             const postsData = snapshot.docs.map((doc) => ({
//               id: doc.id,
//               image: doc.data().image || null,
//               text: doc.data().text,
//               liked: doc.data().liked || false,
//               likeCount: doc.data().likeCount || 0,
//               mediaUrl: doc.data().mediaUrl,
//               userId: doc.data().userId || "",
//               timestamp: doc.data().timestamp || 0,
//             }));
//             setPosts(postsData);
//             setLoadingPosts(false); // Set loading state to false once data is fetched
//           });

//           return () => unsubscribe();
//         } catch (error) {
//           console.error("Error fetching posts: ", error);
//           setLoadingPosts(false); // Handle error case and stop loading
//         }
//       }
//     };

//     fetchPosts();
//   }, []);

//   const handleSubmit = async (text: string, image: string | null, mediaUrl: string) => {
//     try {
//       const newPost = {
//         text,
//         image,
//         mediaUrl,
//         liked: false,
//         likeCount: 0,
//         timestamp: Date.now(),
//         userId: auth.currentUser?.uid || "",
//       };

//       const docRef = await addDoc(collection(db, "Posts"), newPost);
//       setPosts((prevPosts) => [{ id: docRef.id, ...newPost }, ...prevPosts]);
//       setShowForm(false);
//     } catch (error) {
//       console.error("Error adding post: ", error);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteDoc(doc(db, "Posts", id));
//       setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
//     } catch (error) {
//       console.error("Error deleting post: ", error);
//     }
//   };

//   const handleLike = async (id: string) => {
//     try {
//       const postRef = doc(db, "Posts", id);
//       const post = posts.find((post) => post.id === id);

//       if (post) {
//         const newLikedState = !post.liked;
//         const newLikeCount = newLikedState ? post.likeCount + 1 : post.likeCount - 1;

//         await updateDoc(postRef, {
//           liked: newLikedState,
//           likeCount: newLikeCount,
//         });

//         setPosts((prevPosts) =>
//           prevPosts.map((post) =>
//             post.id === id ? { ...post, liked: newLikedState, likeCount: newLikeCount } : post
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error updating like: ", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
//             <p>عدد الأصدقاء: {friendsCount}</p> {/* عرض عدد الأصدقاء */}

//  <button
//   onClick={() => navigate('/follow-system')}
//   className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-green-300 mt-0 flex items-center gap-2"
// >
//   <FaUserFriends />
//   {/* <p className="text-sm text-white">{distinctFriends.length}</p> */}
// </button>

//       <button
//         onClick={() => setShowSettings(true)}
//         className="absolute top-4 left-4 text-gray-600 px-4 py-2 rounded-full hover:bg-blue-600 transition"
//       >
//         <MdOutlineSettingsSuggest className="text-2xl" />
//       </button>

//       {showSettings && auth.currentUser?.uid && (
//         <Settings userId={auth.currentUser.uid} onClose={() => setShowSettings(false)} handleLogout={handleLogout} />
//       )}

//       <button
//         className="bg-blue-500 z-10 text-white px-4 py-2 rounded-full hover:bg-blue-300 fixed bottom-5 right-6 transition mb-5"
//         onClick={() => setShowForm(true)}
//       >
//         +
//       </button>

//       {showForm && <FormToPost onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}

//       <div className="mt-30 w-full flex flex-col items-center gap-4">
//         {loadingPosts ? (
//           <div className="text-gray-600 text-lg">Loading posts...</div>
//         ) : posts.length === 0 ? (
//           <div className="flex flex-col items-center justify-center mt-10">
//             <p className="text-gray-600 text-lg mb-4">No posts yet. You can create your first post below.</p>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
//               onClick={() => setShowForm(true)}
//             >
//               Create a Post
//             </button>
//           </div>
//         ) : (
//           posts.map((post) => (
//             <PostCard key={post.id} post={post} onDelete={handleDelete} onLike={handleLike} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default Profile;


// import { useState, useEffect } from "react";
// import PostCard from "./PostCard";
// import FormToPost from "./FormToPost";
// import { addDoc, collection, query, where, limit, onSnapshot, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
// import { db } from "./firebase";
// import Settings from "./Settings";
// import { MdOutlineSettingsSuggest } from "react-icons/md";
// import { signOut } from "firebase/auth";
// import { auth } from "./firebase";
// import { useNavigate } from "react-router-dom";
// import { Post } from "./PostInterface";
// import { FaUserFriends } from "react-icons/fa";

// function Profile() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [showSettings, setShowSettings] = useState<boolean>(false);
//   const [loadingPosts, setLoadingPosts] = useState<boolean>(true); // Loading state for posts
//   const [friendsCount, setFriendsCount] = useState<number>(0); // State for friends count
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate("/login");
//     } catch (error) {
//       console.error("Error logging out: ", error);
//     }
//   };

//   // Fetch posts and friends data
//   useEffect(() => {
//     const fetchData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const friendsQuery1 = query(collection(db, "Friends"), where("userId1", "==", user.uid));
//           const friendsQuery2 = query(collection(db, "Friends"), where("userId2", "==", user.uid));

//           const friendsSnapshot1 = await getDocs(friendsQuery1);
//           const friendsSnapshot2 = await getDocs(friendsQuery2);

//           const friendsList: string[] = [
//             ...friendsSnapshot1.docs.map((doc) => doc.data().userId2),
//             ...friendsSnapshot2.docs.map((doc) => doc.data().userId1),
//           ];

//           setFriendsCount(friendsList.length); // Set friends count

//           const postsQuery = query(
//             collection(db, "Posts"),
//             where("userId", "in", [user.uid, ...friendsList]),
//             orderBy("timestamp", "desc"), // ترتيب البوستات من الأحدث
//             limit(10)
//           );
//           const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
//             const postsData = snapshot.docs.map((doc) => ({
//               id: doc.id,
//               image: doc.data().image || null,
//               text: doc.data().text,
//               liked: doc.data().liked || false,
//               likeCount: doc.data().likeCount || 0,
//               mediaUrl: doc.data().mediaUrl,
//               userId: doc.data().userId || "",
//               timestamp: doc.data().timestamp || 0,
//             }));
//             setPosts(postsData);
//             setLoadingPosts(false); // Set loading state to false once data is fetched
//           });

//           return () => unsubscribe();
//         } catch (error) {
//           console.error("Error fetching data: ", error);
//           setLoadingPosts(false); // Handle error case and stop loading
//         }
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSubmit = async (text: string, image: string | null, mediaUrl: string) => {
//     try {
//       const newPost = {
//         text,
//         image,
//         mediaUrl,
//         liked: false,
//         likeCount: 0,
//         timestamp: Date.now(),
//         userId: auth.currentUser?.uid || "",
//       };

//       const docRef = await addDoc(collection(db, "Posts"), newPost);
//       setPosts((prevPosts) => [{ id: docRef.id, ...newPost }, ...prevPosts]);
//       setShowForm(false);
//     } catch (error) {
//       console.error("Error adding post: ", error);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteDoc(doc(db, "Posts", id));
//       setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
//     } catch (error) {
//       console.error("Error deleting post: ", error);
//     }
//   };

//   const handleLike = async (id: string) => {
//     try {
//       const postRef = doc(db, "Posts", id);
//       const post = posts.find((post) => post.id === id);

//       if (post) {
//         const newLikedState = !post.liked;
//         const newLikeCount = newLikedState ? post.likeCount + 1 : post.likeCount - 1;

//         await updateDoc(postRef, {
//           liked: newLikedState,
//           likeCount: newLikeCount,
//         });

//         setPosts((prevPosts) =>
//           prevPosts.map((post) =>
//             post.id === id ? { ...post, liked: newLikedState, likeCount: newLikeCount } : post
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error updating like: ", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
//       <p>عدد الأصدقاء: {friendsCount}</p> {/* عرض عدد الأصدقاء */}

//       <button
//         onClick={() => navigate('/follow-system')}
//         className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-green-300 mt-0 flex items-center gap-2"
//       >
//         <FaUserFriends />
//       </button>

//       <button
//         onClick={() => setShowSettings(true)}
//         className="absolute top-4 left-4 text-gray-600 px-4 py-2 rounded-full hover:bg-blue-600 transition"
//       >
//         <MdOutlineSettingsSuggest className="text-2xl" />
//       </button>

//       {showSettings && auth.currentUser?.uid && (
//         <Settings userId={auth.currentUser.uid} onClose={() => setShowSettings(false)} handleLogout={handleLogout} />
//       )}

//       <button
//         className="bg-blue-500 z-10 text-white px-4 py-2 rounded-full hover:bg-blue-300 fixed bottom-5 right-6 transition mb-5"
//         onClick={() => setShowForm(true)}
//       >
//         +
//       </button>

//       {showForm && <FormToPost onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}

//       <div className="mt-30 w-full flex flex-col items-center gap-4">
//         {loadingPosts ? (
//           <div className="text-gray-600 text-lg">Loading posts...</div>
//         ) : posts.length === 0 ? (
//           <div className="flex flex-col items-center justify-center mt-10">
//             <p className="text-gray-600 text-lg mb-4">No posts yet. You can create your first post below.</p>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
//               onClick={() => setShowForm(true)}
//             >
//               Create a Post
//             </button>
//           </div>
//         ) : (
//           posts.map((post) => (
//             <PostCard key={post.id}  post={post} onDelete={handleDelete} onLike={handleLike} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default Profile;


// import { useState, useEffect } from "react";
// import { collection, query, where, onSnapshot, getDocs, orderBy, limit } from "firebase/firestore";
// import { db } from "./firebase";
// import { auth } from "./firebase";
// import { useNavigate } from "react-router-dom";
// import { Post } from "./PostInterface";

// function Profile() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           // Fetch friends
//           const friendsQuery1 = query(collection(db, "Friends"), where("userId1", "==", user.uid));
//           const friendsQuery2 = query(collection(db, "Friends"), where("userId2", "==", user.uid));

//           const [friendsSnapshot1, friendsSnapshot2] = await Promise.all([
//             getDocs(friendsQuery1),
//             getDocs(friendsQuery2),
//           ]);

//           const friendsList = [
//             ...friendsSnapshot1.docs.map((doc) => ({
//               userId: doc.data().userId2,
//               friendshipDate: doc.data().friendshipDate || 0,
//             })),
//             ...friendsSnapshot2.docs.map((doc) => ({
//               userId: doc.data().userId1,
//               friendshipDate: doc.data().friendshipDate || 0,
//             })),
//           ];

//           // Fetch posts
//           const postsQuery = query(
//             collection(db, "Posts"),
//             where("userId", "in", [user.uid, ...friendsList.map((friend) => friend.userId)]),
//             orderBy("timestamp", "desc"),
//             limit(10)
//           );

//           const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
//             const postsData = snapshot.docs.map((doc) => {
//               const postData = doc.data();
//               const postTimestamp = postData.timestamp
//                 ? typeof postData.timestamp.toMillis === 'function'
//                   ? postData.timestamp.toMillis() // Firestore Timestamp
//                   : postData.timestamp // Already a number
//                 : 0; // Default value

//               return {
//                 id: doc.id,
//                 image: postData.image || null,
//                 text: postData.text,
//                 liked: postData.liked || false,
//                 likeCount: postData.likeCount || 0,
//                 mediaUrl: postData.mediaUrl,
//                 userId: postData.userId || "",
//                 timestamp: postTimestamp,
//               };
//             });

//             setPosts(postsData);
//             setLoadingPosts(false);
//           });

//           return () => unsubscribe(); // Cleanup function
//         } catch (error) {
//           console.error("Error fetching data: ", error);
//           setError("Failed to load posts. Please try again later.");
//           setLoadingPosts(false);
//         }
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       {loadingPosts ? (
//         <div>Loading posts...</div>
//       ) : error ? (
//         <div>{error}</div>
//       ) : (
//         <div>
//           {posts.map((post) => (
//             <div key={post.id}>
//               <h3>{post.text}</h3>
//               <p>Posted by: {post.userId}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Profile;




import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import FormToPost from "./FormToPost";
import { addDoc, collection, query, where, limit, onSnapshot, getDocs, deleteDoc, doc, updateDoc, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import Settings from "./Settings";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { Post } from "./PostInterface";
import { FaUserFriends } from "react-icons/fa";

function Profile() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [friendsCount, setFriendsCount] = useState<number>(0);
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
            where("userId", "in", [user.uid, ...friendsList.map((friend) => friend.userId)]),
            orderBy("timestamp", "desc"),
            limit(10)
          );

          const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
            const postsData = snapshot.docs
              .map((doc) => {
                const postData = doc.data();
                const postTimestamp = postData.timestamp
                  ? typeof postData.timestamp.toMillis === 'function'
                    ? postData.timestamp.toMillis() // Firestore Timestamp
                    : postData.timestamp // Already a number
                  : 0; // Default value

                const isPostAfterFriendship = friendsList.some(
                  (friend) =>
                    friend.userId === postData.userId &&
                    postTimestamp >= friend.friendshipDate
                );

                if (postData.userId === user.uid || isPostAfterFriendship) {
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

                return null;
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

  const handleSubmit = async (text: string, image: string | null, mediaUrl: string) => {
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
        const newLikeCount = newLikedState ? post.likeCount + 1 : post.likeCount - 1;

        await updateDoc(postRef, {
          liked: newLikedState,
          likeCount: newLikeCount,
        });

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id ? { ...post, liked: newLikedState, likeCount: newLikeCount } : post
          )
        );
      }
    } catch (error) {
      console.error("Error updating like: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
      <button
        onClick={() => navigate('/follow-system')}
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

      {showForm && <FormToPost onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}

      <div className="mt-30 w-full flex flex-col items-center gap-4">
        {loadingPosts ? (
          <div className="text-gray-600 text-lg">Loading posts...</div>
        ) : error ? (
          <div className="text-red-500 text-lg">{error}</div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10">
            <p className="text-gray-600 text-lg mb-4">No posts yet.</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handleDelete} onLike={handleLike} />
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;