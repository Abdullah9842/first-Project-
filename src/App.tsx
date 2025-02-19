

// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
  
// } from "react-router-dom";
// import Profile from "./componets/Profile";
// import Login from "./componets/Login";
// import Signup from "./componets/SignUp";
// import { auth } from "./componets/firebase"; // تأكد من استيراد auth
// import { onAuthStateChanged } from "firebase/auth"; // استيراد الدالة للتحقق من حالة الجلسة
// import Cookies from "js-cookie";
// import { signOut } from "firebase/auth"; // تأكد من استيراد الدالة signOut من Firebase
// import "./index.css";
// import Settings from "./componets/Settings";
// // import { ThemeProvider } from "next-themes";

// const App: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const [userEmail, setUserEmail] = useState<string>("");
//   const [showSettings, setShowSettings] = useState<boolean>(false); // أضفنا هذه السطر لإدارة حالة الإعدادات

//   useEffect(() => {
//     // التحقق من حالة المستخدم عند تحميل الصفحة
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setIsLoggedIn(true);
//         setUserEmail(user.email || ""); // تعيين البريد الإلكتروني للمستخدم
//         Cookies.set("isLoggedIn", "true", { expires: 365 });
//         Cookies.set("userEmail", user.email || "", { expires: 365 });
//       } else {
//         setIsLoggedIn(false);
//         setUserEmail("");
//         Cookies.remove("isLoggedIn");
//         Cookies.remove("userEmail");
//       }
//     });
//   }, []);

//   const handleLogout = async () => {
//     // إزالة الكوكيز عند تسجيل الخروج
//     try {
//       Cookies.remove("isLoggedIn");
//       Cookies.remove("userEmail");
//       setIsLoggedIn(false);
//       setUserEmail("");
//       await signOut(auth);
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   const handleLogin = (email: string) => {
//     // لا حاجة لتخزين الكوكيز يدويًا هنا، حيث أن Firebase يدير الجلسة
//     Cookies.set("isLoggedIn", "true", { expires: 365 });
//     Cookies.set("userEmail", email, { expires: 365 });
//     setIsLoggedIn(true);
//     setUserEmail(email);
//   };
//   const toggleSettings = () => {
//     setShowSettings((prevState) => !prevState); // عكس حالة الإعدادات
//   };

//   return (
//     // <ThemeProvider> 
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             isLoggedIn ? (
//               <Navigate to={`/profile/${userEmail}`} />
//             ) : (
//               <Navigate to="/login" />
//             )
//           }
//         />
//         <Route
//           path="/login"
//           element={
//             isLoggedIn ? (
//               <Navigate to={`/profile/${userEmail}`} />
//             ) : (
//               <Login onLogin={handleLogin} />
//             )
//           }
//         />
//         <Route
//           path="/signup"
//           element={
//             isLoggedIn ? (
//               <Navigate to={`/profile/${userEmail}`} />
//             ) : (
//               <Signup onSignup={handleLogin} />
//             )
//           }
//         />
//         <Route
//           path="/profile/:email"
//           element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
//         />
//         <Route path="*" element={<div>404 - Page Not Found</div>} />
//       </Routes>
//       {isLoggedIn && (
//         <>
   

//           {/* إظهار إعدادات في حالة تفعيلها */}
//           {showSettings && (
//             <Settings onClose={toggleSettings} handleLogout={handleLogout} />
//           )}
//         </>
//       )}
//     </Router>
//     // </ThemeProvider> 

//   );
// };

// export default App;

// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Profile from "./componets/Profile";
// import Login from "./componets/Login";
// import Signup from "./componets/SignUp";
// import { auth } from './componets/firebase';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import Cookies from "js-cookie";
// import './index.css';

// const App: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Cookies.get("isLoggedIn") === "true");
//   const [userId, setUserId] = useState<string>(Cookies.get("userId") || "");

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setIsLoggedIn(true);
//         setUserId(user.uid);
//         Cookies.set("isLoggedIn", "true", { expires: 365 });
//         Cookies.set("userId", user.uid, { expires: 365 });
//       } else {
//         setIsLoggedIn(false);
//         setUserId("");
//         Cookies.remove("isLoggedIn");
//         Cookies.remove("userId");
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       setIsLoggedIn(false);
//       setUserId("");
//       Cookies.remove("isLoggedIn");
//       Cookies.remove("userId");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   const handleLogin = (userId: string) => {
//     setIsLoggedIn(true);
//     setUserId(userId);
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={isLoggedIn ? <Navigate to={`/profile/${userId}`} replace /> : <Navigate to="/login" replace />} />
//         <Route path="/login" element={isLoggedIn ? <Navigate to={`/profile/${userId}`} replace /> : <Login onLogin={handleLogin} />} />
//         <Route path="/signup" element={isLoggedIn ? <Navigate to={`/profile/${userId}`} replace /> : <Signup onSignup={handleLogin} />} />
//         <Route path="/profile/:userId" element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} />
//         <Route path="*" element={<div>404 - Page Not Found</div>} />
//       </Routes>
//       {isLoggedIn && (
//         <button hidden onClick={handleLogout} className="fixed bottom-5 left-6 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">
//           Logout
//         </button>
//       )}
//     </Router>
//   );
// };

// export default App;


import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Profile from "./componets/Profile";
import Login from "./componets/Login";
import Signup from "./componets/SignUp";
import { auth } from './componets/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Cookies from "js-cookie";
import './index.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Cookies.get("isLoggedIn") === "true");
  const [userId, setUserId] = useState<string>(Cookies.get("userId") || "");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid);
        Cookies.set("isLoggedIn", "true", { expires: 365 });
        Cookies.set("userId", user.uid, { expires: 365 });
      } else {
        setIsLoggedIn(false);
        setUserId("");
        Cookies.remove("isLoggedIn");
        Cookies.remove("userId");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUserId("");
      Cookies.remove("isLoggedIn");
      Cookies.remove("userId");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogin = (userId: string) => {
    setIsLoggedIn(true);
    setUserId(userId);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to={`/profile/${userId}`} replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to={`/profile/${userId}`} replace /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to={`/profile/${userId}`} replace /> : <Signup onSignup={handleLogin} />} />
        <Route path="/profile/:userId" element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      {isLoggedIn && (
        <button hidden onClick={handleLogout} className="fixed bottom-5 left-6 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">
          Logout
        </button>
      )}
    </Router>
  );
};

export default App;
