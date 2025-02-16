
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


