

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { auth } from "./firebase";

// interface SignupProps {
//   onSignup: (email: string) => void;
// }

// const Signup: React.FC<SignupProps> = ({ onSignup }) => {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [name, setName] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const navigate = useNavigate();

//   const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
  
//     try {
//       // إنشاء الحساب
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user; // ✅ تعريف user هنا
  
//       // تحديث الاسم
//       await updateProfile(user, { displayName: name });
  
//       // تمرير userId بدلاً من email
//       onSignup(user.uid);
  
//       // توجيه المستخدم إلى صفحة البروفايل الخاصة به
//       navigate(`/profile/${user.uid}`);
  
//     } catch (error: unknown) {
//       console.error(error);
//       if (error instanceof Error) {
//         setError(error.message); // عرض رسالة الخطأ
//       } else {
//         setError("An unknown error occurred");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
  

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <form
//         className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
//         onSubmit={handleSignup}
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">Create an Account</h2>

//         {/* Name field */}
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full p-2 mb-4 border rounded-lg"
//           required
//         />

//         {/* Email field */}
//         <input
//           type="email"
//           placeholder="Email Address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 mb-4 border rounded-lg"
//           required
//         />

//         {/* Password field */}
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 mb-4 border rounded-lg"
//           required
//         />

//         {/* Signup button */}
//         <button
//           type="submit"
//           className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
//           disabled={isLoading}
//         >
//           {isLoading ? "Signing up..." : "Create Account"}
//         </button>

//         {/* Error message */}
//         {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

//         {/* Login link */}
//         <p className="mt-4 text-center">
//           Already have an account?{" "}
//           <a href="/login" className="text-blue-500 hover:underline">
//             Log In
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Signup;










import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { db } from "./firebase"; // تأكد من استيراد db من Firebase
import { doc, setDoc } from "firebase/firestore"; // تأكد من استيراد هذه الدوال من Firestore

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

  const saveUserToFirestore = async (userId: string, email: string, name: string) => {
    const userRef = doc(db, "Users", userId);
    try {
      // حفظ بيانات المستخدم في Firestore
      await setDoc(userRef, {
        email: email,
        userId: userId,
        name: name,
        createdAt: new Date(), // حفظ وقت التسجيل
      });
    } catch (err) {
      console.error("Error saving user data to Firestore: ", err);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      // إنشاء الحساب
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // ✅ تعريف user هنا
  
      // تحديث الاسم
      await updateProfile(user, { displayName: name });
  
      // حفظ البيانات في Firestore
      await saveUserToFirestore(user.uid, email, name);
  
      // تمرير userId بدلاً من email
      onSignup(user.uid);
  
      // توجيه المستخدم إلى صفحة البروفايل الخاصة به
      navigate(`/profile/${user.uid}`);
  
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message); // عرض رسالة الخطأ
      } else {
        setError("An unknown error occurred");
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
        <h2 className="text-2xl font-bold mb-4 text-center">Create an Account</h2>

        {/* Name field */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />

        {/* Email field */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />

        {/* Password field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />

        {/* Signup button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Create Account"}
        </button>

        {/* Error message */}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {/* Login link */}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
