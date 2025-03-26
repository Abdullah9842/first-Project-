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
import { LanguageProvider } from "./contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import "./i18n";
import { FaBell } from "react-icons/fa";
import Notifications from "./componets/Notifications";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark" | "pink">("light");
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "ar";
  });
  const [showNotifications, setShowNotifications] = useState(false);

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

  useEffect(() => {
    document.documentElement.lang = language;
    document.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("language", language);
    i18n.changeLanguage(language);
  }, [i18n, language]);

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

  const handleLanguageChange = () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    document.documentElement.lang = newLang;
    document.dir = newLang === "ar" ? "rtl" : "ltr";
    i18n.changeLanguage(newLang);
  };

  return (
    <LanguageProvider>
      <div>
        <Router>
          <div className="fixed top-4 right-4 flex gap-2 z-50">
            {!isLoggedIn ? (
              <button
                onClick={handleLanguageChange}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                {language === "en" ? "العربية" : "English"}
              </button>
            ) : (
              <button
                onClick={() => setShowNotifications(true)}
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
              >
                <FaBell className="text-xl" />
              </button>
            )}
          </div>

          {isLoggedIn && showNotifications && (
            <Notifications onClose={() => setShowNotifications(false)} />
          )}

          <Routes>
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
            <Route
              path="/profile/:userId"
              element={
                isLoggedIn ? <Profile /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/follow-system"
              element={
                isLoggedIn ? <FollowSystem /> : <Navigate to="/login" replace />
              }
            />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>

          {isLoggedIn && (
            <button
              hidden
              onClick={handleLogout}
              className="fixed bottom-5 left-6 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
            >
              {language === "en" ? "Logout" : "تسجيل الخروج"}
            </button>
          )}
        </Router>
      </div>
    </LanguageProvider>
  );
};

export default App;
