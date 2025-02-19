








// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, googleProvider } from './firebase'; // تأكد من استيراد auth و googleProvider
// import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"; // استيراد الدوال الخاصة بالتسجيل

// interface LoginProps {
//   onLogin: (email: string) => void;
// }

// const Login: React.FC<LoginProps> = ({ onLogin }) => {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [error, setError] = useState<string>(""); // إضافة حالة للأخطاء
//   const [isLoading, setIsLoading] = useState<boolean>(false); // حالة تحميل
//   const navigate = useNavigate();

//   // تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
//   const handleEmailLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(""); // إعادة تعيين الخطأ عند محاولة تسجيل الدخول

//     if (!email || !password) {
//       setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور.");
//       return;
//     }

//     setIsLoading(true); // تفعيل حالة التحميل
//     try {
//       // تسجيل الدخول باستخدام Firebase
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       onLogin(email); // تسجيل الدخول
//       navigate(`/profile/${user.uid}`); // الانتقال إلى صفحة الملف الشخصي
//     } catch  {
//       setError("فشل تسجيل الدخول، تأكد من البيانات.");
//     } finally {
//       setIsLoading(false); // تعطيل حالة التحميل
//     }
//   };

//   // تسجيل الدخول باستخدام حساب Google
//   const handleGoogleLogin = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     setError(""); // إعادة تعيين الخطأ عند محاولة تسجيل الدخول باستخدام Google

//     setIsLoading(true); // تفعيل حالة التحميل
//     try {
//       // تسجيل الدخول باستخدام Google
//       await signInWithPopup(auth, googleProvider);
//       const user = auth.currentUser;
//       if (user) {
//         onLogin(user.email || ""); // تسجيل الدخول باستخدام البريد الإلكتروني الخاص بحساب Google
//         navigate(`/profile/${user.email}`); // الانتقال إلى صفحة الملف الشخصي
//       }
//     } catch {
//       setError("فشل تسجيل الدخول باستخدام Google، جرب مرة أخرى.");
//     } finally {
//       setIsLoading(false); // تعطيل حالة التحميل
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <form
//         className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
//         onSubmit={handleEmailLogin}
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h2>
//         <input
//           type="email"
//           placeholder="البريد الإلكتروني"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 mb-4 border rounded-lg"
//           required
//         />
//         <input
//           type="password"
//           placeholder="كلمة المرور"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 mb-4 border rounded-lg"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
//           disabled={isLoading} // تعطيل الزر أثناء التحميل
//         >
//           {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
//         </button>
//         {error && <p className="text-red-500 text-center mt-4">{error}</p>} {/* عرض الخطأ */}
//         <button
//           onClick={handleGoogleLogin}
//           className="w-full mt-2 bg-red-500 text-white p-2 rounded-lg"
//           disabled={isLoading} // تعطيل الزر أثناء التحميل
//         >
//           {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول باستخدام Google"}
//         </button>
      
//       </form>

//       <div className="mt-4">
   

//       <p className="mt-4 text-center">
//         ليس لديك حساب؟{" "}
//         <a href="/signup" className="text-blue-500 hover:underline">
//           أنشئ حسابًا
//         </a>
//       </p>
//       </div>
//     </div>
//   );
// };

// export default Login;




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

interface LoginProps {
  onLogin: (userId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      onLogin(user.uid);
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
      const user = userCredential.user; // ✅ استخدم user مباشرة بعد تسجيل الدخول
      onLogin(user.uid);
      navigate(`/profile/${user.uid}`); // ✅ استخدم uid بدلاً من email
    } catch {
      setError("فشل تسجيل الدخول باستخدام Google، جرب مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm" onSubmit={handleEmailLogin}>
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



