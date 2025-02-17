// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Profile from "./componets/Profile";
// import Login from "./componets/Login";
// import Signup from "./componets/Signup";

// const App: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const [userEmail, setUserEmail] = useState<string>("");

//   useEffect(() => {
//     const loggedIn = localStorage.getItem("isLoggedIn") === "true";
//     const email = localStorage.getItem("userEmail") || "";
//     setIsLoggedIn(loggedIn);
//     setUserEmail(email);
//   }, []);

//   const handleLogin = (email: string) => {
//     localStorage.setItem("isLoggedIn", "true");
//     localStorage.setItem("userEmail", email);
//     setIsLoggedIn(true);
//     setUserEmail(email);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("userEmail");
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
import Signup from "./componets/Signup";
import Cookies from "js-cookie"; // استيراد مكتبة الكوكيز

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // جلب الكوكيز عند تحميل الصفحة
    const loggedIn = Cookies.get("isLoggedIn") === "true";
    const email = Cookies.get("userEmail") || "";
    setIsLoggedIn(loggedIn);
    setUserEmail(email);
  }, []);

  const handleLogin = (email: string) => {
    // تخزين الكوكيز عند تسجيل الدخول
    Cookies.set("isLoggedIn", "true", { expires: 365 }); // الكوكيز ستنتهي بعد 7 أيام
    Cookies.set("userEmail", email, { expires: 365 });
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    // إزالة الكوكيز عند تسجيل الخروج
    Cookies.remove("isLoggedIn");
    Cookies.remove("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
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


