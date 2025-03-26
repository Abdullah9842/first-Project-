import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, googleProvider } from "./firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";

interface LoginProps {
  onLogin: (userId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  // دالة لحفظ بيانات المستخدم في Firestore
  const saveUserToFirestore = async (userId: string, email: string) => {
    const userRef = doc(db, "Users", userId);
    try {
      await setDoc(
        userRef,
        {
          email,
          userId,
          username: email.split("@")[0], // إضافة اسم مستخدم افتراضي
          createdAt: Timestamp.fromDate(new Date()),
          photoURL: auth.currentUser?.photoURL || null,
          name: auth.currentUser?.displayName || email.split("@")[0],
        },
        { merge: true }
      ); // استخدام merge لتجنب الكتابة فوق البيانات الموجودة
    } catch (err) {
      console.error("Error saving user data:", err);
    }
  };

  // تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      onLogin(user.uid);
      await saveUserToFirestore(user.uid, email); // حفظ البيانات في Firestore
      navigate(`/profile/${user.uid}`);
    } catch {
      setError("فشل تسجيل الدخول، تأكد من البيانات.");
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الدخول باستخدام Google
  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      onLogin(user.uid);
      await saveUserToFirestore(user.uid, user.email || ""); // حفظ البيانات في Firestore
      navigate(`/profile/${user.uid}`);
    } catch {
      setError("فشل تسجيل الدخول باستخدام Google، جرب مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={handleEmailLogin}
      >
        <h2
          className={`text-xl font-bold mb-6 ${
            language === "ar" ? "text-right w-full" : "text-left"
          }`}
        >
          {t("welcome.back")}
        </h2>

        <input
          type="email"
          placeholder={t("login.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />

        <input
          type="password"
          placeholder={t("login.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? t("login.loading") : t("login.button")}
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="my-4 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">{t("login.or")}</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-2 bg-white-200 border-1 text-black p-2 rounded-2xl hover:bg-red-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            t("login.loading")
          ) : (
            <>
              <FcGoogle className="text-lg" />
              <span>{t("login.google")}</span>
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center">
        {t("login.noAccount")}{" "}
        <a href="/signup" className="text-blue-500 hover:underline">
          {t("login.signUp")}
        </a>
      </p>
    </div>
  );
};

export default Login;
