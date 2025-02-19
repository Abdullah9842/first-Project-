
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { auth } from "./firebase.js"; // Make sure the path is correct

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
//       // Create a new account
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Update the user profile with the name
//       await updateProfile(user, { displayName: name });

//       // Pass the email to the onSignup function
//       onSignup(user.email || "");

//       // Redirect to the homepage
//       navigate("/");
//     } catch (error: unknown) {
//       console.error(error);
//       if (error instanceof Error) {
//         setError(error.message); // Display the error message to the user
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

  // const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     // Create a new account
  //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;

  //     // Update the user profile with the name
  //     await updateProfile(user, { displayName: name });

  //     // Pass the email to the onSignup function
  //     onSignup(user.uid || "");

  //     // Check if the user has a username set, if not, navigate to SetUsername page
  //     if (!user.displayName) {
  //       navigate("/set-username");
  //     } else {
  //       navigate("/"); // Redirect to homepage
  //     }
  //   } catch (error: unknown) {
  //     console.error(error);
  //     if (error instanceof Error) {
  //       setError(error.message); // Display the error message to the user
  //     } else {
  //       setError("An unknown error occurred");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
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










