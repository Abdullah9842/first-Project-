
// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Profile from "./componets/Profile";
// import Login from "./componets/Login";
// import Signup from "./componets/SignUp";
// import Cookies from "js-cookie"; // استيراد مكتبة الكوكيز

// const App: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const [userEmail, setUserEmail] = useState<string>("");

//   useEffect(() => {
//     // جلب الكوكيز عند تحميل الصفحة
//     const loggedIn = Cookies.get("isLoggedIn") === "true";
//     const email = Cookies.get("userEmail") || "";
//     console.log("isLoggedIn:", loggedIn); // تتبع الكوكيز
//     console.log("userEmail:", email); // تتبع الكوكيز
//     setIsLoggedIn(loggedIn);
//     setUserEmail(email);
//   }, []);

//   const handleLogin = (email: string) => {
//     // تخزين الكوكيز عند تسجيل الدخول
//     Cookies.set("isLoggedIn", "true", { expires: 365 }); // الكوكيز ستنتهي بعد 365 يومًا
//     Cookies.set("userEmail", email, { expires: 365 });
//     setIsLoggedIn(true);
//     setUserEmail(email);
//   };

//   const handleLogout = () => {
//     // إزالة الكوكيز عند تسجيل الخروج
//     Cookies.remove("isLoggedIn");
//     Cookies.remove("userEmail");
//     setIsLoggedIn(false);
//     setUserEmail("");
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={isLoggedIn ? <Navigate to={`/profile/${userEmail}`} /> : <Navigate to="/login" />} />
//         <Route path="/login" element={isLoggedIn ? <Navigate to={`/profile/${userEmail}`} /> : <Login onLogin={handleLogin} />} />
//         <Route path="/signup" element={isLoggedIn ? <Navigate to={`/profile/${userEmail}`} /> : <Signup onSignup={handleLogin} />} />
//         <Route path="/profile/:email" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
//         <Route path="*" element={<div>404 - Page Not Found</div>} />
//       </Routes>
//       {isLoggedIn && (
//         <button onClick={handleLogout} className="fixed bottom-5 left-6 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">
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
import { auth } from './componets/firebase'; // تأكد من استيراد auth
import { onAuthStateChanged } from 'firebase/auth'; // استيراد الدالة للتحقق من حالة الجلسة
import Cookies from "js-cookie";
import { signOut } from 'firebase/auth'; // تأكد من استيراد الدالة signOut من Firebase
import './index.css';


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // التحقق من حالة المستخدم عند تحميل الصفحة
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email || ""); // تعيين البريد الإلكتروني للمستخدم
        Cookies.set("isLoggedIn", "true", { expires: 365 });
        Cookies.set("userEmail", user.email || "", { expires: 365 });
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
        Cookies.remove("isLoggedIn");
        Cookies.remove("userEmail");
      }
    });
  }, []);

  const handleLogin = (email: string) => {
    // لا حاجة لتخزين الكوكيز يدويًا هنا، حيث أن Firebase يدير الجلسة

    Cookies.set("isLoggedIn", "true", { expires: 365 });
    Cookies.set("userEmail", email, { expires: 365 });
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = async () => {
    // إزالة الكوكيز عند تسجيل الخروج
    try { 
    Cookies.remove("isLoggedIn");
    Cookies.remove("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
  await signOut(auth);
} catch (error) {
  console.error("Error logging out:", error);}

  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to={`/profile/${userEmail}`} /> : <Navigate to="/login" />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to={`/profile/${userEmail}`} /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to={`/profile/${userEmail}`} /> : <Signup onSignup={handleLogin} />} />
        <Route path="/profile/:email" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      {isLoggedIn && (
        <button onClick={handleLogout} className="fixed bottom-5 left-6 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">
          Logout
        </button>
      )}
    </Router>
  );
};

export default App;
