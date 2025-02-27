import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "./firebase"; // تأكد من أن db يتم تصديره من Firebase
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore"; // تأكد من استيراد هذه الدوال من Firestore

interface LoginProps {
  onLogin: (userId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

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
        <h2 className="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h2>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />

        <input
          type="password"
          placeholder="كلمة المرور"
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
          {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول باستخدام Google"}
        </button>
      </form>

      <p className="mt-4 text-center">
        ليس لديك حساب؟{" "}
        <a href="/signup" className="text-blue-500 hover:underline">
          أنشئ حسابًا
        </a>
      </p>
    </div>
  );
};

export default Login;
