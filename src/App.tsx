
// import React, { useEffect, useState } from "react";
// import PostForm from "./componets/PostForm";
// import PostItem from "./componets/PostItem";
// import JadeLogo from "./assets/Screenshot_1446-08-07_at_10.01.56_PM-removebg-preview.png";
// import Settings from "./componets/Settings"; // استيراد الإعدادات
// import SignUp from "./componets/SignUp"


// interface Post {
//   image: string | null;
//   text: string;
//   id: number;
//   liked: boolean;
//   likeCount: number;
//   spotifyUrl?: string;
// }

// const App: React.FC = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [showSettings, setShowSettings] = useState<boolean>(false); // حالة لإظهار الإعدادات
//   const [isSignedUp, setIsSignedUp] = useState<boolean>(false);

//   useEffect(() => {
//     const storedPosts = localStorage.getItem("posts");
//     if (storedPosts) {
//       setPosts(JSON.parse(storedPosts));
//     }
//   }, []);


//   const handleSignUp = (email: string, password: string) => {
//     console.log("User signed up with:", email, password);
//     setIsSignedUp(true);
//   };

//   const handleAddPost = (newPost: Post) => {
//     setPosts((prev) => {
//       const updatedPosts = [newPost, ...prev];
//       localStorage.setItem("posts", JSON.stringify(updatedPosts));
//       return updatedPosts;
//     });
//   };

//   const handleDelete = (id: number) => {
//     if (window.confirm("Are you sure you want to delete this post?")) {
//       setPosts((prev) => {
//         const updatedPosts = prev.filter((post) => post.id !== id);
//         localStorage.setItem("posts", JSON.stringify(updatedPosts));
//         return updatedPosts;
//       });
//     }
//   };

//   const handleLikes = (id: number) => {
//     setPosts((prev) =>
//       prev.map((post) =>
//         post.id === id
//           ? {
//               ...post,
//               liked: !post.liked,
//               likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1,
//             }
//           : post
//       )
//     );
//   };

//   const toggleSettings = () => {
//     setShowSettings((prev) => !prev);
//   };

//   return (
//     <> 
//     <div className="min-h-screen bg-gray-200 flex items-center justify-center">
//     {isSignedUp ? (
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h2 className="text-xl font-semibold text-center">Welcome! You are successfully signed up.</h2>
//       </div>
//     ) : (
//       <SignUp onSignUp={handleSignUp} />
//     )}
//   </div>

//     <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
//       <img className="w-15" src={JadeLogo} alt="Jade Logo" />
//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-300 fixed bottom-5 right-6 transition mb-5"
//         onClick={() => setShowForm(true)}
//       >
//         +
//       </button>

//       <button
//         className="bg-gray-600 text-white px-4 py-2 rounded-full fixed bottom-5 left-6 transition mb-5"
//         onClick={toggleSettings}
//       >
//         ⚙️
//       </button>

//       {showForm && <PostForm onAddPost={handleAddPost} setShowForm={setShowForm} />}
      
//       <div className="mt-6 w-full flex flex-col items-center gap-4">
//         {posts.map((post) => (
//           <PostItem key={post.id} post={post} onDelete={handleDelete} onLikes={handleLikes} />
//         ))}
//       </div>
//       {showSettings && <Settings onClose={toggleSettings} />} {/* إظهار الإعدادات */}
//     </div>
//     </>
//   );
// };

// export default App;
// App.tsx

// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import SignUp from './componets/SignUp';
// import Profile from './componets/Profile';

// const App: React.FC = () => {
//   const isLoggedIn = localStorage.getItem("user"); // or use state management

//   return (
//     <Router>
//       <Routes>
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/signup" />} />
//         <Route path="/" element={<Navigate to={isLoggedIn ? "/profile" : "/signup"} />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;







import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Profile from "./componets/Profile";
import Login from "./componets/Login";
import Signup from "./componets/SignUp";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [userEmail, setUserEmail] = useState<string>(
    localStorage.getItem("userEmail") || ""
  );

  // تسجيل الدخول
  const handleLogin = (email: string) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
  };

  return (
    <Router>
      <Routes>
        {/* الصفحة الرئيسية */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to={`/profile/${userEmail}`} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* صفحة تسجيل الدخول */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to={`/profile/${userEmail}`} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* صفحة التسجيل */}
        <Route
          path="/signup"
          element={
            isLoggedIn ? (
              <Navigate to={`/profile/${userEmail}`} />
            ) : (
              <Signup onSignup={handleLogin} />
            )
          }
        />

        {/* صفحة الملف الشخصي */}
        <Route
          path="/profile/:email"
          element={
            isLoggedIn ? (
              <Profile />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* صفحة غير موجودة */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>

      {/* زر تسجيل الخروج */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="fixed bottom-5 left-6 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}
    </Router>
  );
};

export default App;