import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase"; // تأكد من أن المسار صحيح

interface SignupProps {
  onSignup: (email: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!validateEmail(email)) {
      setError("البريد الإلكتروني غير صحيح");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("كلمة المرور يجب أن تكون على الأقل 6 أحرف");
      setIsLoading(false);
      return;
    }

    try {
      // إنشاء حساب جديد
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // تحديث ملف تعريف المستخدم بإضافة الاسم
      await updateProfile(user, { displayName: name });

      // تمرير البريد الإلكتروني إلى الدالة onSignup
      onSignup(user.email || "");

      // إعادة التوجيه إلى الصفحة الرئيسية
      navigate("/");
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message); // عرض رسالة الخطأ للمستخدم
      } else {
        setError("حدث خطأ غير معروف");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={handleSignup}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">إنشاء حساب</h2>

        {/* حقل الاسم */}
        <input
          type="text"
          placeholder="الاسم"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />

        {/* حقل البريد الإلكتروني */}
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />

        {/* حقل كلمة المرور */}
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />

        {/* زر التسجيل */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "جاري التسجيل..." : "إنشاء حساب"}
        </button>

        {/* عرض رسالة الخطأ */}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {/* رابط تسجيل الدخول */}
        <p className="mt-4 text-center">
          لديك حساب بالفعل؟{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            سجل الدخول
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;