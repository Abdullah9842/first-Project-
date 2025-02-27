import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Profile from "./componets/Profile";
import Login from "./componets/Login";
import Signup from "./componets/SignUp";
import { auth, db } from "./componets/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Cookies from "js-cookie";
import "./index.css";
import FollowSystem from "./componets/FollowSystem";
import { doc, getDoc } from "firebase/firestore";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark" | "pink">("light");

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

  useEffect(() => {
    const loadUserTheme = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists() && userDoc.data().theme) {
            setTheme(userDoc.data().theme);
          }
        } catch (error) {
          console.error("Error loading theme:", error);
        }
      }
    };

    loadUserTheme();
  }, []);

  // تطبيق الألوان حسب الثيم
  useEffect(() => {
    document.body.className = theme;

    // تحديث متغيرات CSS للألوان
    if (theme === "pink") {
      document.documentElement.style.setProperty("--primary-color", "#ec4899");
      document.documentElement.style.setProperty(
        "--secondary-color",
        "#fbcfe8"
      );
      document.documentElement.style.setProperty(
        "--background-color",
        "#fdf2f8"
      );
    } else if (theme === "dark") {
      document.documentElement.style.setProperty("--primary-color", "#1f2937");
      document.documentElement.style.setProperty(
        "--secondary-color",
        "#374151"
      );
      document.documentElement.style.setProperty(
        "--background-color",
        "#111827"
      );
    } else {
      document.documentElement.style.setProperty("--primary-color", "#3b82f6");
      document.documentElement.style.setProperty(
        "--secondary-color",
        "#93c5fd"
      );
      document.documentElement.style.setProperty(
        "--background-color",
        "#f3f4f6"
      );
    }
  }, [theme]);

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
    <div>
      <Router>
        <Routes>
          {/* الصفحة الرئيسية هي البروفايل مباشرة إذا كان المستخدم مسجل دخوله */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to={`/profile/${userId}`} replace />
              ) : (
                <Navigate to="/signup" replace />
              )
            }
          />
          {/* إذا كان المستخدم مسجل دخوله، يتم توجيهه مباشرة إلى البروفايل */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to={`/profile/${userId}`} replace />
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
                <Navigate to={`/profile/${userId}`} replace />
              ) : (
                <Signup onSignup={handleLogin} />
              )
            }
          />
          {/* صفحة البروفايل */}
          <Route
            path="/profile/:userId"
            element={
              isLoggedIn ? <Profile /> : <Navigate to="/login" replace />
            }
          />
          {/* صفحة FollowSystem */}
          <Route
            path="/follow-system"
            element={
              isLoggedIn ? <FollowSystem /> : <Navigate to="/login" replace />
            }
          />
          {/* صفحة FollowUser */}
          {/* صفحة الخطأ 404 */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>

        {/* زر تسجيل الخروج يظهر فقط عندما يكون المستخدم مسجل دخوله */}
        {isLoggedIn && (
          <button
            hidden
            onClick={handleLogout}
            className="fixed bottom-5 left-6 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </Router>
    </div>
  );
};

export default App;
