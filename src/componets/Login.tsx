import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا يمكنك إضافة التحقق من صحة البيانات مع قاعدة البيانات أو API
    onLogin(email); // تسجيل الدخول
    navigate(`/profile/${email}`); // الانتقال إلى صفحة الملف الشخصي
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={handleLogin}
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
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          تسجيل الدخول
        </button>
        <p className="mt-4 text-center">
          ليس لديك حساب؟{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            أنشئ حسابًا
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;