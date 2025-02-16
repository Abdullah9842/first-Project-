import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignupProps {
  onSignup: (email: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا يمكنك إضافة عملية التسجيل (مثل إرسال البيانات إلى API)
    onSignup(email); // تسجيل الدخول بعد التسجيل
    navigate(`/profile/${email}`); // الانتقال إلى صفحة الملف الشخصي
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={handleSignup}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">إنشاء حساب</h2>
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
          className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
        >
          إنشاء حساب
        </button>
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